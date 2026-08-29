import type {
	CreateInquiryBodyType,
	CreateInquiryResultType,
	InquiriesPageType,
	InquiryType,
	ListInquiriesQueryType,
	UpdateInquiryStatusBodyType,
} from "#/shared/types/inquiry.type";
import { safe_API } from "./client";
import { unwrapApiResult } from "./utils";

export async function createInquiry(
	input: CreateInquiryBodyType,
): Promise<CreateInquiryResultType> {
	const response = unwrapApiResult(
		await safe_API().inquiries.post({ ...input, website: input.website ?? "" }),
		"Unable to submit the inquiry",
	);

	return response.data;
}

export async function listInquiries(
	query: ListInquiriesQueryType,
): Promise<InquiriesPageType> {
	const response = unwrapApiResult(
		await safe_API().admin.inquiries.get({ query }),
		"Unable to load inquiries",
	);
	return response.data;
}

export async function getInquiry(inquiryId: string): Promise<InquiryType> {
	const response = unwrapApiResult(
		await safe_API().admin.inquiries({ id: inquiryId }).get(),
		"Unable to load the inquiry",
	);
	return response.data;
}

export async function markInquiryRead(inquiryId: string): Promise<InquiryType> {
	const response = unwrapApiResult(
		await safe_API().admin.inquiries({ id: inquiryId }).read.post(),
		"Unable to mark the inquiry as read",
	);
	return response.data;
}

export async function updateInquiryStatus({
	inquiryId,
	input,
}: {
	inquiryId: string;
	input: UpdateInquiryStatusBodyType;
}): Promise<InquiryType> {
	const response = unwrapApiResult(
		await safe_API().admin.inquiries({ id: inquiryId }).status.patch(input),
		"Unable to update the inquiry status",
	);
	return response.data;
}

export async function archiveInquiry(inquiryId: string): Promise<InquiryType> {
	const response = unwrapApiResult(
		await safe_API().admin.inquiries({ id: inquiryId }).archive.post(),
		"Unable to archive the inquiry",
	);
	return response.data;
}

export async function unarchiveInquiry(
	inquiryId: string,
): Promise<InquiryType> {
	const response = unwrapApiResult(
		await safe_API().admin.inquiries({ id: inquiryId }).unarchive.post(),
		"Unable to restore the inquiry",
	);
	return response.data;
}
