import { describe, expect, it } from "vitest";

import { adminListingMocks } from "./admin-listings.mock";
import {
	defaultAdminListingFilters,
	filterAdminListings,
	paginateAdminListings,
	sortAdminListings,
} from "./admin-listings.model";

describe("admin listings collection model", () => {
	it("searches listing content and property references", () => {
		const reference = adminListingMocks[0].property.referenceNumber;
		const result = filterAdminListings(adminListingMocks, {
			...defaultAdminListingFilters,
			search: reference,
		});
		expect(result.length).toBeGreaterThan(0);
		expect(
			result.every((item) => item.property.referenceNumber === reference),
		).toBe(true);
	});

	it("combines backend-supported type, status, city, and price filters", () => {
		const result = filterAdminListings(adminListingMocks, {
			...defaultAdminListingFilters,
			city: "Jena",
			listingType: "RENT",
			maxPrice: "5000",
			minPrice: "1",
			status: "PUBLISHED",
		});
		expect(result.length).toBeGreaterThan(0);
		expect(
			result.every(
				(item) =>
					item.property.city === "Jena" &&
					item.listingType === "RENT" &&
					item.status === "PUBLISHED" &&
					item.priceAmount !== null &&
					item.priceAmount <= 5_000,
			),
		).toBe(true);
	});

	it("keeps missing prices last for ascending and descending price sorts", () => {
		for (const sort of ["price_asc", "price_desc"] as const) {
			const result = sortAdminListings(adminListingMocks, sort);
			const firstMissingPrice = result.findIndex(
				(item) => item.priceAmount === null,
			);
			expect(firstMissingPrice).toBeGreaterThan(0);
			expect(
				result
					.slice(firstMissingPrice)
					.every((item) => item.priceAmount === null),
			).toBe(true);
		}
	});

	it("sorts newest listings first", () => {
		const result = sortAdminListings(adminListingMocks, "newest");
		expect(result[0].createdAt >= result[1].createdAt).toBe(true);
	});

	it("paginates and clamps an unavailable page", () => {
		const page = paginateAdminListings(adminListingMocks, 99, 20);
		expect(page.currentPage).toBe(page.totalPages);
		expect(page.items.length).toBe(adminListingMocks.length - 20);
		expect(page.totalItems).toBe(adminListingMocks.length);
	});
});
