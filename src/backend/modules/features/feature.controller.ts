import { status } from "elysia";
import * as v from "valibot";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	CreateFeatureBodyType,
	FeatureParamsType,
	ListFeaturesQueryType,
	PropertyFeatureParamsType,
	ReplacePropertyFeaturesBodyType,
	UpdateFeatureBodyType,
} from "#/shared/types/feature.type";
import {
	CreateFeatureSchema,
	FeatureParamsSchema,
	PropertyFeatureParamsSchema,
	ReplacePropertyFeaturesSchema,
	UpdateFeatureSchema,
} from "#/shared/validation/feature.validation";
import {
	createFeatureService,
	deleteFeatureService,
	getFeatureByIdService,
	getPropertyFeaturesService,
	listFeatureOptionsService,
	listFeaturesService,
	replacePropertyFeaturesService,
	updateFeatureService,
} from "./feature.service";

export const createFeature = async ({
	body,
}: {
	body: CreateFeatureBodyType;
}) => {
	const feature = await createFeatureService(
		v.parse(CreateFeatureSchema, body),
	);
	return status(
		HttpStatusCode.CREATED,
		responseOk({ data: feature, message: "Feature created" }),
	);
};

export const listFeatures = async ({
	query,
}: {
	query: ListFeaturesQueryType;
}) =>
	responseOk({
		data: await listFeaturesService(query),
		message: "Features retrieved",
	});

export const listFeatureOptions = async () =>
	responseOk({
		data: await listFeatureOptionsService(),
		message: "Feature options retrieved",
	});

export const getFeatureById = async ({
	params,
}: {
	params: FeatureParamsType;
}) => {
	const { id } = v.parse(FeatureParamsSchema, params);
	return responseOk({
		data: await getFeatureByIdService(id),
		message: "Feature retrieved",
	});
};

export const updateFeature = async ({
	params,
	body,
}: {
	params: FeatureParamsType;
	body: UpdateFeatureBodyType;
}) => {
	const { id } = v.parse(FeatureParamsSchema, params);
	const input = v.parse(UpdateFeatureSchema, body);
	return responseOk({
		data: await updateFeatureService(id, input),
		message: "Feature updated",
	});
};

export const deleteFeature = async ({
	params,
}: {
	params: FeatureParamsType;
}) => {
	const { id } = v.parse(FeatureParamsSchema, params);
	return responseOk({
		data: await deleteFeatureService(id),
		message: "Feature deleted",
	});
};

export const getPropertyFeatures = async ({
	params,
}: {
	params: PropertyFeatureParamsType;
}) => {
	const { id } = v.parse(PropertyFeatureParamsSchema, params);
	return responseOk({
		data: await getPropertyFeaturesService(id),
		message: "Property features retrieved",
	});
};

export const replacePropertyFeatures = async ({
	params,
	body,
}: {
	params: PropertyFeatureParamsType;
	body: ReplacePropertyFeaturesBodyType;
}) => {
	const { id } = v.parse(PropertyFeatureParamsSchema, params);
	const input = v.parse(ReplacePropertyFeaturesSchema, body);
	return responseOk({
		data: await replacePropertyFeaturesService(id, input),
		message: "Property features replaced",
	});
};
