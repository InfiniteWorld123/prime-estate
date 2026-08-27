import type { FeatureType } from "#/shared/types/feature.type";
import { safe_API } from "./client";
import { unwrapApiResult } from "./utils";

export async function listFeatureOptions(): Promise<FeatureType[]> {
	const response = unwrapApiResult(
		await safe_API().admin.features.options.get(),
		"Unable to load feature options",
	);
	return response.data;
}

export async function getPropertyFeatures(
	propertyId: string,
): Promise<FeatureType[]> {
	const response = unwrapApiResult(
		await safe_API().admin.properties({ id: propertyId }).features.get(),
		"Unable to load property features",
	);
	return response.data;
}

export async function createFeature(name: string): Promise<FeatureType> {
	const response = unwrapApiResult(
		await safe_API().admin.features.post({ name }),
		"Unable to create the feature",
	);
	return response.data;
}

export async function replacePropertyFeatures({
	featureIds,
	propertyId,
}: {
	featureIds: string[];
	propertyId: string;
}): Promise<FeatureType[]> {
	const response = unwrapApiResult(
		await safe_API()
			.admin.properties({ id: propertyId })
			.features.put({ feature_ids: featureIds }),
		"Unable to save property features",
	);
	return response.data;
}
