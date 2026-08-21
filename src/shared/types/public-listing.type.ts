import type * as v from "valibot";
import type {
	ListPublicListingsQuerySchema,
	PublicListingSlugParamsSchema,
} from "../validation/public-listing.validation";
import type {
	ListingArchiveOutcomeValue,
	ListingTypeValue,
} from "./listing.type";

export type ListPublicListingsQueryType = v.InferOutput<
	typeof ListPublicListingsQuerySchema
>;
export type PublicListingSlugParamsType = v.InferInput<
	typeof PublicListingSlugParamsSchema
>;
export type PublicListingSortType = NonNullable<
	ListPublicListingsQueryType["sort"]
>;

export type PublicFeatureType = {
	id: string;
	code: string;
	name: string;
};

export type PublicImageType = {
	id: string;
	url: string;
	alt_text: string | null;
	sort_order: number;
	is_cover: boolean;
};

export type PublicAddressType = {
	street_name: string | null;
	house_number: string | null;
	unit_number: string | null;
	postal_code: string;
	city: string;
};

export type PublicPropertyType = {
	reference_number: string;
	property_type: "APARTMENT" | "HOUSE";
	address: PublicAddressType;
	living_area_m2: number;
	plot_area_m2: number | null;
	rooms: number;
	bedrooms: number | null;
	bathrooms: number;
	year_built: number | null;
	floor_number: number | null;
	total_floors: number | null;
};

export type PublicListingCardType = {
	slug: string;
	title: string;
	listing_type: ListingTypeValue;
	price_amount: number;
	currency_code: "EUR";
	property: Pick<
		PublicPropertyType,
		| "reference_number"
		| "property_type"
		| "address"
		| "living_area_m2"
		| "rooms"
		| "bedrooms"
	>;
	cover_image: PublicImageType;
	published_at: Date;
};

export type PublicListingDetailType = {
	slug: string;
	title: string;
	description: string;
	seo_title: string;
	seo_description: string;
	listing_type: ListingTypeValue;
	price_amount: number;
	currency_code: "EUR";
	archive_outcome: ListingArchiveOutcomeValue | null;
	is_available: boolean;
	property: PublicPropertyType;
	images: PublicImageType[];
	features: PublicFeatureType[];
	published_at: Date;
	archived_at: Date | null;
};

export type PublicListingsPageType = {
	items: PublicListingCardType[];
	page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
	has_previous_page: boolean;
	has_next_page: boolean;
	sort: PublicListingSortType;
	filters: Omit<ListPublicListingsQueryType, "page" | "page_size" | "sort">;
};
