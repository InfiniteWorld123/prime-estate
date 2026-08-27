import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProperty } from "@/frontend/api/properties.api";
import { propertyQueryKeys } from "./property-query-keys";

export function useCreatePropertyMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProperty,
		onSuccess: async (property) => {
			queryClient.setQueryData(propertyQueryKeys.detail(property.id), property);
			await queryClient.invalidateQueries({
				queryKey: propertyQueryKeys.lists(),
			});
		},
	});
}
