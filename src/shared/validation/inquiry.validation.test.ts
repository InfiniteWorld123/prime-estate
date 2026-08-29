import * as v from "valibot";
import { describe, expect, it } from "vitest";
import {
	CreateInquirySchema,
	INQUIRY_FIELD_LIMITS,
	ListInquiriesQuerySchema,
} from "./inquiry.validation";

const sharedInput = {
	full_name: "  Max Mustermann  ",
	email: "  MAX@EXAMPLE.DE  ",
	phone: "  +49 170 1234567  ",
	message: "  Please contact me.  ",
	privacy_accepted: true as const,
	website: "",
};

describe("inquiry validation", () => {
	it("normalizes a general inquiry", () => {
		const result = v.parse(CreateInquirySchema, {
			inquiry_type: "GENERAL",
			interest: "BUYING",
			...sharedInput,
		});

		expect(result).toEqual({
			inquiry_type: "GENERAL",
			interest: "BUYING",
			full_name: "Max Mustermann",
			email: "max@example.de",
			phone: "+49 170 1234567",
			message: "Please contact me.",
			privacy_accepted: true,
			website: "",
		});
	});

	it("requires a listing slug for listing inquiries", () => {
		const result = v.safeParse(CreateInquirySchema, {
			inquiry_type: "LISTING",
			...sharedInput,
		});

		expect(result.success).toBe(false);
	});

	it("requires privacy consent", () => {
		const result = v.safeParse(CreateInquirySchema, {
			inquiry_type: "GENERAL",
			interest: "GENERAL",
			...sharedInput,
			privacy_accepted: false,
		});

		expect(result.success).toBe(false);
	});

	it("enforces the shared public field limits", () => {
		const result = v.safeParse(CreateInquirySchema, {
			inquiry_type: "GENERAL",
			interest: "GENERAL",
			...sharedInput,
			message: "x".repeat(INQUIRY_FIELD_LIMITS.message + 1),
		});

		expect(result.success).toBe(false);
	});

	it("enforces the shared phone shape", () => {
		const valid = v.safeParse(CreateInquirySchema, {
			inquiry_type: "GENERAL",
			interest: "GENERAL",
			...sharedInput,
		});
		const invalid = v.safeParse(CreateInquirySchema, {
			inquiry_type: "GENERAL",
			interest: "GENERAL",
			...sharedInput,
			phone: "phone me",
		});

		expect(valid.success).toBe(true);
		expect(invalid.success).toBe(false);
	});

	it("parses pagination and boolean filters", () => {
		const result = v.parse(ListInquiriesQuerySchema, {
			page: "2",
			page_size: "25",
			unread: "true",
			archive_status: "all",
		});

		expect(result).toEqual({
			page: 2,
			page_size: 25,
			unread: true,
			archive_status: "all",
		});
	});
});
