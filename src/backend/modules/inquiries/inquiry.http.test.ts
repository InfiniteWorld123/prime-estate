import { Elysia } from "elysia";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	getSession: vi.fn(),
	createInquiry: vi.fn(),
	listInquiries: vi.fn(),
	getInquiryById: vi.fn(),
	markInquiryRead: vi.fn(),
	updateInquiryStatus: vi.fn(),
	archiveInquiry: vi.fn(),
	unarchiveInquiry: vi.fn(),
}));

vi.mock("#/backend/shared/auth", () => ({
	auth: {
		api: { getSession: mocks.getSession },
	},
}));

vi.mock("./inquiry.service", () => ({
	createInquiryService: mocks.createInquiry,
	listInquiriesService: mocks.listInquiries,
	getInquiryByIdService: mocks.getInquiryById,
	markInquiryReadService: mocks.markInquiryRead,
	updateInquiryStatusService: mocks.updateInquiryStatus,
	archiveInquiryService: mocks.archiveInquiry,
	unarchiveInquiryService: mocks.unarchiveInquiry,
}));

import { adminGuard } from "#/backend/modules/admin/admin.guard";
import { AppError } from "#/backend/shared/error";
import { handleError } from "#/backend/shared/error-handler";
import { inquiryRoutes, publicInquiryRoutes } from "./inquiry.route";

const testApp = new Elysia({ prefix: "/api" })
	.error({ AppError })
	.onError(handleError)
	.use(new Elysia({ prefix: "/admin" }).use(adminGuard).use(inquiryRoutes))
	.use(publicInquiryRoutes);

const request = (path: string, init?: RequestInit) =>
	testApp.fetch(new Request(`http://localhost${path}`, init));

const adminSession = {
	user: {
		id: "admin-id",
		name: "Admin",
		email: "admin@example.de",
		emailVerified: true,
		role: "ADMIN",
	},
	session: { id: "session-id" },
};

describe("inquiry HTTP routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.createInquiry.mockResolvedValue({ received: true });
		mocks.listInquiries.mockResolvedValue({
			items: [],
			page: 2,
			page_size: 10,
			total_items: 0,
			total_pages: 0,
			has_previous_page: true,
			has_next_page: false,
			sort: "newest",
			filters: {},
		});
	});

	it("accepts a normalized public general inquiry", async () => {
		const response = await request("/api/inquiries", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				inquiry_type: "GENERAL",
				interest: "BUYING",
				full_name: "  Max Mustermann  ",
				email: "  MAX@EXAMPLE.DE  ",
				phone: "",
				message: "  Please contact me.  ",
				privacy_accepted: true,
				website: "",
			}),
		});

		expect(response.status).toBe(201);
		expect(await response.json()).toEqual({
			success: true,
			message: "Inquiry received",
			data: { received: true },
		});
		expect(mocks.createInquiry).toHaveBeenCalledWith(
			expect.objectContaining({
				full_name: "Max Mustermann",
				email: "max@example.de",
				phone: undefined,
			}),
		);
	});

	it("rejects public submissions without privacy consent", async () => {
		const response = await request("/api/inquiries", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				inquiry_type: "LISTING",
				listing_slug: "ruhige-wohnung-weimar",
				full_name: "Max Mustermann",
				email: "max@example.de",
				message: "Please contact me.",
				privacy_accepted: false,
				website: "",
			}),
		});

		expect(response.status).toBe(422);
		expect(mocks.createInquiry).not.toHaveBeenCalled();
	});

	it("rejects unauthenticated admin access", async () => {
		mocks.getSession.mockResolvedValue(null);

		const response = await request("/api/admin/inquiries");

		expect(response.status).toBe(401);
		expect(mocks.listInquiries).not.toHaveBeenCalled();
	});

	it("rejects verified non-admin access", async () => {
		mocks.getSession.mockResolvedValue({
			...adminSession,
			user: { ...adminSession.user, role: "USER" },
		});

		const response = await request("/api/admin/inquiries");

		expect(response.status).toBe(403);
		expect(mocks.listInquiries).not.toHaveBeenCalled();
	});

	it("rejects an admin whose email is not verified", async () => {
		mocks.getSession.mockResolvedValue({
			...adminSession,
			user: { ...adminSession.user, emailVerified: false },
		});

		const response = await request("/api/admin/inquiries");

		expect(response.status).toBe(403);
		expect(mocks.listInquiries).not.toHaveBeenCalled();
	});

	it("passes parsed admin filters after verified ADMIN access", async () => {
		mocks.getSession.mockResolvedValue(adminSession);

		const response = await request(
			"/api/admin/inquiries?inquiry_type=GENERAL&lead_status=NEW&unread=true&archive_status=all&page=2&page_size=10",
		);

		expect(response.status).toBe(200);
		expect(mocks.listInquiries).toHaveBeenCalledWith({
			inquiry_type: "GENERAL",
			lead_status: "NEW",
			unread: true,
			archive_status: "all",
			page: 2,
			page_size: 10,
		});
	});
});
