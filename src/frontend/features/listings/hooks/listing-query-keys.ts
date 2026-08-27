import type { ListListingsQueryType } from "#/shared/types/listing.type";

export const listingQueryKeys = {
	all: ["admin", "listings"] as const,
	detail: (listingId: string) =>
		[...listingQueryKeys.details(), listingId] as const,
	details: () => [...listingQueryKeys.all, "detail"] as const,
	list: (query: ListListingsQueryType) =>
		[...listingQueryKeys.lists(), query] as const,
	lists: () => [...listingQueryKeys.all, "list"] as const,
};
