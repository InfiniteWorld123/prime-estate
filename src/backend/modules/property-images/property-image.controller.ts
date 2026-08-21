import { status } from "elysia";
import * as v from "valibot";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	PropertyImageParamsType,
	PropertyImagePropertyParamsType,
	ReorderPropertyImagesBodyType,
	UpdatePropertyImageBodyType,
	UploadPropertyImageMetadataType,
} from "#/shared/types/property-image.type";
import {
	PropertyImageParamsSchema,
	PropertyImagePropertyParamsSchema,
	ReorderPropertyImagesSchema,
	UpdatePropertyImageSchema,
	UploadPropertyImageMetadataSchema,
} from "#/shared/validation/property-image.validation";
import {
	deletePropertyImageService,
	listPropertyImagesService,
	reorderPropertyImagesService,
	setPropertyCoverImageService,
	updatePropertyImageService,
	uploadPropertyImageService,
} from "./property-image.service";

export const listPropertyImages = async ({
	params,
}: {
	params: PropertyImagePropertyParamsType;
}) => {
	const { id: propertyId } = v.parse(PropertyImagePropertyParamsSchema, params);
	return responseOk({
		data: await listPropertyImagesService(propertyId),
		message: "Property images retrieved",
	});
};

export const uploadImage = async ({
	params,
	body,
}: {
	params: PropertyImagePropertyParamsType;
	body: { file: File; alt_text?: string | null };
}) => {
	const { id: propertyId } = v.parse(PropertyImagePropertyParamsSchema, params);
	const metadata = v.parse(UploadPropertyImageMetadataSchema, {
		alt_text: body.alt_text,
	} satisfies UploadPropertyImageMetadataType);
	const image = await uploadPropertyImageService(
		propertyId,
		body.file,
		metadata.alt_text,
	);
	return status(
		HttpStatusCode.CREATED,
		responseOk({ data: image, message: "Property image uploaded" }),
	);
};

export const updatePropertyImage = async ({
	params,
	body,
}: {
	params: PropertyImageParamsType;
	body: UpdatePropertyImageBodyType;
}) => {
	const { id: propertyId, imageId } = v.parse(
		PropertyImageParamsSchema,
		params,
	);
	const input = v.parse(UpdatePropertyImageSchema, body);
	return responseOk({
		data: await updatePropertyImageService(propertyId, imageId, input),
		message: "Property image updated",
	});
};

export const reorderPropertyImages = async ({
	params,
	body,
}: {
	params: PropertyImagePropertyParamsType;
	body: ReorderPropertyImagesBodyType;
}) => {
	const { id: propertyId } = v.parse(PropertyImagePropertyParamsSchema, params);
	const input = v.parse(ReorderPropertyImagesSchema, body);
	return responseOk({
		data: await reorderPropertyImagesService(propertyId, input),
		message: "Property images reordered",
	});
};

export const setPropertyCoverImage = async ({
	params,
}: {
	params: PropertyImageParamsType;
}) => {
	const { id: propertyId, imageId } = v.parse(
		PropertyImageParamsSchema,
		params,
	);
	return responseOk({
		data: await setPropertyCoverImageService(propertyId, imageId),
		message: "Property cover image updated",
	});
};

export const deletePropertyImage = async ({
	params,
}: {
	params: PropertyImageParamsType;
}) => {
	const { id: propertyId, imageId } = v.parse(
		PropertyImageParamsSchema,
		params,
	);
	return responseOk({
		data: await deletePropertyImageService(propertyId, imageId),
		message: "Property image deleted",
	});
};
