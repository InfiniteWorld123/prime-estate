import * as v from "valibot";

const PropertyTypeSchema = v.picklist(
	["APARTMENT", "HOUSE"],
	"Invalid property type",
);

const PropertySourceSchema = v.picklist(
	["AGENCY_OWNED", "EXTERNAL_CLIENT"],
	"Invalid property source",
);

const RequiredTextSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, "This field is required"),
);

const OptionalTextSchema = v.optional(
	v.pipe(
		v.string(),
		v.trim(),
		v.transform((value) => (value === "" ? undefined : value)),
	),
);

const OptionalNullableTextSchema = v.optional(
	v.nullable(
		v.pipe(
			v.string(),
			v.trim(),
			v.transform((value) => (value === "" ? null : value)),
		),
	),
);

const UuidSchema = v.pipe(v.string(), v.uuid("Invalid UUID"));

const OptionalNullableUuidSchema = v.optional(v.nullable(UuidSchema));

const PositiveNumberSchema = v.pipe(
	v.number(),
	v.finite("Must be a finite number"),
	v.minValue(0.01, "Must be greater than zero"),
);

const OptionalNullablePositiveNumberSchema = v.optional(
	v.nullable(PositiveNumberSchema),
);

const PositiveIntegerSchema = v.pipe(
	v.number(),
	v.integer("Must be an integer"),
	v.minValue(1, "Must be at least 1"),
);

const NonNegativeIntegerSchema = v.pipe(
	v.number(),
	v.integer("Must be an integer"),
	v.minValue(0, "Cannot be negative"),
);

const OptionalNullablePositiveIntegerSchema = v.optional(
	v.nullable(PositiveIntegerSchema),
);

const OptionalNullableNonNegativeIntegerSchema = v.optional(
	v.nullable(NonNegativeIntegerSchema),
);

const OptionalNullableIntegerSchema = v.optional(
	v.nullable(v.pipe(v.number(), v.integer("Must be an integer"))),
);

const OptionalNullableYearSchema = v.optional(
	v.nullable(
		v.pipe(
			v.number(),
			v.integer("Year must be an integer"),
			v.minValue(1000, "Year must be at least 1000"),
			v.maxValue(9999, "Year cannot exceed 9999"),
		),
	),
);

const PostalCodeSchema = v.pipe(
	v.string(),
	v.trim(),
	v.regex(/^\d{5}$/, "Postal code must contain exactly 5 digits"),
);

const CreatePropertyObjectSchema = v.object({
	primary_contact_id: OptionalNullableUuidSchema,
	property_type: PropertyTypeSchema,
	property_source: PropertySourceSchema,

	street_name: RequiredTextSchema,
	house_number: RequiredTextSchema,
	unit_number: OptionalNullableTextSchema,
	postal_code: PostalCodeSchema,
	city: RequiredTextSchema,

	living_area_m2: PositiveNumberSchema,
	plot_area_m2: OptionalNullablePositiveNumberSchema,
	rooms: PositiveNumberSchema,
	bedrooms: OptionalNullableNonNegativeIntegerSchema,
	bathrooms: PositiveIntegerSchema,
	year_built: OptionalNullableYearSchema,
	floor_number: OptionalNullableIntegerSchema,
	total_floors: OptionalNullablePositiveIntegerSchema,
});

export const CreatePropertySchema = v.pipe(
	CreatePropertyObjectSchema,

	v.check(
		(input) =>
			input.property_source !== "EXTERNAL_CLIENT" ||
			input.primary_contact_id != null,
		"External client properties require a primary contact",
	),

	v.check(
		(input) =>
			input.property_source !== "AGENCY_OWNED" ||
			input.primary_contact_id == null,
		"Agency-owned properties cannot have a primary contact",
	),

	v.check(
		(input) =>
			input.property_type !== "APARTMENT" || input.plot_area_m2 == null,
		"Apartments cannot have a plot area",
	),

	v.check(
		(input) => input.property_type !== "HOUSE" || input.floor_number == null,
		"Houses cannot have an apartment floor number",
	),
);

export const UpdatePropertySchema = v.pipe(
	v.object({
		primary_contact_id: OptionalNullableUuidSchema,
		property_type: v.optional(PropertyTypeSchema),
		property_source: v.optional(PropertySourceSchema),

		street_name: v.optional(RequiredTextSchema),
		house_number: v.optional(RequiredTextSchema),
		unit_number: OptionalNullableTextSchema,
		postal_code: v.optional(PostalCodeSchema),
		city: v.optional(RequiredTextSchema),

		living_area_m2: v.optional(PositiveNumberSchema),
		plot_area_m2: OptionalNullablePositiveNumberSchema,
		rooms: v.optional(PositiveNumberSchema),
		bedrooms: OptionalNullableNonNegativeIntegerSchema,
		bathrooms: v.optional(PositiveIntegerSchema),
		year_built: OptionalNullableYearSchema,
		floor_number: OptionalNullableIntegerSchema,
		total_floors: OptionalNullablePositiveIntegerSchema,
	}),
	v.check(
		(input) => Object.values(input).some((value) => value !== undefined),
		"At least one field is required",
	),
);

const QueryPositiveIntegerSchema = v.pipe(
	v.string(),
	v.regex(/^\d+$/, "Must be a positive integer"),
	v.transform(Number),
	v.minValue(1, "Must be at least 1"),
);

const QueryNonNegativeNumberSchema = v.pipe(
	v.string(),
	v.regex(/^\d+(\.\d+)?$/, "Must be a non-negative number"),
	v.transform(Number),
);

const QueryNonNegativeIntegerSchema = v.pipe(
	v.string(),
	v.regex(/^\d+$/, "Must be a non-negative integer"),
	v.transform(Number),
);

const QueryYearSchema = v.pipe(
	v.string(),
	v.regex(/^\d{4}$/, "Must be a four-digit year"),
	v.transform(Number),
	v.minValue(1000, "Year must be at least 1000"),
	v.maxValue(9999, "Year cannot exceed 9999"),
);

export const PropertyParamsSchema = v.object({
	id: UuidSchema,
});

export const BulkArchivePropertiesSchema = v.pipe(
	v.object({
		property_ids: v.pipe(
			v.array(UuidSchema),
			v.minLength(1, "At least one property ID is required"),
			v.maxLength(100, "Cannot archive more than 100 properties at once"),
		),
	}),
	v.check(
		(input) => new Set(input.property_ids).size === input.property_ids.length,
		"Property IDs must be unique",
	),
);

export const ListPropertiesQuerySchema = v.object({
	search: OptionalTextSchema,

	property_type: v.optional(PropertyTypeSchema),
	property_source: v.optional(PropertySourceSchema),

	city: OptionalTextSchema,
	postal_code: v.optional(PostalCodeSchema),
	primary_contact_id: v.optional(UuidSchema),

	archive_status: v.optional(
		v.picklist(["active", "archived", "all"], "Invalid archive status"),
	),

	min_living_area: v.optional(QueryNonNegativeNumberSchema),
	max_living_area: v.optional(QueryNonNegativeNumberSchema),

	min_plot_area: v.optional(QueryNonNegativeNumberSchema),
	max_plot_area: v.optional(QueryNonNegativeNumberSchema),

	min_rooms: v.optional(QueryNonNegativeNumberSchema),
	max_rooms: v.optional(QueryNonNegativeNumberSchema),

	min_bedrooms: v.optional(QueryNonNegativeIntegerSchema),
	max_bedrooms: v.optional(QueryNonNegativeIntegerSchema),

	min_bathrooms: v.optional(QueryPositiveIntegerSchema),
	max_bathrooms: v.optional(QueryPositiveIntegerSchema),

	min_year_built: v.optional(QueryYearSchema),
	max_year_built: v.optional(QueryYearSchema),

	page: v.optional(QueryPositiveIntegerSchema),

	page_size: v.optional(
		v.pipe(
			QueryPositiveIntegerSchema,
			v.maxValue(100, "Page size cannot exceed 100"),
		),
	),

	sort: v.optional(
		v.picklist(
			[
				"newest",
				"oldest",
				"recently_updated",
				"reference_asc",
				"reference_desc",
				"living_area_asc",
				"living_area_desc",
				"rooms_asc",
				"rooms_desc",
				"year_built_asc",
				"year_built_desc",
				"city_asc",
				"city_desc",
			],
			"Invalid property sort option",
		),
	),
});
