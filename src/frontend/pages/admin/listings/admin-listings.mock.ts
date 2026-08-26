import type {
	AdminListingArchiveOutcome,
	AdminListingRecord,
	AdminListingStatus,
} from "@/frontend/features/listings/admin-listing.types";
import { adminPropertyMocks } from "@/frontend/pages/admin/properties/admin-properties.mock";

const listingStatus = (index: number): AdminListingStatus => {
	if (index % 5 === 0 || index % 7 === 0) return "ARCHIVED";
	if (index % 3 === 0) return "DRAFT";
	return "PUBLISHED";
};

export const adminListingMocks: AdminListingRecord[] = adminPropertyMocks
	.slice(0, 25)
	.map((property, index) => {
		const listingType = index % 2 === 0 ? "SALE" : "RENT";
		const status = listingStatus(index);
		const outcome: AdminListingArchiveOutcome | null =
			status !== "ARCHIVED"
				? null
				: index % 4 === 0
					? "WITHDRAWN"
					: listingType === "SALE"
						? "SOLD"
						: "RENTED";
		const createdDay = String(24 - (index % 18)).padStart(2, "0");
		const publishedDay = String(22 - (index % 16)).padStart(2, "0");
		const title = `${property.propertyType === "HOUSE" ? "House" : "Apartment"} ${listingType === "SALE" ? "for sale" : "for rent"} in ${property.city}`;
		return {
			archiveOutcome: outcome,
			archivedAt:
				status === "ARCHIVED" ? `2026-08-${publishedDay}T14:00:00.000Z` : null,
			coverImage: property.coverImage,
			createdAt: `2026-08-${createdDay}T09:30:00.000Z`,
			currencyCode: "EUR",
			id: `listing-${String(index + 1).padStart(3, "0")}`,
			listingType,
			priceAmount:
				index % 9 === 0
					? null
					: listingType === "SALE"
						? 185_000 + index * 17_500
						: 680 + index * 45,
			property: {
				city: property.city,
				houseNumber: property.houseNumber,
				id: property.id,
				livingArea: property.livingArea,
				postalCode: property.postalCode,
				propertyType: property.propertyType,
				referenceNumber: property.referenceNumber,
				rooms: property.rooms,
				streetName: property.streetName,
			},
			publishedAt:
				status === "DRAFT" ? null : `2026-08-${publishedDay}T10:00:00.000Z`,
			slug:
				status === "DRAFT" && index % 6 === 0
					? null
					: title.toLowerCase().replaceAll(" ", "-"),
			status,
			title: index % 11 === 0 ? null : title,
			updatedAt: `2026-08-${String(25 - (index % 17)).padStart(2, "0")}T16:15:00.000Z`,
		};
	});
