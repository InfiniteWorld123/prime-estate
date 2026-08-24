import { useState } from "react";

export type ListingIntent = "sale" | "rent";

export function useHomePage() {
	const [listingIntent, setListingIntent] = useState<ListingIntent>("sale");
	const [location, setLocation] = useState("");

	return {
		listingIntent,
		location,
		setListingIntent,
		setLocation,
		isSearchDisabled: true,
	};
}
