import type * as v from "valibot";
import type {
	PropertyImageParamsSchema,
	PropertyImagePropertyParamsSchema,
	ReorderPropertyImagesSchema,
	UpdatePropertyImageSchema,
	UploadPropertyImageMetadataSchema,
} from "../validation/property-image.validation";

export type PropertyImagePropertyParamsType = v.InferInput<
	typeof PropertyImagePropertyParamsSchema
>;
export type PropertyImageParamsType = v.InferInput<
	typeof PropertyImageParamsSchema
>;
export type UploadPropertyImageMetadataType = v.InferInput<
	typeof UploadPropertyImageMetadataSchema
>;
export type UpdatePropertyImageBodyType = v.InferInput<
	typeof UpdatePropertyImageSchema
>;
export type UpdatePropertyImageDataType = v.InferOutput<
	typeof UpdatePropertyImageSchema
>;
export type ReorderPropertyImagesBodyType = v.InferInput<
	typeof ReorderPropertyImagesSchema
>;
export type ReorderPropertyImagesDataType = v.InferOutput<
	typeof ReorderPropertyImagesSchema
>;

export type PropertyImageType = {
	id: string;
	property_id: string;
	storage_key: string;
	url: string;
	alt_text: string | null;
	sort_order: number;
	is_cover: boolean;
	created_at: Date;
	updated_at: Date;
};
