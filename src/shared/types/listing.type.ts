import type * as v from "valibot";
import type {
	ArchiveListingSchema,
	CreateListingSchema,
	ListingParamsSchema,
	ListingPropertyParamsSchema,
	ListListingsQuerySchema,
	UpdateListingSchema,
} from "../validation/listing.validation";
import type { FeatureType } from "./feature.type";
import type { PropertyImageType } from "./property-image.type";

export type ListingTypeValue = "SALE" | "RENT";
export type ListingStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ListingArchiveOutcomeValue = "SOLD" | "RENTED" | "WITHDRAWN";

export type CreateListingBodyType = v.InferInput<typeof CreateListingSchema>;
export type CreateListingDataType = v.InferOutput<typeof CreateListingSchema>;
export type UpdateListingBodyType = v.InferInput<typeof UpdateListingSchema>;
export type UpdateListingDataType = v.InferOutput<typeof UpdateListingSchema>;
export type ListingParamsType = v.InferInput<typeof ListingParamsSchema>;
export type ListingPropertyParamsType = v.InferInput<
	typeof ListingPropertyParamsSchema
>;
export type ArchiveListingBodyType = v.InferInput<typeof ArchiveListingSchema>;
export type ArchiveListingDataType = v.InferOutput<typeof ArchiveListingSchema>;
export type ListListingsQueryType = v.InferOutput<
	typeof ListListingsQuerySchema
>;
export type ListListingsDataType = v.InferOutput<
	typeof ListListingsQuerySchema
>;
export type ListingSortType = NonNullable<ListListingsDataType["sort"]>;

export type ListingPropertySummaryType = {
	id: string;
	reference_number: string;
	property_type: "APARTMENT" | "HOUSE";
	street_name: string;
	house_number: string;
	unit_number: string | null;
	postal_code: string;
	city: string;
	living_area_m2: number;
	rooms: number;
};

export type ListingCoverImageType = {
	id: string;
	url: string;
	alt_text: string | null;
};

export type AdminListingType = {
	id: string;
	property: ListingPropertySummaryType;
	listing_type: ListingTypeValue;
	status: ListingStatusValue;
	archive_outcome: ListingArchiveOutcomeValue | null;
	price_amount: number | null;
	currency_code: "EUR";
	title: string | null;
	description: string | null;
	slug: string | null;
	seo_title: string | null;
	seo_description: string | null;
	show_exact_address: boolean;
	cover_image: ListingCoverImageType | null;
	published_at: Date | null;
	archived_at: Date | null;
	created_at: Date;
	updated_at: Date;
};

export type AdminListingDetailType = AdminListingType & {
	images: PropertyImageType[];
	features: FeatureType[];
};

export type AdminListingSummaryType = Omit<
	AdminListingType,
	"description" | "seo_title" | "seo_description" | "show_exact_address"
>;

export type ListingsPageType = {
	items: AdminListingSummaryType[];
	page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
	has_previous_page: boolean;
	has_next_page: boolean;
	sort: ListingSortType;
	filters: Omit<ListListingsDataType, "page" | "page_size" | "sort">;
};
