import { useQuery } from "@tanstack/react-query";
import { getInquiry } from "@/frontend/api/inquiries.api";
import { inquiryQueryKeys } from "./inquiry-query-keys";

export function useAdminInquiryQuery(inquiryId: string | null) {
	return useQuery({
		enabled: inquiryId !== null,
		queryFn: () => getInquiry(inquiryId as string),
		queryKey: inquiryQueryKeys.detail(inquiryId ?? "closed"),
		staleTime: 20_000,
	});
}
