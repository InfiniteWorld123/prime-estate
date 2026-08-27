import { useQuery } from "@tanstack/react-query";
import { getPublicListing } from "@/frontend/api/public-listings.api";
import { publicListingQueryKeys } from "./public-listing-query-keys";

export function usePublicListingQuery(slug: string) {
	return useQuery({
		queryFn: () => getPublicListing(slug),
		queryKey: publicListingQueryKeys.detail(slug),
		staleTime: 30_000,
	});
}
