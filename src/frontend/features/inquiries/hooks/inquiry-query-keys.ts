import type { ListInquiriesQueryType } from "#/shared/types/inquiry.type";

export const inquiryQueryKeys = {
	all: ["inquiries"] as const,
	detail: (id: string) => [...inquiryQueryKeys.details(), id] as const,
	details: () => [...inquiryQueryKeys.all, "detail"] as const,
	list: (query: ListInquiriesQueryType) =>
		[...inquiryQueryKeys.lists(), query] as const,
	lists: () => [...inquiryQueryKeys.all, "list"] as const,
};
