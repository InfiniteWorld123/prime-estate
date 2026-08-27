import type {
	BulkArchivePropertiesBodyType,
	BulkArchivePropertiesResultType,
	CreatePropertyBodyType,
	ListPropertiesQueryType,
	PropertiesPageType,
	PropertyType,
	UpdatePropertyBodyType,
} from "#/shared/types/property.type";
import { safe_API } from "./client";
import { unwrapApiResult } from "./utils";

export async function listProperties(
	query: ListPropertiesQueryType,
): Promise<PropertiesPageType> {
	const response = unwrapApiResult(
		await safe_API().admin.properties.get({ query }),
		"Unable to load properties",
	);

	return response.data;
}

export async function getProperty(propertyId: string): Promise<PropertyType> {
	const response = unwrapApiResult(
		await safe_API().admin.properties({ id: propertyId }).get(),
		"Unable to load the property",
	);

	return response.data;
}

export async function createProperty(
	input: CreatePropertyBodyType,
): Promise<PropertyType> {
	const response = unwrapApiResult(
		await safe_API().admin.properties.post(input),
		"Unable to create the property",
	);

	return response.data;
}

export async function updateProperty({
	input,
	propertyId,
}: {
	input: UpdatePropertyBodyType;
	propertyId: string;
}): Promise<PropertyType> {
	const response = unwrapApiResult(
		await safe_API().admin.properties({ id: propertyId }).patch(input),
		"Unable to update the property",
	);

	return response.data;
}

export async function archiveProperty(
	propertyId: string,
): Promise<PropertyType> {
	const response = unwrapApiResult(
		await safe_API().admin.properties({ id: propertyId }).archive.post(),
		"Unable to archive the property",
	);

	return response.data;
}

export async function restoreProperty(
	propertyId: string,
): Promise<PropertyType> {
	const response = unwrapApiResult(
		await safe_API().admin.properties({ id: propertyId }).restore.post(),
		"Unable to restore the property",
	);

	return response.data;
}

export async function deleteProperty(
	propertyId: string,
): Promise<PropertyType> {
	const response = unwrapApiResult(
		await safe_API().admin.properties({ id: propertyId }).delete(),
		"Unable to delete the property",
	);

	return response.data;
}

export async function bulkArchiveProperties(
	input: BulkArchivePropertiesBodyType,
): Promise<BulkArchivePropertiesResultType> {
	const response = unwrapApiResult(
		await safe_API().admin.properties["bulk-archive"].post(input),
		"Unable to archive the selected properties",
	);

	return response.data;
}
