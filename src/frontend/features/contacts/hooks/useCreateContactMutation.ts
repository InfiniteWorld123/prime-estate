import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createContact } from "@/frontend/api/contacts.api";
import { contactQueryKeys } from "./contact-query-keys";

export function useCreateContactMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createContact,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: contactQueryKeys.all,
			});
		},
	});
}
