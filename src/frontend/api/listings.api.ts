import type {
	AdminListingDetailType,
	AdminListingType,
	ArchiveListingBodyType,
	CreateListingBodyType,
	ListingsPageType,
	ListListingsQueryType,
	UpdateListingBodyType,
} from "#/shared/types/listing.type";
import { safe_API } from "./client";
import { unwrapApiResult } from "./utils";

export async function listListings(
	query: ListListingsQueryType,
): Promise<ListingsPageType> {
	const response = unwrapApiResult(
		await safe_API().admin.listings.get({ query }),
		"Unable to load listings",
	);
	return response.data;
}

export async function getListing(
	listingId: string,
): Promise<AdminListingDetailType> {
	const response = unwrapApiResult(
		await safe_API().admin.listings({ id: listingId }).get(),
		"Unable to load the listing",
	);
	return response.data;
}

export async function createListing({
	input,
	propertyId,
}: {
	input: CreateListingBodyType;
	propertyId: string;
}): Promise<AdminListingType> {
	const response = unwrapApiResult(
		await safe_API().admin.properties({ id: propertyId }).listings.post(input),
		"Unable to create the listing",
	);
	return response.data;
}

export async function updateListing({
	input,
	listingId,
}: {
	input: UpdateListingBodyType;
	listingId: string;
}): Promise<AdminListingType> {
	const response = unwrapApiResult(
		await safe_API().admin.listings({ id: listingId }).patch(input),
		"Unable to update the listing",
	);
	return response.data;
}

export async function publishListing(
	listingId: string,
): Promise<AdminListingType> {
	const response = unwrapApiResult(
		await safe_API().admin.listings({ id: listingId }).publish.post(),
		"Unable to publish the listing",
	);
	return response.data;
}

export async function archiveListing({
	input,
	listingId,
}: {
	input: ArchiveListingBodyType;
	listingId: string;
}): Promise<AdminListingType> {
	const response = unwrapApiResult(
		await safe_API().admin.listings({ id: listingId }).archive.post(input),
		"Unable to archive the listing",
	);
	return response.data;
}

export async function deleteDraftListing(
	listingId: string,
): Promise<AdminListingType> {
	const response = unwrapApiResult(
		await safe_API().admin.listings({ id: listingId }).delete(),
		"Unable to delete the listing draft",
	);
	return response.data;
}
