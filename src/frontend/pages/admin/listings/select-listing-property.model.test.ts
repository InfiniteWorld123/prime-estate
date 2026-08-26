import { describe, expect, it } from "vitest";

import { adminPropertyMocks } from "@/frontend/pages/admin/properties/admin-properties.mock";
import { adminListingMocks } from "./admin-listings.mock";
import {
	filterSelectableProperties,
	getListingTypeAvailability,
} from "./select-listing-property.model";

describe("listing property selection model", () => {
	it("excludes archived properties and searches by reference", () => {
		const activeProperty = adminPropertyMocks.find(
			(property) => property.archivedAt === null,
		);
		expect(activeProperty).toBeDefined();

		const result = filterSelectableProperties(
			adminPropertyMocks,
			activeProperty?.referenceNumber ?? "",
		);
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe(activeProperty?.id);
	});

	it("disables only the non-archived listing types already in use", () => {
		const existing = adminListingMocks.find(
			(listing) => listing.status !== "ARCHIVED",
		);
		expect(existing).toBeDefined();
		if (!existing) return;

		const availability = getListingTypeAvailability(
			existing.property.id,
			adminListingMocks,
		);
		expect(
			existing.listingType === "SALE" ? availability.sale : availability.rent,
		).toBe(false);
	});
});
