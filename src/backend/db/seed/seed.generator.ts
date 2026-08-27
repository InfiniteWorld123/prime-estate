const SEED_PROPERTY_COUNT = 500;
const SEED_CONTACT_COUNT = 150;

const seedImageSources = [
	"erfurt-apartment.jpg",
	"modern-home-erfurt.jpg",
	"weimar-apartment.jpg",
	"jena-residence.jpg",
	"gotha-apartment.jpg",
	"eisenach-house.jpg",
	"gera-apartment.jpg",
] as const;

const locations = [
	{
		city: "Erfurt",
		postalCodes: ["99084", "99085", "99086", "99089", "99094"],
	},
	{ city: "Weimar", postalCodes: ["99423", "99425", "99427"] },
	{ city: "Jena", postalCodes: ["07743", "07745", "07747", "07749"] },
	{ city: "Gotha", postalCodes: ["99867"] },
	{ city: "Eisenach", postalCodes: ["99817"] },
	{ city: "Gera", postalCodes: ["07545", "07546", "07548"] },
] as const;

const streets = [
	"Anger",
	"Bahnhofstraße",
	"Bergstraße",
	"Goethestraße",
	"Johannesstraße",
	"Karlstraße",
	"Marktstraße",
	"Parkweg",
	"Schillerstraße",
	"Talstraße",
	"Theaterplatz",
	"Wacholderweg",
] as const;

const firstNames = [
	"Anna",
	"Ben",
	"Clara",
	"David",
	"Elena",
	"Felix",
	"Greta",
	"Jonas",
	"Leonie",
	"Matthias",
	"Nora",
	"Paul",
] as const;

const lastNames = [
	"Becker",
	"Fischer",
	"Hoffmann",
	"Klein",
	"Koch",
	"Krüger",
	"Neumann",
	"Richter",
	"Schmidt",
	"Schneider",
	"Wagner",
	"Weber",
] as const;

const featureDefinitions = [
	{ code: "BALCONY", name: "Balkon" },
	{ code: "BASEMENT", name: "Keller" },
	{ code: "BUILT_IN_KITCHEN", name: "Einbauküche" },
	{ code: "ELEVATOR", name: "Aufzug" },
	{ code: "FLOOR_HEATING", name: "Fußbodenheizung" },
	{ code: "FURNISHED", name: "Möbliert" },
	{ code: "GARAGE", name: "Garage" },
	{ code: "GARDEN", name: "Garten" },
	{ code: "PARKING", name: "Stellplatz" },
	{ code: "PETS_ALLOWED", name: "Haustiere erlaubt" },
	{ code: "STEP_FREE", name: "Barrierefrei" },
	{ code: "TERRACE", name: "Terrasse" },
] as const;

const apartmentTitles = [
	"Helle Wohnung mit durchdachtem Grundriss",
	"Ruhige Stadtwohnung mit Balkon",
	"Modernisierte Wohnung in zentraler Lage",
	"Großzügige Wohnung mit viel Tageslicht",
	"Gepflegte Wohnung für komfortables Wohnen",
] as const;

const houseTitles = [
	"Familienhaus mit Garten und viel Platz",
	"Freistehendes Haus in ruhiger Wohnlage",
	"Modernes Zuhause mit offenen Wohnbereichen",
	"Gepflegtes Wohnhaus mit sonniger Terrasse",
	"Geräumiges Haus für den nächsten Lebensabschnitt",
] as const;

export type SeedContact = {
	id: string;
	fullName: string;
	companyName: string | null;
	email: string;
	phone: string;
};

export type SeedFeature = {
	id: string;
	code: string;
	name: string;
};

export type SeedProperty = {
	id: string;
	referenceNumber: string;
	primaryContactId: string | null;
	propertyType: "APARTMENT" | "HOUSE";
	propertySource: "AGENCY_OWNED" | "EXTERNAL_CLIENT";
	streetName: string;
	houseNumber: string;
	unitNumber: string | null;
	postalCode: string;
	city: string;
	livingAreaM2: number;
	plotAreaM2: number | null;
	rooms: number;
	bedrooms: number;
	bathrooms: number;
	yearBuilt: number;
	floorNumber: number | null;
	totalFloors: number;
	archivedAt: Date | null;
};

export type SeedListing = {
	id: string;
	propertyId: string;
	listingType: "SALE" | "RENT";
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	archiveOutcome: "SOLD" | "RENTED" | "WITHDRAWN" | null;
	priceAmount: number | null;
	title: string | null;
	description: string | null;
	slug: string | null;
	seoTitle: string | null;
	seoDescription: string | null;
	showExactAddress: boolean;
	publishedAt: Date | null;
	archivedAt: Date | null;
};

export type SeedImage = {
	id: string;
	propertyId: string;
	storageKey: string;
	altText: string;
	sortOrder: number;
	isCover: boolean;
	sourceFile: (typeof seedImageSources)[number];
};

export type SeedPropertyFeature = {
	propertyId: string;
	featureCode: string;
};

export type SeedData = {
	contacts: SeedContact[];
	features: SeedFeature[];
	properties: SeedProperty[];
	listings: SeedListing[];
	images: SeedImage[];
	propertyFeatures: SeedPropertyFeature[];
};

const seedUuid = (namespace: number, index: number) =>
	`${namespace.toString(16).padStart(8, "0")}-0000-4000-8000-${index
		.toString()
		.padStart(12, "0")}`;

const slugify = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/ß/g, "ss")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

const createContacts = (): SeedContact[] =>
	Array.from({ length: SEED_CONTACT_COUNT }, (_, offset) => {
		const index = offset + 1;
		const firstName = firstNames[offset % firstNames.length];
		const lastName = lastNames[(offset * 5) % lastNames.length];
		return {
			id: seedUuid(0x10000000, index),
			fullName: `${firstName} ${lastName}`,
			companyName: index % 5 === 0 ? `${lastName} Immobilienbesitz` : null,
			email: `seed-contact-${index.toString().padStart(3, "0")}@example.test`,
			phone: `+49 000 ${index.toString().padStart(7, "0")}`,
		};
	});

const createFeatures = (): SeedFeature[] =>
	featureDefinitions.map((feature, offset) => ({
		id: seedUuid(0x40000000, offset + 1),
		...feature,
	}));

const createProperties = (now: Date): SeedProperty[] =>
	Array.from({ length: SEED_PROPERTY_COUNT }, (_, offset) => {
		const index = offset + 1;
		const propertyType = index % 2 === 0 ? "APARTMENT" : "HOUSE";
		const propertySource = index % 3 === 0 ? "AGENCY_OWNED" : "EXTERNAL_CLIENT";
		const location = locations[offset % locations.length];
		const postalCode =
			location.postalCodes[offset % location.postalCodes.length];
		const totalFloors = 2 + (index % 5);
		const rooms = 2 + (index % 7) * 0.5;
		const archivedAt =
			index > 460 && index <= 480
				? new Date(now.getTime() - (index - 450) * 86_400_000)
				: null;

		return {
			id: seedUuid(0x20000000, index),
			referenceNumber: `PE-${(900000 + index).toString()}`,
			primaryContactId:
				propertySource === "EXTERNAL_CLIENT"
					? seedUuid(0x10000000, (offset % SEED_CONTACT_COUNT) + 1)
					: null,
			propertyType,
			propertySource,
			streetName: streets[(offset * 7) % streets.length],
			houseNumber: `${1 + (offset % 119)}${index % 17 === 0 ? "a" : ""}`,
			unitNumber:
				propertyType === "APARTMENT" && index % 4 === 0
					? `${1 + (index % 24)}`
					: null,
			postalCode,
			city: location.city,
			livingAreaM2:
				propertyType === "HOUSE" ? 105 + (index % 115) : 42 + (index % 90),
			plotAreaM2: propertyType === "HOUSE" ? 240 + (index % 760) : null,
			rooms,
			bedrooms: Math.max(1, Math.floor(rooms) - 1),
			bathrooms: 1 + (index % 3),
			yearBuilt: 1950 + (index % 75),
			floorNumber: propertyType === "APARTMENT" ? index % totalFloors : null,
			totalFloors,
			archivedAt,
		};
	});

const listingTitle = (property: SeedProperty, index: number) => {
	const titles =
		property.propertyType === "HOUSE" ? houseTitles : apartmentTitles;
	return `${titles[index % titles.length]} in ${property.city}`;
};

const listingDescription = (
	property: SeedProperty,
	listingType: "SALE" | "RENT",
) =>
	`Diese ${property.propertyType === "HOUSE" ? "Immobilie" : "Wohnung"} in ${
		property.city
	} bietet ${property.rooms.toLocaleString("de-DE")} Zimmer auf ${
		property.livingAreaM2
	} m² Wohnfläche. Der Grundriss ist klar organisiert und eignet sich für einen komfortablen Alltag. ${
		listingType === "SALE"
			? "Das Objekt wird zum Kauf angeboten."
			: "Das Objekt wird zur langfristigen Miete angeboten."
	} Alle Angaben stammen aus lokal erzeugten Entwicklungsdaten für Prime Estate.`;

const createListings = (properties: SeedProperty[], now: Date): SeedListing[] =>
	properties.slice(0, 480).map((property, offset) => {
		const index = offset + 1;
		const listingType = index % 2 === 0 ? "RENT" : "SALE";
		const status =
			index <= 360 ? "PUBLISHED" : index <= 420 ? "DRAFT" : "ARCHIVED";
		const isIncompleteDraft = status === "DRAFT" && index % 2 === 0;
		const title = isIncompleteDraft ? null : listingTitle(property, index);
		const description = isIncompleteDraft
			? null
			: listingDescription(property, listingType);
		const publishedAt =
			status === "DRAFT"
				? null
				: new Date(now.getTime() - (481 - index) * 86_400_000);
		const archivedAt =
			status === "ARCHIVED"
				? new Date(now.getTime() - (481 - index) * 43_200_000)
				: null;
		const archiveOutcome =
			status !== "ARCHIVED"
				? null
				: index % 5 === 0
					? "WITHDRAWN"
					: listingType === "SALE"
						? "SOLD"
						: "RENTED";
		const slug = title
			? slugify(`${title}-${property.streetName}-${property.houseNumber}`)
			: null;

		return {
			id: seedUuid(0x30000000, index),
			propertyId: property.id,
			listingType,
			status,
			archiveOutcome,
			priceAmount: isIncompleteDraft
				? null
				: listingType === "SALE"
					? 165_000 + (index % 115) * 4_750
					: 620 + (index % 85) * 22,
			title,
			description,
			slug,
			seoTitle: index % 7 === 0 && title ? `${title} | Prime Estate` : null,
			seoDescription:
				index % 7 === 0 && description ? description.slice(0, 160) : null,
			showExactAddress: index % 4 === 0,
			publishedAt,
			archivedAt,
		};
	});

const createPropertyFeatures = (
	properties: SeedProperty[],
): SeedPropertyFeature[] =>
	properties.flatMap((property, propertyOffset) => {
		const featureCount = 3 + (propertyOffset % 4);
		return Array.from({ length: featureCount }, (_, featureOffset) => ({
			propertyId: property.id,
			featureCode:
				featureDefinitions[
					(propertyOffset * 3 + featureOffset) % featureDefinitions.length
				].code,
		}));
	});

const createImages = (properties: SeedProperty[]): SeedImage[] => {
	let imageIndex = 0;
	return properties.flatMap((property, propertyOffset) => {
		const imageCount = propertyOffset < 25 ? 5 : 1;
		return Array.from({ length: imageCount }, (_, sortOrder) => {
			imageIndex += 1;
			const isCover = sortOrder === 0;
			return {
				id: seedUuid(0x50000000, imageIndex),
				propertyId: property.id,
				storageKey: `prime-estate/seed/properties/${property.id}/${
					isCover ? "cover" : `gallery-${sortOrder}`
				}`,
				altText: `${isCover ? "Titelbild" : `Galeriebild ${sortOrder}`} einer Immobilie in ${property.city}`,
				sortOrder,
				isCover,
				sourceFile:
					seedImageSources[
						(propertyOffset + sortOrder) % seedImageSources.length
					],
			};
		});
	});
};

export const buildSeedData = (now = new Date()): SeedData => {
	const contacts = createContacts();
	const features = createFeatures();
	const properties = createProperties(now);
	return {
		contacts,
		features,
		properties,
		listings: createListings(properties, now),
		images: createImages(properties),
		propertyFeatures: createPropertyFeatures(properties),
	};
};

export const seedSummary = (data: SeedData) => ({
	contacts: data.contacts.length,
	properties: data.properties.length,
	features: data.features.length,
	images: data.images.length,
	coverImages: data.images.filter((image) => image.isCover).length,
	publishedListings: data.listings.filter(
		(listing) => listing.status === "PUBLISHED",
	).length,
	draftListings: data.listings.filter((listing) => listing.status === "DRAFT")
		.length,
	archivedListings: data.listings.filter(
		(listing) => listing.status === "ARCHIVED",
	).length,
	propertiesWithoutListings:
		data.properties.length -
		new Set(data.listings.map((item) => item.propertyId)).size,
});
