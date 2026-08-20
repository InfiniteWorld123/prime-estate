import * as v from "valibot";

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

const OptionalEmailSchema = v.optional(
	v.union([
		v.pipe(
			v.string(),
			v.trim(),
			v.length(0),
			v.transform(() => undefined),
		),
		v.pipe(
			v.string(),
			v.trim(),
			v.toLowerCase(),
			v.email("Please enter a valid email address"),
		),
	]),
);

const OptionalNullableEmailSchema = v.optional(
	v.nullable(
		v.union([
			v.pipe(
				v.string(),
				v.trim(),
				v.length(0),
				v.transform(() => null),
			),
			v.pipe(
				v.string(),
				v.trim(),
				v.toLowerCase(),
				v.email("Please enter a valid email address"),
			),
		]),
	),
);

const PositiveIntegerSchema = v.pipe(
	v.string(),
	v.regex(/^\d+$/, "Must be a positive integer"),
	v.transform(Number),
	v.minValue(1, "Must be at least 1"),
);

export const CreateContactSchema = v.pipe(
	v.object({
		full_name: v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, "Full name is required"),
		),
		company_name: OptionalTextSchema,
		email: OptionalEmailSchema,
		phone: OptionalTextSchema,
	}),
	v.check(
		(input) => input.email !== undefined || input.phone !== undefined,
		"Email or phone is required",
	),
);

export const UpdateContactSchema = v.pipe(
	v.object({
		full_name: v.optional(
			v.pipe(v.string(), v.trim(), v.minLength(1, "Full name cannot be blank")),
		),
		company_name: OptionalNullableTextSchema,
		email: OptionalNullableEmailSchema,
		phone: OptionalNullableTextSchema,
	}),
	v.check(
		(input) => Object.values(input).some((value) => value !== undefined),
		"At least one field is required",
	),
);

export const ContactParamsSchema = v.object({
	id: v.pipe(v.string(), v.uuid("Invalid contact ID")),
});

export const ListContactsQuerySchema = v.object({
	search: OptionalTextSchema,
	page: v.optional(PositiveIntegerSchema),
	page_size: v.optional(
		v.pipe(
			PositiveIntegerSchema,
			v.maxValue(100, "Page size cannot exceed 100"),
		),
	),
	sort: v.optional(
		v.picklist(
			["newest", "oldest", "name_asc", "name_desc"],
			"Invalid contact sort option",
		),
	),
});
