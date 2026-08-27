import { describe, expect, it } from "vitest";
import { buildSeedData, seedSummary } from "./seed.generator";

describe("Prime Estate seed generator", () => {
	it("creates the approved deterministic distribution", () => {
		const data = buildSeedData(new Date("2026-08-27T10:00:00.000Z"));
		expect(seedSummary(data)).toEqual({
			contacts: 150,
			properties: 500,
			features: 12,
			images: 600,
			coverImages: 500,
			publishedListings: 360,
			draftListings: 60,
			archivedListings: 60,
			propertiesWithoutListings: 20,
		});
	});

	it("gives every property a cover and features", () => {
		const data = buildSeedData();
		const coveredProperties = new Set(
			data.images
				.filter((image) => image.isCover)
				.map((image) => image.propertyId),
		);
		const featuredProperties = new Set(
			data.propertyFeatures.map((item) => item.propertyId),
		);
		expect(coveredProperties.size).toBe(data.properties.length);
		expect(featuredProperties.size).toBe(data.properties.length);
	});

	it("keeps identifiers and public slugs unique", () => {
		const data = buildSeedData();
		const ids = [
			...data.contacts,
			...data.features,
			...data.properties,
			...data.listings,
			...data.images,
		].map((item) => item.id);
		const slugs = data.listings.flatMap((listing) =>
			listing.slug ? [listing.slug] : [],
		);
		expect(new Set(ids).size).toBe(ids.length);
		expect(new Set(slugs).size).toBe(slugs.length);
	});
});
