import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	archiveListing,
	createListing,
	deleteDraftListing,
	publishListing,
	updateListing,
} from "@/frontend/api/listings.api";
import { listingQueryKeys } from "./listing-query-keys";

export function useCreateListingMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createListing,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: listingQueryKeys.lists(),
			});
		},
	});
}

export function useUpdateListingMutation() {
	return useListingMutation(updateListing);
}

export function usePublishListingMutation() {
	return useListingIdMutation(publishListing);
}

export function useArchiveListingMutation() {
	return useListingMutation(archiveListing);
}

export function useDeleteDraftListingMutation() {
	return useListingIdMutation(deleteDraftListing, true);
}

function useListingMutation<Variables extends { listingId: string }>(
	mutationFn: (variables: Variables) => Promise<unknown>,
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn,
		onSuccess: async (_listing, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: listingQueryKeys.detail(variables.listingId),
				}),
				queryClient.invalidateQueries({ queryKey: listingQueryKeys.lists() }),
			]);
		},
	});
}

function useListingIdMutation(
	mutationFn: (listingId: string) => Promise<unknown>,
	removeDetail = false,
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn,
		onSuccess: async (_listing, listingId) => {
			if (removeDetail)
				queryClient.removeQueries({
					queryKey: listingQueryKeys.detail(listingId),
				});
			else
				await queryClient.invalidateQueries({
					queryKey: listingQueryKeys.detail(listingId),
				});
			await queryClient.invalidateQueries({
				queryKey: listingQueryKeys.lists(),
			});
		},
	});
}
