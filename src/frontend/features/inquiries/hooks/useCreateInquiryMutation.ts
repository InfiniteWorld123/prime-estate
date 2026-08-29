import { useMutation } from "@tanstack/react-query";
import { createInquiry } from "@/frontend/api/inquiries.api";

export function useCreateInquiryMutation() {
	return useMutation({ mutationFn: createInquiry });
}
