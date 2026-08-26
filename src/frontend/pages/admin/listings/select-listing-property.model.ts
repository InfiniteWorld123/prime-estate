import type { AdminListingRecord } from "@/frontend/features/listings/admin-listing.types";
import type { AdminPropertyRecord } from "@/frontend/features/properties/admin-property.types";

export type ListingTypeAvailability = {
	rent: boolean;
	sale: boolean;
};

export function getListingTypeAvailability(
	propertyId: string,
	listings: AdminListingRecord[],
): ListingTypeAvailability {
	const activeTypes = new Set(
		listings
			.filter(
				(listing) =>
					listing.property.id === propertyId && listing.status !== "ARCHIVED",
			)
			.map((listing) => listing.listingType),
	);

	return {
		rent: !activeTypes.has("RENT"),
		sale: !activeTypes.has("SALE"),
	};
}

export function filterSelectableProperties(
	properties: AdminPropertyRecord[],
	searchValue: string,
) {
	const search = searchValue.trim().toLocaleLowerCase();
	return properties.filter((property) => {
		if (property.archivedAt !== null) return false;
		if (!search) return true;
		return `${property.referenceNumber} ${property.streetName} ${property.houseNumber} ${property.postalCode} ${property.city}`
			.toLocaleLowerCase()
			.includes(search);
	});
}
