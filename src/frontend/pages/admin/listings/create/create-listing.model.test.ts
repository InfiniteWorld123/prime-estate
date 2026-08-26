import { describe, expect, it } from "vitest";

import type { AdminListingDetailRecord } from "@/frontend/features/listings/admin-listing.types";
import { getListingCreationPrefill } from "./create-listing.model";

const createListing = (
	override: Partial<AdminListingDetailRecord> = {},
): AdminListingDetailRecord => ({
	archiveOutcome: null,
	archivedAt: null,
	coverImage: null,
	createdAt: "2026-08-26T10:00:00.000Z",
	currencyCode: "EUR",
	description: "Reusable description",
	features: [],
	id: "listing-rent",
	images: [],
	listingType: "RENT",
	priceAmount: 1_200,
	property: {
		city: "Erfurt",
		houseNumber: "12",
		id: "property-1",
		livingArea: 90,
		postalCode: "99084",
		propertyType: "APARTMENT",
		referenceNumber: "PE-1001",
		rooms: 4,
		streetName: "Teststrasse",
	},
	publishedAt: null,
	seoDescription: null,
	seoTitle: null,
	showExactAddress: true,
	slug: "reusable-listing",
	status: "DRAFT",
	title: "Reusable title",
	updatedAt: "2026-08-26T10:00:00.000Z",
	...override,
});

describe("listing creation prefill", () => {
	it("uses an active rent listing when sale is the remaining type", () => {
		const rentListing = createListing();
		expect(getListingCreationPrefill("property-1", [rentListing])).toEqual({
			sourceListing: rentListing,
			targetType: "SALE",
		});
	});

	it("uses an active sale listing when rent is the remaining type", () => {
		const saleListing = createListing({
			id: "listing-sale",
			listingType: "SALE",
		});
		expect(getListingCreationPrefill("property-1", [saleListing])).toEqual({
			sourceListing: saleListing,
			targetType: "RENT",
		});
	});

	it("does not reuse archived history", () => {
		expect(
			getListingCreationPrefill("property-1", [
				createListing({ status: "ARCHIVED" }),
			]),
		).toBeNull();
	});
});
