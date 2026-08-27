import type { PropertyType } from "#/shared/types/property.type";
import type { AdminPropertyRecord } from "./admin-property.types";

const toIsoString = (value: Date | string) =>
	value instanceof Date ? value.toISOString() : value;

export function toAdminPropertyRecord(
	property: PropertyType,
): AdminPropertyRecord {
	return {
		archivedAt: property.archived_at ? toIsoString(property.archived_at) : null,
		bathrooms: property.bathrooms,
		bedrooms: property.bedrooms,
		city: property.city,
		contactCompany: property.primary_contact?.company_name ?? null,
		contactName: property.primary_contact?.full_name ?? null,
		coverImage: null,
		floorNumber: property.floor_number,
		houseNumber: property.house_number,
		id: property.id,
		livingArea: property.living_area_m2,
		plotArea: property.plot_area_m2,
		postalCode: property.postal_code,
		primaryContactId: property.primary_contact?.id ?? null,
		propertySource: property.property_source,
		propertyType: property.property_type,
		referenceNumber: property.reference_number,
		rooms: property.rooms,
		streetName: property.street_name,
		totalFloors: property.total_floors,
		unitNumber: property.unit_number,
		updatedAt: toIsoString(property.updated_at),
		yearBuilt: property.year_built,
	};
}
