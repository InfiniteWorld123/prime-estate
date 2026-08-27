import type {
	AdminListingDetailType,
	AdminListingSummaryType,
	AdminListingType,
} from "#/shared/types/listing.type";
import type {
	AdminListingDetailRecord,
	AdminListingRecord,
} from "./admin-listing.types";

const toIsoString = (value: Date | string) =>
	value instanceof Date ? value.toISOString() : value;
const optionalIsoString = (value: Date | string | null) =>
	value === null ? null : toIsoString(value);

export function toAdminListingRecord(
	listing: AdminListingType | AdminListingSummaryType,
): AdminListingRecord {
	return {
		archiveOutcome: listing.archive_outcome,
		archivedAt: optionalIsoString(listing.archived_at),
		coverImage: listing.cover_image?.url ?? null,
		createdAt: toIsoString(listing.created_at),
		currencyCode: listing.currency_code,
		id: listing.id,
		listingType: listing.listing_type,
		priceAmount: listing.price_amount,
		property: {
			city: listing.property.city,
			houseNumber: listing.property.house_number,
			id: listing.property.id,
			livingArea: listing.property.living_area_m2,
			postalCode: listing.property.postal_code,
			propertyType: listing.property.property_type,
			referenceNumber: listing.property.reference_number,
			rooms: listing.property.rooms,
			streetName: listing.property.street_name,
		},
		publishedAt: optionalIsoString(listing.published_at),
		slug: listing.slug,
		status: listing.status,
		title: listing.title,
		updatedAt: toIsoString(listing.updated_at),
	};
}

export function toAdminListingDetailRecord(
	listing: AdminListingDetailType,
): AdminListingDetailRecord {
	return {
		...toAdminListingRecord(listing),
		description: listing.description,
		features: listing.features.map(({ id, name }) => ({ id, name })),
		images: listing.images.map((image) => ({
			altText: image.alt_text,
			id: image.id,
			isCover: image.is_cover,
			url: image.url,
		})),
		seoDescription: listing.seo_description,
		seoTitle: listing.seo_title,
		showExactAddress: listing.show_exact_address,
	};
}
