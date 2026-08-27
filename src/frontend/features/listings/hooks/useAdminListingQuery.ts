import { useQueries, useQuery } from "@tanstack/react-query";

import { getListing } from "@/frontend/api/listings.api";
import { toAdminListingDetailRecord } from "../listing.mapper";
import { listingQueryKeys } from "./listing-query-keys";
import { useAdminListingsQuery } from "./useAdminListingsQuery";

export function useAdminListingQuery(listingId: string) {
	return useQuery({
		queryFn: () => getListing(listingId),
		queryKey: listingQueryKeys.detail(listingId),
		staleTime: 30_000,
	});
}

export function usePropertyListingDetailsQuery(propertyId: string) {
	const listingsQuery = useAdminListingsQuery({
		page: 1,
		page_size: 100,
		property_id: propertyId,
		sort: "newest",
	});
	const detailQueries = useQueries({
		queries: (listingsQuery.data?.items ?? []).map((listing) => ({
			queryFn: () => getListing(listing.id),
			queryKey: listingQueryKeys.detail(listing.id),
			staleTime: 30_000,
		})),
	});
	const error =
		listingsQuery.error ??
		detailQueries.find((query) => query.error)?.error ??
		null;

	return {
		data:
			listingsQuery.isSuccess && detailQueries.every((query) => query.isSuccess)
				? detailQueries.map((query) => toAdminListingDetailRecord(query.data))
				: undefined,
		error,
		isPending:
			listingsQuery.isPending || detailQueries.some((query) => query.isPending),
		refetch: async () => {
			await listingsQuery.refetch();
			await Promise.all(detailQueries.map((query) => query.refetch()));
		},
	};
}
