import { Elysia } from "elysia";
import {
	ArchiveListingSchema,
	CreateListingSchema,
	ListingParamsSchema,
	ListingPropertyParamsSchema,
	ListListingsQuerySchema,
	UpdateListingSchema,
} from "#/shared/validation/listing.validation";
import {
	archiveListing,
	createListing,
	deleteDraftListing,
	getListingById,
	listListings,
	publishListing,
	updateListing,
} from "./listing.controller";

export const listingRoutes = new Elysia()
	.post("/properties/:id/listings", createListing, {
		params: ListingPropertyParamsSchema,
		body: CreateListingSchema,
	})
	.get("/listings", listListings, { query: ListListingsQuerySchema })
	.get("/listings/:id", getListingById, { params: ListingParamsSchema })
	.patch("/listings/:id", updateListing, {
		params: ListingParamsSchema,
		body: UpdateListingSchema,
	})
	.post("/listings/:id/publish", publishListing, {
		params: ListingParamsSchema,
	})
	.post("/listings/:id/archive", archiveListing, {
		params: ListingParamsSchema,
		body: ArchiveListingSchema,
	})
	.delete("/listings/:id", deleteDraftListing, {
		params: ListingParamsSchema,
	});
