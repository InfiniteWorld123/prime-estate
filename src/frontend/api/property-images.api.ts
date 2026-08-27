import type {
	PropertyImageType,
	ReorderPropertyImagesBodyType,
	UpdatePropertyImageBodyType,
} from "#/shared/types/property-image.type";
import { safe_API } from "./client";
import { unwrapApiResult } from "./utils";

export async function listPropertyImages(
	propertyId: string,
): Promise<PropertyImageType[]> {
	const response = unwrapApiResult(
		await safe_API().admin.properties({ id: propertyId }).images.get(),
		"Unable to load property images",
	);
	return response.data;
}

export async function uploadPropertyImage({
	altText,
	file,
	propertyId,
}: {
	altText?: string | null;
	file: File;
	propertyId: string;
}): Promise<PropertyImageType> {
	const response = unwrapApiResult(
		await safe_API()
			.admin.properties({ id: propertyId })
			.images.post({
				alt_text: altText ?? undefined,
				file,
			}),
		"Unable to upload the image",
	);
	return response.data;
}

export async function updatePropertyImage({
	imageId,
	input,
	propertyId,
}: {
	imageId: string;
	input: UpdatePropertyImageBodyType;
	propertyId: string;
}): Promise<PropertyImageType> {
	const response = unwrapApiResult(
		await safe_API()
			.admin.properties({ id: propertyId })
			.images({ imageId })
			.patch(input),
		"Unable to update the image",
	);
	return response.data;
}

export async function deletePropertyImage({
	imageId,
	propertyId,
}: {
	imageId: string;
	propertyId: string;
}): Promise<PropertyImageType> {
	const response = unwrapApiResult(
		await safe_API()
			.admin.properties({ id: propertyId })
			.images({ imageId })
			.delete(),
		"Unable to delete the image",
	);
	return response.data;
}

export async function reorderPropertyImages({
	input,
	propertyId,
}: {
	input: ReorderPropertyImagesBodyType;
	propertyId: string;
}): Promise<PropertyImageType[]> {
	const response = unwrapApiResult(
		await safe_API()
			.admin.properties({ id: propertyId })
			.images.order.put(input),
		"Unable to save the image order",
	);
	return response.data;
}

export async function setPropertyCoverImage({
	imageId,
	propertyId,
}: {
	imageId: string;
	propertyId: string;
}): Promise<PropertyImageType> {
	const response = unwrapApiResult(
		await safe_API()
			.admin.properties({ id: propertyId })
			.images({ imageId })
			.cover.post(),
		"Unable to set the cover image",
	);
	return response.data;
}
