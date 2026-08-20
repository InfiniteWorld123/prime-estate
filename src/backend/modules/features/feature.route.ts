import { Elysia } from "elysia";
import {
	CreateFeatureSchema,
	FeatureParamsSchema,
	ListFeaturesQuerySchema,
	PropertyFeatureParamsSchema,
	ReplacePropertyFeaturesSchema,
	UpdateFeatureSchema,
} from "#/shared/validation/feature.validation";
import {
	createFeature,
	deleteFeature,
	getFeatureById,
	getPropertyFeatures,
	listFeatureOptions,
	listFeatures,
	replacePropertyFeatures,
	updateFeature,
} from "./feature.controller";

export const featureRoutes = new Elysia()
	.post("/features", createFeature, { body: CreateFeatureSchema })
	.get("/features", listFeatures, { query: ListFeaturesQuerySchema })
	.get("/features/options", listFeatureOptions)
	.get("/features/:id", getFeatureById, { params: FeatureParamsSchema })
	.patch("/features/:id", updateFeature, {
		params: FeatureParamsSchema,
		body: UpdateFeatureSchema,
	})
	.delete("/features/:id", deleteFeature, { params: FeatureParamsSchema })
	.get("/properties/:id/features", getPropertyFeatures, {
		params: PropertyFeatureParamsSchema,
	})
	.put("/properties/:id/features", replacePropertyFeatures, {
		params: PropertyFeatureParamsSchema,
		body: ReplacePropertyFeaturesSchema,
	});
