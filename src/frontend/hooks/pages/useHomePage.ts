import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePublicListingsQuery } from "@/frontend/features/listings/hooks/usePublicListingsQuery";
import { toPropertySearchListing } from "@/frontend/features/listings/public-listing.mapper";

export type ListingIntent = "sale" | "rent";

export function useHomePage() {
	const navigate = useNavigate();
	const [listingIntent, setListingIntent] = useState<ListingIntent>("sale");
	const [location, setLocation] = useState("");
	const query = usePublicListingsQuery({
		page: 1,
		page_size: 7,
		sort: "newest",
	});
	const listings = useMemo(
		() => query.data?.items.map(toPropertySearchListing) ?? [],
		[query.data],
	);
	const search = () => {
		void navigate({
			to: "/properties",
			search: {
				listingType: listingIntent === "sale" ? "SALE" : "RENT",
				...(location.trim() ? { location: location.trim() } : {}),
			},
		});
	};

	return {
		heroListing: listings[0] ?? null,
		isError: query.isError,
		isLoading: query.isPending,
		latestListings: listings.slice(1),
		listingIntent,
		location,
		retry: query.refetch,
		search,
		setListingIntent,
		setLocation,
	};
}
