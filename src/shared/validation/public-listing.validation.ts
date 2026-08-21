import * as v from "valibot";

const ListingTypeSchema = v.picklist(["SALE", "RENT"], "Invalid listing type");

const PropertyTypeSchema = v.picklist(
	["APARTMENT", "HOUSE"],
	"Invalid property type",
);

const OptionalTextSchema = v.optional(
	v.pipe(
		v.string(),
		v.trim(),
		v.transform((value) => (value === "" ? undefined : value)),
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

const FeatureIdsSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, "Feature IDs cannot be empty"),
	v.transform((value) => value.split(",").map((id) => id.trim())),
	v.check(
		(ids) =>
			ids.every((id) => v.safeParse(v.pipe(v.string(), v.uuid()), id).success),
		"Invalid feature ID",
	),
	v.check(
		(ids) => new Set(ids).size === ids.length,
		"Feature IDs must be unique",
	),
	v.check((ids) => ids.length <= 30, "Cannot filter by more than 30 features"),
);

export const PublicListingSlugParamsSchema = v.object({
	slug: v.pipe(v.string(), v.trim(), v.minLength(1, "Slug is required")),
});

export const ListPublicListingsQuerySchema = v.object({
	listing_type: v.optional(ListingTypeSchema),
	property_type: v.optional(PropertyTypeSchema),
	city: OptionalTextSchema,
	postal_code: v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.regex(/^\d{5}$/, "Postal code must contain exactly 5 digits"),
		),
	),
	min_price: v.optional(QueryNonNegativeNumberSchema),
	max_price: v.optional(QueryNonNegativeNumberSchema),
	min_living_area: v.optional(QueryNonNegativeNumberSchema),
	max_living_area: v.optional(QueryNonNegativeNumberSchema),
	min_rooms: v.optional(QueryNonNegativeNumberSchema),
	max_rooms: v.optional(QueryNonNegativeNumberSchema),
	min_bedrooms: v.optional(QueryNonNegativeNumberSchema),
	feature_ids: v.optional(FeatureIdsSchema),
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
				"price_asc",
				"price_desc",
				"living_area_asc",
				"living_area_desc",
			],
			"Invalid listing sort option",
		),
	),
});
