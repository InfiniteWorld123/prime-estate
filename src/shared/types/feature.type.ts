import type * as v from "valibot";
import type {
	CreateFeatureSchema,
	FeatureParamsSchema,
	ListFeaturesQuerySchema,
	PropertyFeatureParamsSchema,
	ReplacePropertyFeaturesSchema,
	UpdateFeatureSchema,
} from "../validation/feature.validation";

export type CreateFeatureBodyType = v.InferInput<typeof CreateFeatureSchema>;
export type CreateFeatureDataType = v.InferOutput<typeof CreateFeatureSchema>;
export type UpdateFeatureBodyType = v.InferInput<typeof UpdateFeatureSchema>;
export type UpdateFeatureDataType = v.InferOutput<typeof UpdateFeatureSchema>;
export type FeatureParamsType = v.InferInput<typeof FeatureParamsSchema>;
export type PropertyFeatureParamsType = v.InferInput<
	typeof PropertyFeatureParamsSchema
>;
export type ReplacePropertyFeaturesBodyType = v.InferInput<
	typeof ReplacePropertyFeaturesSchema
>;
export type ReplacePropertyFeaturesDataType = v.InferOutput<
	typeof ReplacePropertyFeaturesSchema
>;
export type ListFeaturesQueryType = v.InferOutput<
	typeof ListFeaturesQuerySchema
>;
export type ListFeaturesDataType = v.InferOutput<
	typeof ListFeaturesQuerySchema
>;
export type FeatureSortType = NonNullable<ListFeaturesDataType["sort"]>;

export type FeatureType = {
	id: string;
	code: string;
	name: string;
	created_at: Date;
	updated_at: Date;
};

export type FeaturesPageType = {
	items: FeatureType[];
	page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
	has_previous_page: boolean;
	has_next_page: boolean;
	sort: FeatureSortType;
};
