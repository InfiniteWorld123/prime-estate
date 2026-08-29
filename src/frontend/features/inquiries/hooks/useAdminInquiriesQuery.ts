import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListInquiriesQueryType } from "#/shared/types/inquiry.type";
import { listInquiries } from "@/frontend/api/inquiries.api";
import { inquiryQueryKeys } from "./inquiry-query-keys";

export function useAdminInquiriesQuery(query: ListInquiriesQueryType) {
	return useQuery({
		placeholderData: keepPreviousData,
		queryFn: () => listInquiries(query),
		queryKey: inquiryQueryKeys.list(query),
		staleTime: 20_000,
	});
}
