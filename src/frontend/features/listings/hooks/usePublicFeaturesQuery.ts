import { useQuery } from "@tanstack/react-query";
import { listPublicFeatures } from "@/frontend/api/public-listings.api";
import { publicListingQueryKeys } from "./public-listing-query-keys";

export function usePublicFeaturesQuery() {
	return useQuery({
		queryFn: listPublicFeatures,
		queryKey: publicListingQueryKeys.features,
		staleTime: 5 * 60_000,
	});
}
