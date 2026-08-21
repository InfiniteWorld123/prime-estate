import * as v from "valibot";

const UuidSchema = v.pipe(v.string(), v.uuid("Invalid UUID"));

const AltTextSchema = v.nullable(
	v.pipe(
		v.string(),
		v.trim(),
		v.maxLength(300, "Alt text cannot exceed 300 characters"),
		v.transform((value) => (value === "" ? null : value)),
	),
);

export const PropertyImagePropertyParamsSchema = v.object({
	id: UuidSchema,
});

export const PropertyImageParamsSchema = v.object({
	id: UuidSchema,
	imageId: UuidSchema,
});

export const UploadPropertyImageMetadataSchema = v.object({
	alt_text: v.optional(AltTextSchema, null),
});

export const UpdatePropertyImageSchema = v.object({
	alt_text: AltTextSchema,
});

export const ReorderPropertyImagesSchema = v.pipe(
	v.object({
		image_ids: v.pipe(
			v.array(UuidSchema),
			v.minLength(1, "At least one image ID is required"),
		),
	}),
	v.check(
		(input) => new Set(input.image_ids).size === input.image_ids.length,
		"Image IDs must be unique",
	),
);
