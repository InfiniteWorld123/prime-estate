import type { ListPublicListingsQueryType } from "#/shared/types/public-listing.type";

export const publicListingQueryKeys = {
	all: ["public", "listings"] as const,
	list: (query: ListPublicListingsQueryType) =>
		[...publicListingQueryKeys.all, "list", query] as const,
	detail: (slug: string) =>
		[...publicListingQueryKeys.all, "detail", slug] as const,
	features: ["public", "features"] as const,
};
