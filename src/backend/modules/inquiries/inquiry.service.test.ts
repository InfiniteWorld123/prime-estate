import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	poolQuery: vi.fn(),
	poolConnect: vi.fn(),
	clientQuery: vi.fn(),
	release: vi.fn(),
}));

vi.mock("#/backend/db/pool", () => ({
	pool: {
		query: mocks.poolQuery,
		connect: mocks.poolConnect,
	},
}));

import { AppError } from "#/backend/shared/error";
import {
	archiveInquiryService,
	createInquiryService,
	isInquiryStatusTransitionAllowed,
	listInquiriesService,
	markInquiryReadService,
	unarchiveInquiryService,
	updateInquiryStatusService,
} from "./inquiry.service";

const inquiryRow = {
	id: "c9ebf576-4a85-472e-9f18-e719b9ad0afb",
	inquiry_type: "GENERAL" as const,
	interest: "BUYING" as const,
	full_name: "Max Mustermann",
	email: "max@example.de",
	phone: null,
	message: "Please contact me.",
	lead_status: "NEW" as const,
	read_at: null,
	archived_at: null,
	privacy_policy_version: "v1",
	privacy_accepted_at: new Date("2026-08-27T12:00:00.000Z"),
	listing_id: null,
	listing_title: null,
	listing_slug: null,
	reference_number: null,
	listing_type: null,
	listing_status: null,
	archive_outcome: null,
	created_at: new Date("2026-08-27T12:00:00.000Z"),
	updated_at: new Date("2026-08-27T12:00:00.000Z"),
};

describe("inquiry service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.poolConnect.mockResolvedValue({
			query: mocks.clientQuery,
			release: mocks.release,
		});
	});

	it("silently accepts a filled honeypot without touching PostgreSQL", async () => {
		await expect(
			createInquiryService({
				inquiry_type: "GENERAL",
				interest: "GENERAL",
				full_name: "Bot",
				email: "bot@example.de",
				message: "Spam",
				privacy_accepted: true,
				website: "https://spam.example",
			}),
		).resolves.toEqual({ received: true });

		expect(mocks.poolConnect).not.toHaveBeenCalled();
	});

	it("rejects unavailable listing slugs without revealing listing state", async () => {
		mocks.clientQuery
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [] });

		try {
			await createInquiryService({
				inquiry_type: "LISTING",
				listing_slug: "hidden-listing",
				full_name: "Max Mustermann",
				email: "max@example.de",
				message: "Please contact me.",
				privacy_accepted: true,
				website: "",
			});
			expect.fail("Expected createInquiryService to reject");
		} catch (error) {
			expect(error).toBeInstanceOf(AppError);
			expect((error as AppError).status).toBe(404);
			expect((error as AppError).message).toBe("Listing is not available");
		}

		expect(mocks.clientQuery).toHaveBeenCalledWith(
			expect.stringContaining("status = 'PUBLISHED'"),
			["hidden-listing"],
		);
		expect(mocks.clientQuery).toHaveBeenCalledWith("ROLLBACK");
	});

	it("stores a listing inquiry only after resolving a published slug", async () => {
		mocks.clientQuery
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [{ id: "listing-id" }] })
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [{ total_count: "0" }] })
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [] });

		await expect(
			createInquiryService({
				inquiry_type: "LISTING",
				listing_slug: "ruhige-wohnung-weimar",
				full_name: "Max Mustermann",
				email: "max@example.de",
				phone: "+49 170 1234567",
				message: "Please contact me.",
				privacy_accepted: true,
				website: "",
			}),
		).resolves.toEqual({ received: true });

		const insertCall = mocks.clientQuery.mock.calls.find(([sql]) =>
			String(sql).includes("INSERT INTO inquiries"),
		);
		expect(insertCall?.[1]).toEqual([
			"LISTING",
			"listing-id",
			null,
			"Max Mustermann",
			"max@example.de",
			"+49 170 1234567",
			"Please contact me.",
			"v1",
		]);
		expect(mocks.clientQuery).toHaveBeenCalledWith("COMMIT");
	});

	it("returns generic success for an exact duplicate without inserting", async () => {
		mocks.clientQuery
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [{ id: inquiryRow.id }] })
			.mockResolvedValueOnce({ rows: [] });

		await expect(
			createInquiryService({
				inquiry_type: "GENERAL",
				interest: "BUYING",
				full_name: "Max Mustermann",
				email: "max@example.de",
				message: "Please contact me.",
				privacy_accepted: true,
				website: "",
			}),
		).resolves.toEqual({ received: true });

		expect(
			mocks.clientQuery.mock.calls.some(([sql]) =>
				String(sql).includes("INSERT INTO inquiries"),
			),
		).toBe(false);
		expect(mocks.clientQuery).toHaveBeenCalledWith("COMMIT");
	});

	it("limits an email to five saved inquiries per fifteen minutes", async () => {
		mocks.clientQuery
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [{ total_count: "5" }] })
			.mockResolvedValueOnce({ rows: [] });

		await expect(
			createInquiryService({
				inquiry_type: "GENERAL",
				interest: "RENTING",
				full_name: "Max Mustermann",
				email: "max@example.de",
				message: "Another message",
				privacy_accepted: true,
				website: "",
			}),
		).rejects.toMatchObject({ status: 429, code: "RATE_LIMITED" });

		expect(mocks.clientQuery).toHaveBeenCalledWith("ROLLBACK");
	});

	it("applies admin filters and offset pagination", async () => {
		mocks.poolQuery
			.mockResolvedValueOnce({ rows: [inquiryRow] })
			.mockResolvedValueOnce({ rows: [{ total_count: "21" }] });

		const result = await listInquiriesService({
			inquiry_type: "GENERAL",
			lead_status: "NEW",
			unread: true,
			archive_status: "all",
			page: 2,
			page_size: 20,
			sort: "newest",
		});

		expect(result.page).toBe(2);
		expect(result.total_pages).toBe(2);
		expect(result.has_next_page).toBe(false);
		expect(result.items[0]?.listing).toBeNull();
		expect(mocks.poolQuery.mock.calls[0]?.[0]).toContain(
			"inquiry.read_at IS NULL",
		);
		expect(mocks.poolQuery.mock.calls[0]?.[1]).toEqual([
			"GENERAL",
			"NEW",
			20,
			20,
		]);
	});

	it("marks an inquiry read with an idempotent SQL update", async () => {
		mocks.poolQuery
			.mockResolvedValueOnce({ rows: [{ id: inquiryRow.id }] })
			.mockResolvedValueOnce({
				rows: [{ ...inquiryRow, read_at: new Date() }],
			});

		await markInquiryReadService(inquiryRow.id);

		expect(mocks.poolQuery.mock.calls[0]?.[0]).toContain(
			"read_at = COALESCE(read_at, CURRENT_TIMESTAMP)",
		);
	});

	it("archives and unarchives idempotently", async () => {
		mocks.poolQuery
			.mockResolvedValueOnce({ rows: [{ id: inquiryRow.id }] })
			.mockResolvedValueOnce({
				rows: [{ ...inquiryRow, archived_at: new Date() }],
			})
			.mockResolvedValueOnce({ rows: [{ id: inquiryRow.id }] })
			.mockResolvedValueOnce({ rows: [inquiryRow] });

		await archiveInquiryService(inquiryRow.id);
		await unarchiveInquiryService(inquiryRow.id);

		expect(mocks.poolQuery.mock.calls[0]?.[0]).toContain(
			"archived_at = COALESCE(archived_at, CURRENT_TIMESTAMP)",
		);
		expect(mocks.poolQuery.mock.calls[2]?.[0]).toContain("archived_at = NULL");
	});

	it("rejects an invalid lead-status transition", async () => {
		mocks.clientQuery
			.mockResolvedValueOnce({ rows: [] })
			.mockResolvedValueOnce({ rows: [{ lead_status: "CLOSED" }] })
			.mockResolvedValueOnce({ rows: [] });

		await expect(
			updateInquiryStatusService(inquiryRow.id, { lead_status: "NEW" }),
		).rejects.toMatchObject({ status: 422, code: "VALIDATION_ERROR" });
		expect(mocks.clientQuery).toHaveBeenCalledWith("ROLLBACK");
	});

	it("enforces the approved lead-status transitions", () => {
		expect(isInquiryStatusTransitionAllowed("NEW", "CONTACTED")).toBe(true);
		expect(isInquiryStatusTransitionAllowed("NEW", "CLOSED")).toBe(true);
		expect(isInquiryStatusTransitionAllowed("CONTACTED", "CLOSED")).toBe(true);
		expect(isInquiryStatusTransitionAllowed("CLOSED", "CONTACTED")).toBe(true);
		expect(isInquiryStatusTransitionAllowed("CLOSED", "NEW")).toBe(false);
		expect(isInquiryStatusTransitionAllowed("CONTACTED", "NEW")).toBe(false);
		expect(isInquiryStatusTransitionAllowed("CLOSED", "CLOSED")).toBe(true);
	});
});
