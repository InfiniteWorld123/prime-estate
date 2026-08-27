import { status } from "elysia";
import * as v from "valibot";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	CreateInquiryBodyType,
	InquiryParamsType,
	ListInquiriesQueryType,
	UpdateInquiryStatusBodyType,
} from "#/shared/types/inquiry.type";
import {
	CreateInquirySchema,
	InquiryParamsSchema,
	UpdateInquiryStatusSchema,
} from "#/shared/validation/inquiry.validation";
import {
	archiveInquiryService,
	createInquiryService,
	getInquiryByIdService,
	listInquiriesService,
	markInquiryReadService,
	unarchiveInquiryService,
	updateInquiryStatusService,
} from "./inquiry.service";

export const createInquiry = async ({
	body,
}: {
	body: CreateInquiryBodyType;
}) => {
	const input = v.parse(CreateInquirySchema, body);
	const result = await createInquiryService(input);

	return status(
		HttpStatusCode.CREATED,
		responseOk({
			data: result,
			message: "Inquiry received",
		}),
	);
};

export const listInquiries = async ({
	query,
}: {
	query: ListInquiriesQueryType;
}) => {
	const inquiries = await listInquiriesService(query);

	return responseOk({
		data: inquiries,
		message: "Inquiries retrieved",
	});
};

export const getInquiryById = async ({
	params,
}: {
	params: InquiryParamsType;
}) => {
	const input = v.parse(InquiryParamsSchema, params);
	const inquiry = await getInquiryByIdService(input.id);

	return responseOk({
		data: inquiry,
		message: "Inquiry retrieved",
	});
};

export const markInquiryRead = async ({
	params,
}: {
	params: InquiryParamsType;
}) => {
	const input = v.parse(InquiryParamsSchema, params);
	const inquiry = await markInquiryReadService(input.id);

	return responseOk({
		data: inquiry,
		message: "Inquiry marked as read",
	});
};

export const updateInquiryStatus = async ({
	params,
	body,
}: {
	params: InquiryParamsType;
	body: UpdateInquiryStatusBodyType;
}) => {
	const parsedParams = v.parse(InquiryParamsSchema, params);
	const parsedBody = v.parse(UpdateInquiryStatusSchema, body);
	const inquiry = await updateInquiryStatusService(parsedParams.id, parsedBody);

	return responseOk({
		data: inquiry,
		message: "Inquiry status updated",
	});
};

export const archiveInquiry = async ({
	params,
}: {
	params: InquiryParamsType;
}) => {
	const input = v.parse(InquiryParamsSchema, params);
	const inquiry = await archiveInquiryService(input.id);

	return responseOk({
		data: inquiry,
		message: "Inquiry archived",
	});
};

export const unarchiveInquiry = async ({
	params,
}: {
	params: InquiryParamsType;
}) => {
	const input = v.parse(InquiryParamsSchema, params);
	const inquiry = await unarchiveInquiryService(input.id);

	return responseOk({
		data: inquiry,
		message: "Inquiry unarchived",
	});
};
