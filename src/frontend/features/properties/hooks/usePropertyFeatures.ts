import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	createFeature,
	getPropertyFeatures,
	listFeatureOptions,
	replacePropertyFeatures,
} from "@/frontend/api/features.api";
import { listingQueryKeys } from "@/frontend/features/listings/hooks/listing-query-keys";
import { featureQueryKeys } from "./feature-query-keys";

export function useFeatureOptionsQuery() {
	return useQuery({
		queryFn: listFeatureOptions,
		queryKey: featureQueryKeys.options(),
		staleTime: 60_000,
	});
}

export function usePropertyFeaturesQuery(propertyId: string) {
	return useQuery({
		queryFn: () => getPropertyFeatures(propertyId),
		queryKey: featureQueryKeys.property(propertyId),
	});
}

export function useCreateFeatureMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createFeature,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: featureQueryKeys.options(),
			});
		},
	});
}

export function useReplacePropertyFeaturesMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: replacePropertyFeatures,
		onSuccess: (features, variables) => {
			queryClient.setQueryData(
				featureQueryKeys.property(variables.propertyId),
				features,
			);
			void queryClient.invalidateQueries({
				queryKey: listingQueryKeys.details(),
			});
			void queryClient.invalidateQueries({
				queryKey: listingQueryKeys.lists(),
			});
		},
	});
}
