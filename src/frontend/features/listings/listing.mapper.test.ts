import { describe, expect, it } from "vitest";
import type { AdminListingDetailType } from "#/shared/types/listing.type";
import { toAdminListingDetailRecord } from "./listing.mapper";

const listing: AdminListingDetailType = {
	archive_outcome: null,
	archived_at: null,
	cover_image: {
		alt_text: "Front view",
		id: "image-id",
		url: "https://example.com/cover.webp",
	},
	created_at: new Date("2026-01-01T00:00:00.000Z"),
	currency_code: "EUR",
	description: "A bright apartment.",
	features: [
		{
			code: "BALCONY",
			created_at: new Date("2026-01-01T00:00:00.000Z"),
			id: "feature-id",
			name: "Balcony",
			updated_at: new Date("2026-01-01T00:00:00.000Z"),
		},
	],
	id: "listing-id",
	images: [
		{
			alt_text: "Front view",
			created_at: new Date("2026-01-01T00:00:00.000Z"),
			id: "image-id",
			is_cover: true,
			property_id: "property-id",
			sort_order: 0,
			storage_key: "properties/cover",
			updated_at: new Date("2026-01-01T00:00:00.000Z"),
			url: "https://example.com/cover.webp",
		},
	],
	listing_type: "SALE",
	price_amount: 320000,
	property: {
		city: "Erfurt",
		house_number: "12",
		id: "property-id",
		living_area_m2: 95,
		postal_code: "99084",
		property_type: "APARTMENT",
		reference_number: "PE-1001",
		rooms: 4,
		street_name: "Marktstraße",
		unit_number: "2A",
	},
	published_at: null,
	seo_description: null,
	seo_title: null,
	show_exact_address: false,
	slug: "bright-apartment-erfurt",
	status: "DRAFT",
	title: "Bright apartment in Erfurt",
	updated_at: new Date("2026-01-02T00:00:00.000Z"),
};

describe("toAdminListingDetailRecord", () => {
	it("maps listing content and Property-owned media", () => {
		const record = toAdminListingDetailRecord(listing);

		expect(record).toMatchObject({
			coverImage: "https://example.com/cover.webp",
			features: [{ id: "feature-id", name: "Balcony" }],
			images: [
				{
					altText: "Front view",
					id: "image-id",
					isCover: true,
					url: "https://example.com/cover.webp",
				},
			],
			priceAmount: 320000,
			property: { referenceNumber: "PE-1001" },
			status: "DRAFT",
		});
	});
});
