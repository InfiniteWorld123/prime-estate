import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListPublicListingsQueryType } from "#/shared/types/public-listing.type";
import { listPublicListings } from "@/frontend/api/public-listings.api";
import { publicListingQueryKeys } from "./public-listing-query-keys";

export function usePublicListingsQuery(query: ListPublicListingsQueryType) {
	return useQuery({
		placeholderData: keepPreviousData,
		queryFn: () => listPublicListings(query),
		queryKey: publicListingQueryKeys.list(query),
		staleTime: 30_000,
	});
}
