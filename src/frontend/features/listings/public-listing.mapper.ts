import type {
	PublicFeatureType,
	PublicListingCardType,
	PublicListingDetailType,
} from "#/shared/types/public-listing.type";
import type {
	PropertyDetailListing,
	PropertyFeatureOption,
	PropertySearchListing,
} from "./listing.types";

const localized = (value: string) => ({ de: value, en: value });
const iso = (value: Date | string | null) =>
	value === null ? null : value instanceof Date ? value.toISOString() : value;

export function toPropertySearchListing(
	listing: PublicListingCardType,
): PropertySearchListing {
	return {
		id: listing.slug,
		slug: listing.slug,
		title: localized(listing.title),
		city: listing.property.address.city,
		postalCode: listing.property.address.postal_code,
		price: listing.price_amount,
		rooms: listing.property.rooms,
		bedrooms: listing.property.bedrooms ?? 0,
		livingArea: listing.property.living_area_m2,
		propertyType: listing.property.property_type,
		listingType: listing.listing_type,
		featureIds: [],
		image: {
			src: listing.cover_image.url,
			alt: localized(listing.cover_image.alt_text ?? listing.title),
		},
	};
}

export function toPropertyFeatureOption(
	feature: PublicFeatureType,
): PropertyFeatureOption {
	return { id: feature.id, label: localized(feature.name) };
}

export function toPropertyDetailListing(
	listing: PublicListingDetailType,
): PropertyDetailListing {
	return {
		slug: listing.slug,
		title: listing.title,
		description: listing.description,
		seoTitle: listing.seo_title,
		seoDescription: listing.seo_description,
		listingType: listing.listing_type,
		price: listing.price_amount,
		currencyCode: listing.currency_code,
		archiveOutcome:
			listing.archive_outcome === "WITHDRAWN" ? null : listing.archive_outcome,
		isAvailable: listing.is_available,
		referenceNumber: listing.property.reference_number,
		propertyType: listing.property.property_type,
		address: {
			streetName: listing.property.address.street_name,
			houseNumber: listing.property.address.house_number,
			unitNumber: listing.property.address.unit_number,
			postalCode: listing.property.address.postal_code,
			city: listing.property.address.city,
		},
		livingArea: listing.property.living_area_m2,
		plotArea: listing.property.plot_area_m2,
		rooms: listing.property.rooms,
		bedrooms: listing.property.bedrooms,
		bathrooms: listing.property.bathrooms,
		yearBuilt: listing.property.year_built,
		floorNumber: listing.property.floor_number,
		totalFloors: listing.property.total_floors,
		images: listing.images.map((image) => ({
			id: image.id,
			src: image.url,
			alt: image.alt_text,
			sortOrder: image.sort_order,
			isCover: image.is_cover,
		})),
		features: listing.features,
		publishedAt: iso(listing.published_at) ?? "",
		archivedAt: iso(listing.archived_at),
	};
}
