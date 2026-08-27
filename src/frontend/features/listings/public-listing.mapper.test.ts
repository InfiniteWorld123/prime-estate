import { describe, expect, it } from "vitest";
import type {
	PublicListingCardType,
	PublicListingDetailType,
} from "#/shared/types/public-listing.type";
import {
	toPropertyDetailListing,
	toPropertySearchListing,
} from "./public-listing.mapper";

const card: PublicListingCardType = {
	slug: "wohnung-erfurt",
	title: "Wohnung in Erfurt",
	listing_type: "SALE",
	price_amount: 250_000,
	currency_code: "EUR",
	property: {
		reference_number: "PE-1",
		property_type: "APARTMENT",
		address: {
			street_name: null,
			house_number: null,
			unit_number: null,
			postal_code: "99084",
			city: "Erfurt",
		},
		living_area_m2: 80,
		rooms: 3,
		bedrooms: 2,
	},
	cover_image: {
		id: "image-1",
		url: "https://example.com/property.jpg",
		alt_text: null,
		sort_order: 0,
		is_cover: true,
	},
	published_at: new Date("2026-01-01T00:00:00.000Z"),
};

describe("public Listing mapper", () => {
	it("maps a public card into the shared Property card model", () => {
		const result = toPropertySearchListing(card);
		expect(result.slug).toBe(card.slug);
		expect(result.title.de).toBe(card.title);
		expect(result.image.alt.en).toBe(card.title);
	});

	it("maps public detail dates and fields", () => {
		const detail: PublicListingDetailType = {
			...card,
			description: "Beschreibung",
			seo_title: "SEO",
			seo_description: "SEO Beschreibung",
			archive_outcome: null,
			is_available: true,
			property: {
				...card.property,
				plot_area_m2: null,
				bathrooms: 1,
				year_built: 2000,
				floor_number: 2,
				total_floors: 4,
			},
			images: [card.cover_image],
			features: [],
			archived_at: null,
		};
		const result = toPropertyDetailListing(detail);
		expect(result.publishedAt).toBe("2026-01-01T00:00:00.000Z");
		expect(result.referenceNumber).toBe("PE-1");
	});
});
