import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	archiveProperty,
	bulkArchiveProperties,
	deleteProperty,
	restoreProperty,
} from "@/frontend/api/properties.api";
import { propertyQueryKeys } from "./property-query-keys";

export function useArchivePropertyMutation() {
	return usePropertyActionMutation(archiveProperty);
}

export function useRestorePropertyMutation() {
	return usePropertyActionMutation(restoreProperty);
}

export function useDeletePropertyMutation() {
	return usePropertyActionMutation(deleteProperty, true);
}

export function useBulkArchivePropertiesMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: bulkArchiveProperties,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: propertyQueryKeys.all,
			});
		},
	});
}

function usePropertyActionMutation(
	mutationFn: (propertyId: string) => Promise<unknown>,
	removeDetail = false,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn,
		onSuccess: async (_property, propertyId) => {
			if (removeDetail) {
				queryClient.removeQueries({
					queryKey: propertyQueryKeys.detail(propertyId),
				});
			} else {
				await queryClient.invalidateQueries({
					queryKey: propertyQueryKeys.detail(propertyId),
				});
			}
			await queryClient.invalidateQueries({
				queryKey: propertyQueryKeys.lists(),
			});
		},
	});
}
