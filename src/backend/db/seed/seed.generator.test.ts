import { describe, expect, it } from "vitest";
import { seedImageAssets } from "./seed.assets";
import { buildSeedData, seedSummary } from "./seed.generator";

describe("Prime Estate seed generator", () => {
	it("creates the approved deterministic distribution", () => {
		const data = buildSeedData(new Date("2026-09-28T10:00:00.000Z"));
		expect(seedSummary(data)).toEqual({
			contacts: 180,
			properties: 500,
			apartments: 324,
			houses: 176,
			features: 12,
			images: 1888,
			coverImages: 500,
			saleListings: 282,
			rentListings: 218,
			publishedListings: 460,
			draftListings: 20,
			archivedListings: 20,
		});
	});

	it("gives every property one cover, 3 to 5 images, and features", () => {
		const data = buildSeedData();
		const imageCounts = new Map<string, number>();
		for (const image of data.images) {
			imageCounts.set(
				image.propertyId,
				(imageCounts.get(image.propertyId) ?? 0) + 1,
			);
		}
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
		for (const property of data.properties) {
			expect(imageCounts.get(property.id)).toBeGreaterThanOrEqual(3);
			expect(imageCounts.get(property.id)).toBeLessThanOrEqual(5);
		}
	});

	it("reuses the shared Cloudinary assets under unique storage keys", () => {
		const data = buildSeedData();
		const publicIds = new Set(
			Object.values(seedImageAssets).map((asset) => asset.publicId),
		);
		const storageKeys = data.images.map((image) => image.storageKey);

		expect(new Set(storageKeys).size).toBe(storageKeys.length);
		for (const storageKey of storageKeys) {
			expect(publicIds.has(storageKey.replace(/^v\d+\//, ""))).toBe(true);
		}
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

	it("keeps database constraints and hides exact addresses", () => {
		const data = buildSeedData();
		for (const property of data.properties) {
			expect(property.postalCode).toMatch(/^\d{5}$/);
			expect(property.propertyType === "HOUSE").toBe(
				property.plotAreaM2 !== null,
			);
			expect(property.propertySource === "EXTERNAL_CLIENT").toBe(
				property.primaryContactId !== null,
			);
		}
		for (const listing of data.listings) {
			expect(listing.showExactAddress).toBe(false);
			expect(listing.priceAmount).toBeGreaterThan(0);
			expect(listing.description).toContain("Demo-Inserat");
		}
	});
});
