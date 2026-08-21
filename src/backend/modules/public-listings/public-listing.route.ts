import { Elysia } from "elysia";
import {
	ListPublicListingsQuerySchema,
	PublicListingSlugParamsSchema,
} from "#/shared/validation/public-listing.validation";
import {
	getPublicListingBySlug,
	listPublicFeatures,
	listPublicListings,
} from "./public-listing.controller";

export const publicListingRoutes = new Elysia()
	.get("/listings", listPublicListings, {
		query: ListPublicListingsQuerySchema,
	})
	.get("/listings/:slug", getPublicListingBySlug, {
		params: PublicListingSlugParamsSchema,
	})
	.get("/features", listPublicFeatures);
