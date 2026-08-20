import type * as v from "valibot";
import type {
	CreatePropertySchema,
	ListPropertiesQuerySchema,
	PropertyParamsSchema,
	UpdatePropertySchema,
} from "../validation/property.validation";

export type CreatePropertyBodyType = v.InferInput<typeof CreatePropertySchema>;

export type CreatePropertyDataType = v.InferOutput<typeof CreatePropertySchema>;

export type UpdatePropertyBodyType = v.InferInput<typeof UpdatePropertySchema>;

export type UpdatePropertyDataType = v.InferOutput<typeof UpdatePropertySchema>;

export type PropertyParamsType = v.InferInput<typeof PropertyParamsSchema>;

export type ListPropertiesQueryType = v.InferOutput<
	typeof ListPropertiesQuerySchema
>;

export type ListPropertiesDataType = v.InferOutput<
	typeof ListPropertiesQuerySchema
>;

export type PropertySortType = NonNullable<ListPropertiesDataType["sort"]>;

export type PropertyFiltersType = Omit<
	ListPropertiesDataType,
	"page" | "page_size" | "sort"
>;

export type PropertyContactType = {
	id: string;
	full_name: string;
	company_name: string | null;
	email: string | null;
	phone: string | null;
};

export type PropertyType = {
	id: string;
	reference_number: string;

	property_type: "APARTMENT" | "HOUSE";
	property_source: "AGENCY_OWNED" | "EXTERNAL_CLIENT";

	primary_contact: PropertyContactType | null;

	street_name: string;
	house_number: string;
	unit_number: string | null;
	postal_code: string;
	city: string;

	living_area_m2: number;
	plot_area_m2: number | null;
	rooms: number;
	bedrooms: number | null;
	bathrooms: number;
	year_built: number | null;
	floor_number: number | null;
	total_floors: number | null;

	archived_at: Date | null;
	created_at: Date;
	updated_at: Date;
};

export type PropertiesPageType = {
	items: PropertyType[];

	page: number;
	page_size: number;

	total_items: number;
	total_pages: number;

	has_previous_page: boolean;
	has_next_page: boolean;

	sort: PropertySortType;
	filters: PropertyFiltersType;
};
