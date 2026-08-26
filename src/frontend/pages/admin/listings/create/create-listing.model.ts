import type { AdminListingDetailRecord } from "@/frontend/features/listings/admin-listing.types";

export type ListingCreationPrefill = {
	sourceListing: AdminListingDetailRecord;
	targetType: "RENT" | "SALE";
};

export function getListingCreationPrefill(
	propertyId: string,
	listings: AdminListingDetailRecord[],
): ListingCreationPrefill | null {
	const activeListings = listings.filter(
		(listing) =>
			listing.property.id === propertyId && listing.status !== "ARCHIVED",
	);
	const saleListing = activeListings.find(
		(listing) => listing.listingType === "SALE",
	);
	const rentListing = activeListings.find(
		(listing) => listing.listingType === "RENT",
	);

	if (rentListing && !saleListing) {
		return { sourceListing: rentListing, targetType: "SALE" };
	}
	if (saleListing && !rentListing) {
		return { sourceListing: saleListing, targetType: "RENT" };
	}
	return null;
}
