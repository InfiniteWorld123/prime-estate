import { status } from "elysia";
import * as v from "valibot";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	CreatePropertyBodyType,
	ListPropertiesQueryType,
	PropertyParamsType,
	UpdatePropertyBodyType,
} from "#/shared/types/property.type";
import {
	CreatePropertySchema,
	PropertyParamsSchema,
	UpdatePropertySchema,
} from "#/shared/validation/property.validation";
import {
	archivePropertyService,
	createPropertyService,
	deletePropertyService,
	getPropertyByIdService,
	listPropertiesService,
	restorePropertyService,
	updatePropertyService,
} from "./property.service";

export const createProperty = async ({
	body,
}: {
	body: CreatePropertyBodyType;
}) => {
	const parsedBody = v.parse(CreatePropertySchema, body);

	const property = await createPropertyService(parsedBody);

	return status(
		HttpStatusCode.CREATED,
		responseOk({
			data: property,
			message: "Property created",
		}),
	);
};

export const listProperties = async ({
	query,
}: {
	query: ListPropertiesQueryType;
}) => {
	const properties = await listPropertiesService(query);

	return responseOk({
		data: properties,
		message: "Properties retrieved",
	});
};

export const getPropertyById = async ({
	params,
}: {
	params: PropertyParamsType;
}) => {
	const parsedParams = v.parse(PropertyParamsSchema, params);

	const property = await getPropertyByIdService(parsedParams.id);

	return responseOk({
		data: property,
		message: "Property retrieved",
	});
};

export const updateProperty = async ({
	params,
	body,
}: {
	params: PropertyParamsType;
	body: UpdatePropertyBodyType;
}) => {
	const parsedParams = v.parse(PropertyParamsSchema, params);

	const parsedBody = v.parse(UpdatePropertySchema, body);

	const property = await updatePropertyService(parsedParams.id, parsedBody);

	return responseOk({
		data: property,
		message: "Property updated",
	});
};

export const archiveProperty = async ({
	params,
}: {
	params: PropertyParamsType;
}) => {
	const parsedParams = v.parse(PropertyParamsSchema, params);

	const property = await archivePropertyService(parsedParams.id);

	return responseOk({
		data: property,
		message: "Property archived",
	});
};

export const restoreProperty = async ({
	params,
}: {
	params: PropertyParamsType;
}) => {
	const parsedParams = v.parse(PropertyParamsSchema, params);

	const property = await restorePropertyService(parsedParams.id);

	return responseOk({
		data: property,
		message: "Property restored",
	});
};

export const deleteProperty = async ({
	params,
}: {
	params: PropertyParamsType;
}) => {
	const parsedParams = v.parse(PropertyParamsSchema, params);

	const property = await deletePropertyService(parsedParams.id);

	return responseOk({
		data: property,
		message: "Property deleted",
	});
};
