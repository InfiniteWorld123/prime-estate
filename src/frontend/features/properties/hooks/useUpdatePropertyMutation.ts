import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProperty } from "@/frontend/api/properties.api";
import { propertyQueryKeys } from "./property-query-keys";

export function useUpdatePropertyMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProperty,
		onSuccess: async (property) => {
			queryClient.setQueryData(propertyQueryKeys.detail(property.id), property);
			await queryClient.invalidateQueries({
				queryKey: propertyQueryKeys.lists(),
			});
		},
	});
}
