import type {
	ListPublicListingsQueryType,
	PublicFeatureType,
	PublicListingDetailType,
	PublicListingsPageType,
} from "#/shared/types/public-listing.type";
import { safe_API } from "./client";
import { unwrapApiResult } from "./utils";

export async function listPublicListings(
	query: ListPublicListingsQueryType,
): Promise<PublicListingsPageType> {
	const response = unwrapApiResult(
		await safe_API().listings.get({ query }),
		"Unable to load public listings",
	);
	return response.data;
}

export async function getPublicListing(
	slug: string,
): Promise<PublicListingDetailType> {
	const response = unwrapApiResult(
		await safe_API().listings({ slug }).get(),
		"Unable to load the public listing",
	);
	return response.data;
}

export async function listPublicFeatures(): Promise<PublicFeatureType[]> {
	const response = unwrapApiResult(
		await safe_API().features.get(),
		"Unable to load public features",
	);
	return response.data;
}
