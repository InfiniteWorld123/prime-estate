import type { AdminPropertyRecord } from "@/frontend/features/properties/admin-property.types";

const propertySeeds = [
	{
		city: "Erfurt",
		contactCompany: "Thüringer Wohnraum GmbH",
		contactName: "Katharina Vogel",
		coverImage: "/images/properties/erfurt-apartment.jpg",
		houseNumber: "18",
		livingArea: 86,
		plotArea: null,
		postalCode: "99084",
		propertySource: "EXTERNAL_CLIENT" as const,
		propertyType: "APARTMENT" as const,
		rooms: 3,
		streetName: "Michaelisstraße",
		yearBuilt: 1908,
	},
	{
		city: "Jena",
		contactCompany: null,
		contactName: null,
		coverImage: "/images/properties/jena-residence.jpg",
		houseNumber: "7A",
		livingArea: 164,
		plotArea: 528,
		postalCode: "07743",
		propertySource: "AGENCY_OWNED" as const,
		propertyType: "HOUSE" as const,
		rooms: 6,
		streetName: "Forstweg",
		yearBuilt: 1998,
	},
	{
		city: "Weimar",
		contactCompany: null,
		contactName: "Jonas Richter",
		coverImage: "/images/properties/weimar-apartment.jpg",
		houseNumber: "24",
		livingArea: 71,
		plotArea: null,
		postalCode: "99423",
		propertySource: "EXTERNAL_CLIENT" as const,
		propertyType: "APARTMENT" as const,
		rooms: 2.5,
		streetName: "Bauhausstraße",
		yearBuilt: 1926,
	},
	{
		city: "Eisenach",
		contactCompany: null,
		contactName: null,
		coverImage: "/images/properties/eisenach-house.jpg",
		houseNumber: "11",
		livingArea: 132,
		plotArea: 690,
		postalCode: "99817",
		propertySource: "AGENCY_OWNED" as const,
		propertyType: "HOUSE" as const,
		rooms: 5,
		streetName: "Wartburgallee",
		yearBuilt: 1987,
	},
	{
		city: "Gotha",
		contactCompany: "Residenz Immobilien KG",
		contactName: "Miriam Koch",
		coverImage: "/images/properties/gotha-apartment.jpg",
		houseNumber: "33",
		livingArea: 94,
		plotArea: null,
		postalCode: "99867",
		propertySource: "EXTERNAL_CLIENT" as const,
		propertyType: "APARTMENT" as const,
		rooms: 4,
		streetName: "Augustinerstraße",
		yearBuilt: 1912,
	},
	{
		city: "Gera",
		contactCompany: null,
		contactName: "Sophie Neumann",
		coverImage: "/images/properties/gera-apartment.jpg",
		houseNumber: "9",
		livingArea: 63,
		plotArea: null,
		postalCode: "07545",
		propertySource: "EXTERNAL_CLIENT" as const,
		propertyType: "APARTMENT" as const,
		rooms: 2,
		streetName: "Sorge",
		yearBuilt: 2004,
	},
	{
		city: "Erfurt",
		contactCompany: null,
		contactName: null,
		coverImage: "/images/properties/modern-home-erfurt.jpg",
		houseNumber: "42",
		livingArea: 148,
		plotArea: 412,
		postalCode: "99092",
		propertySource: "AGENCY_OWNED" as const,
		propertyType: "HOUSE" as const,
		rooms: 5.5,
		streetName: "Cyriakstraße",
		yearBuilt: 2021,
	},
] as const;

export const adminPropertyMocks: AdminPropertyRecord[] = Array.from(
	{ length: 27 },
	(_, index) => {
		const seed = propertySeeds[index % propertySeeds.length];
		const number = index + 1;
		const isArchived = number === 6 || number === 13 || number === 21;

		return {
			...seed,
			archivedAt: isArchived
				? `2026-07-${String(24 - (index % 8)).padStart(2, "0")}T09:00:00.000Z`
				: null,
			bathrooms: seed.propertyType === "HOUSE" ? 2 : 1,
			bedrooms:
				seed.propertyType === "HOUSE"
					? 4
					: Math.max(1, Math.floor(seed.rooms - 1)),
			coverImage: number === 9 ? null : seed.coverImage,
			houseNumber: `${seed.houseNumber}${index >= propertySeeds.length ? `-${Math.floor(index / propertySeeds.length) + 1}` : ""}`,
			id: `property-${String(number).padStart(3, "0")}`,
			referenceNumber: `PE-${String(1000 + number)}`,
			unitNumber:
				seed.propertyType === "APARTMENT" ? `${(index % 4) + 1}. OG` : null,
			updatedAt: `2026-08-${String(24 - (index % 18)).padStart(2, "0")}T${String(8 + (index % 9)).padStart(2, "0")}:30:00.000Z`,
		};
	},
);
