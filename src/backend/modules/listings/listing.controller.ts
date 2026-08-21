import { status } from "elysia";
import * as v from "valibot";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	ArchiveListingBodyType,
	CreateListingBodyType,
	ListingParamsType,
	ListingPropertyParamsType,
	ListListingsQueryType,
	UpdateListingBodyType,
} from "#/shared/types/listing.type";
import {
	ArchiveListingSchema,
	CreateListingSchema,
	ListingParamsSchema,
	ListingPropertyParamsSchema,
	UpdateListingSchema,
} from "#/shared/validation/listing.validation";
import {
	archiveListingService,
	createListingService,
	deleteDraftListingService,
	getAdminListingByIdService,
	listAdminListingsService,
	publishListingService,
	updateListingService,
} from "./listing.service";

export const createListing = async ({
	params,
	body,
}: {
	params: ListingPropertyParamsType;
	body: CreateListingBodyType;
}) => {
	const { id: propertyId } = v.parse(ListingPropertyParamsSchema, params);
	const input = v.parse(CreateListingSchema, body);
	return status(
		HttpStatusCode.CREATED,
		responseOk({
			data: await createListingService(propertyId, input),
			message: "Listing draft created",
		}),
	);
};

export const listListings = async ({
	query,
}: {
	query: ListListingsQueryType;
}) =>
	responseOk({
		data: await listAdminListingsService(query),
		message: "Listings retrieved",
	});

export const getListingById = async ({
	params,
}: {
	params: ListingParamsType;
}) => {
	const { id } = v.parse(ListingParamsSchema, params);
	return responseOk({
		data: await getAdminListingByIdService(id),
		message: "Listing retrieved",
	});
};

export const updateListing = async ({
	params,
	body,
}: {
	params: ListingParamsType;
	body: UpdateListingBodyType;
}) => {
	const { id } = v.parse(ListingParamsSchema, params);
	const input = v.parse(UpdateListingSchema, body);
	return responseOk({
		data: await updateListingService(id, input),
		message: "Listing updated",
	});
};

export const publishListing = async ({
	params,
}: {
	params: ListingParamsType;
}) => {
	const { id } = v.parse(ListingParamsSchema, params);
	return responseOk({
		data: await publishListingService(id),
		message: "Listing published",
	});
};

export const archiveListing = async ({
	params,
	body,
}: {
	params: ListingParamsType;
	body: ArchiveListingBodyType;
}) => {
	const { id } = v.parse(ListingParamsSchema, params);
	const input = v.parse(ArchiveListingSchema, body);
	return responseOk({
		data: await archiveListingService(id, input),
		message: "Listing archived",
	});
};

export const deleteDraftListing = async ({
	params,
}: {
	params: ListingParamsType;
}) => {
	const { id } = v.parse(ListingParamsSchema, params);
	return responseOk({
		data: await deleteDraftListingService(id),
		message: "Listing draft deleted",
	});
};
