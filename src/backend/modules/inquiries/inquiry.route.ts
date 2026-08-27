import { Elysia } from "elysia";
import {
	CreateInquirySchema,
	InquiryParamsSchema,
	ListInquiriesQuerySchema,
	UpdateInquiryStatusSchema,
} from "#/shared/validation/inquiry.validation";
import {
	archiveInquiry,
	createInquiry,
	getInquiryById,
	listInquiries,
	markInquiryRead,
	unarchiveInquiry,
	updateInquiryStatus,
} from "./inquiry.controller";

export const publicInquiryRoutes = new Elysia().post(
	"/inquiries",
	createInquiry,
	{
		body: CreateInquirySchema,
	},
);

export const inquiryRoutes = new Elysia({ prefix: "/inquiries" })
	.get("/", listInquiries, {
		query: ListInquiriesQuerySchema,
	})
	.get("/:id", getInquiryById, {
		params: InquiryParamsSchema,
	})
	.post("/:id/read", markInquiryRead, {
		params: InquiryParamsSchema,
	})
	.patch("/:id/status", updateInquiryStatus, {
		params: InquiryParamsSchema,
		body: UpdateInquiryStatusSchema,
	})
	.post("/:id/archive", archiveInquiry, {
		params: InquiryParamsSchema,
	})
	.post("/:id/unarchive", unarchiveInquiry, {
		params: InquiryParamsSchema,
	});
