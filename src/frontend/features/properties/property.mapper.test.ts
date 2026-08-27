import { describe, expect, it } from "vitest";
import type { PropertyType } from "#/shared/types/property.type";
import { toAdminPropertyRecord } from "./property.mapper";

const property: PropertyType = {
	archived_at: null,
	bathrooms: 2,
	bedrooms: 3,
	city: "Erfurt",
	created_at: new Date("2026-01-01T00:00:00.000Z"),
	floor_number: 2,
	house_number: "12",
	id: "property-id",
	living_area_m2: 95,
	plot_area_m2: null,
	postal_code: "99084",
	primary_contact: {
		company_name: null,
		email: "owner@example.com",
		full_name: "Property Owner",
		id: "contact-id",
		phone: null,
	},
	property_source: "EXTERNAL_CLIENT",
	property_type: "APARTMENT",
	reference_number: "PE-1001",
	rooms: 4,
	street_name: "Marktstraße",
	total_floors: 5,
	unit_number: "2A",
	updated_at: new Date("2026-01-02T00:00:00.000Z"),
	year_built: 1998,
};

describe("toAdminPropertyRecord", () => {
	it("maps the backend property contract to the admin view model", () => {
		const record = toAdminPropertyRecord(property);

		expect(record).toMatchObject({
			city: "Erfurt",
			contactName: "Property Owner",
			coverImage: null,
			floorNumber: 2,
			primaryContactId: "contact-id",
			propertySource: "EXTERNAL_CLIENT",
			referenceNumber: "PE-1001",
			updatedAt: "2026-01-02T00:00:00.000Z",
		});
	});
});
