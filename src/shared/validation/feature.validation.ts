import * as v from "valibot";

const FeatureNameSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, "Feature name is required"),
);

const UuidSchema = v.pipe(v.string(), v.uuid("Invalid UUID"));

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

export const CreateFeatureSchema = v.object({
	name: FeatureNameSchema,
});

export const UpdateFeatureSchema = v.object({
	name: FeatureNameSchema,
});

export const FeatureParamsSchema = v.object({
	id: UuidSchema,
});

export const PropertyFeatureParamsSchema = v.object({
	id: UuidSchema,
});

export const ReplacePropertyFeaturesSchema = v.pipe(
	v.object({
		feature_ids: v.array(UuidSchema),
	}),
	v.check(
		(input) => new Set(input.feature_ids).size === input.feature_ids.length,
		"Feature IDs must be unique",
	),
);

export const ListFeaturesQuerySchema = v.object({
	search: OptionalTextSchema,
	page: v.optional(QueryPositiveIntegerSchema),
	page_size: v.optional(
		v.pipe(
			QueryPositiveIntegerSchema,
			v.maxValue(100, "Page size cannot exceed 100"),
		),
	),
	sort: v.optional(
		v.picklist(
			["name_asc", "name_desc", "code_asc", "newest", "oldest"],
			"Invalid feature sort option",
		),
	),
});
