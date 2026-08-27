import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListListingsQueryType } from "#/shared/types/listing.type";
import { listListings } from "@/frontend/api/listings.api";
import { listingQueryKeys } from "./listing-query-keys";

export function useAdminListingsQuery(query: ListListingsQueryType) {
	return useQuery({
		placeholderData: keepPreviousData,
		queryFn: () => listListings(query),
		queryKey: listingQueryKeys.list(query),
		staleTime: 30_000,
	});
}
