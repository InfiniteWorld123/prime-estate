import * as v from "valibot";

const UuidSchema = v.pipe(v.string(), v.uuid("Invalid UUID"));

const ListingTypeSchema = v.picklist(["SALE", "RENT"], "Invalid listing type");

const ListingStatusSchema = v.picklist(
	["DRAFT", "PUBLISHED", "ARCHIVED"],
	"Invalid listing status",
);

const ArchiveOutcomeSchema = v.picklist(
	["SOLD", "RENTED", "WITHDRAWN"],
	"Invalid archive outcome",
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

const OptionalNullablePriceSchema = v.optional(
	v.nullable(
		v.pipe(
			v.number(),
			v.finite("Price must be a finite number"),
			v.minValue(0.01, "Price must be greater than zero"),
		),
	),
);

const OptionalTextQuerySchema = v.optional(
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

const ListingContentSchema = {
	price_amount: OptionalNullablePriceSchema,
	title: OptionalNullableTextSchema,
	description: OptionalNullableTextSchema,
	slug: OptionalNullableTextSchema,
	seo_title: OptionalNullableTextSchema,
	seo_description: OptionalNullableTextSchema,
	show_exact_address: v.optional(v.boolean()),
};

export const CreateListingSchema = v.object({
	listing_type: ListingTypeSchema,
	...ListingContentSchema,
});

export const UpdateListingSchema = v.pipe(
	v.object(ListingContentSchema),
	v.check(
		(input) => Object.values(input).some((value) => value !== undefined),
		"At least one field is required",
	),
);

export const ListingPropertyParamsSchema = v.object({
	id: UuidSchema,
});

export const ListingParamsSchema = v.object({
	id: UuidSchema,
});

export const ArchiveListingSchema = v.object({
	archive_outcome: ArchiveOutcomeSchema,
});

export const ListListingsQuerySchema = v.object({
	search: OptionalTextQuerySchema,
	listing_type: v.optional(ListingTypeSchema),
	status: v.optional(ListingStatusSchema),
	archive_outcome: v.optional(ArchiveOutcomeSchema),
	property_id: v.optional(UuidSchema),
	city: OptionalTextQuerySchema,
	min_price: v.optional(QueryNonNegativeNumberSchema),
	max_price: v.optional(QueryNonNegativeNumberSchema),
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
				"price_asc",
				"price_desc",
				"published_newest",
				"title_asc",
				"title_desc",
			],
			"Invalid listing sort option",
		),
	),
});
