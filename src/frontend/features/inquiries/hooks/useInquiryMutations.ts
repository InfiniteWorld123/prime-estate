import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InquiryType } from "#/shared/types/inquiry.type";
import {
	archiveInquiry,
	markInquiryRead,
	unarchiveInquiry,
	updateInquiryStatus,
} from "@/frontend/api/inquiries.api";
import { inquiryQueryKeys } from "./inquiry-query-keys";

function useInquiryMutation<Variables>(
	mutationFn: (variables: Variables) => Promise<InquiryType>,
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn,
		onSuccess: async (inquiry) => {
			queryClient.setQueryData(inquiryQueryKeys.detail(inquiry.id), inquiry);
			await queryClient.invalidateQueries({
				queryKey: inquiryQueryKeys.lists(),
			});
		},
	});
}

export function useMarkInquiryReadMutation() {
	return useInquiryMutation(markInquiryRead);
}

export function useUpdateInquiryStatusMutation() {
	return useInquiryMutation(updateInquiryStatus);
}

export function useArchiveInquiryMutation() {
	return useInquiryMutation(archiveInquiry);
}

export function useUnarchiveInquiryMutation() {
	return useInquiryMutation(unarchiveInquiry);
}
