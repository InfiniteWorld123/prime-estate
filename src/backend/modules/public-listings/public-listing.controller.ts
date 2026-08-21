import * as v from "valibot";
import { responseOk } from "#/backend/shared/response";
import type {
	ListPublicListingsQueryType,
	PublicListingSlugParamsType,
} from "#/shared/types/public-listing.type";
import { PublicListingSlugParamsSchema } from "#/shared/validation/public-listing.validation";
import {
	getPublicListingBySlugService,
	listPublicFeaturesService,
	listPublicListingsService,
} from "./public-listing.service";

export const listPublicListings = async ({
	query,
}: {
	query: ListPublicListingsQueryType;
}) =>
	responseOk({
		data: await listPublicListingsService(query),
		message: "Listings retrieved",
	});

export const getPublicListingBySlug = async ({
	params,
}: {
	params: PublicListingSlugParamsType;
}) => {
	const { slug } = v.parse(PublicListingSlugParamsSchema, params);
	return responseOk({
		data: await getPublicListingBySlugService(slug),
		message: "Listing retrieved",
	});
};

export const listPublicFeatures = async () =>
	responseOk({
		data: await listPublicFeaturesService(),
		message: "Features retrieved",
	});
