import { type SeedImageAssetKey, seedImageStorageKey } from "./seed.assets";
import {
	type BuildingEra,
	buildListingDescription,
	buildListingTitle,
	type FeatureCode,
	type HouseStyle,
	type ListingCopyInput,
	locationName,
	type Orientation,
	pick,
	type Random,
} from "./seed.copy";
import { type SeedCity, seedCities } from "./seed.locations";

const SEED_RANDOM_STATE = 20_260_928;
const SEED_CONTACT_COUNT = 180;
const SEED_DRAFT_LISTING_COUNT = 20;
const SEED_ARCHIVED_LISTING_COUNT = 20;
const DAY_MS = 86_400_000;

const featureDefinitions: readonly { code: FeatureCode; name: string }[] = [
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
];

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
	"Sophie",
	"Lukas",
	"Marie",
	"Tobias",
	"Julia",
	"Stefan",
	"Katrin",
	"Andreas",
	"Sabine",
	"Thomas",
	"Laura",
	"Florian",
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
	"Meyer",
	"Schulz",
	"Zimmermann",
	"Braun",
	"Hartmann",
	"Lange",
	"Werner",
	"Lehmann",
	"Köhler",
	"Fuchs",
	"Scholz",
	"Seidel",
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

type WeightedOptions<T> = readonly (readonly [value: T, weight: number])[];

// Everything a property needs to produce its listing copy and images.
type SeedProfile = ListingCopyInput & {
	property: SeedProperty;
};

const seedUuid = (namespace: number, index: number) =>
	`${namespace.toString(16).padStart(8, "0")}-0000-4000-8000-${index
		.toString()
		.padStart(12, "0")}`;

// Deterministic mulberry32 generator: the same seed always yields the same
// data, so rerunning the seed replaces rows instead of creating new ones.
const createRandom = (state: number): Random => {
	let current = state >>> 0;
	return () => {
		current = (current + 0x6d2b79f5) >>> 0;
		let value = current;
		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
	};
};

const between = (random: Random, minimum: number, maximum: number) =>
	minimum + (maximum - minimum) * random();

const integerBetween = (random: Random, minimum: number, maximum: number) =>
	Math.floor(between(random, minimum, maximum + 1));

const chance = (random: Random, probability: number) => random() < probability;

const weighted = <T>(random: Random, options: WeightedOptions<T>): T => {
	const total = options.reduce((sum, [, weight]) => sum + weight, 0);
	let threshold = random() * total;
	for (const [value, weight] of options) {
		threshold -= weight;
		if (threshold < 0) return value;
	}
	const last = options.at(-1);
	if (!last) throw new Error("Cannot pick from empty weighted options");
	return last[0];
};

const shuffle = <T>(random: Random, values: T[]) => {
	for (let index = values.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(random() * (index + 1));
		[values[index], values[swapIndex]] = [
			values[swapIndex] as T,
			values[index] as T,
		];
	}
	return values;
};

const roundTo = (value: number, step: number) =>
	Math.round(value / step) * step;

const roundToTenth = (value: number) => Math.round(value * 10) / 10;

const slugify = (value: string) =>
	value
		.toLowerCase()
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/ü/g, "ue")
		.replace(/ß/g, "ss")
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const transliterate = (value: string) =>
	value
		.toLowerCase()
		.replace(/ä/g, "ae")
		.replace(/ö/g, "oe")
		.replace(/ü/g, "ue")
		.replace(/ß/g, "ss");

const createContacts = (random: Random): SeedContact[] =>
	Array.from({ length: SEED_CONTACT_COUNT }, (_, offset) => {
		const index = offset + 1;
		const firstName = pick(random, firstNames);
		const lastName = pick(random, lastNames);
		const companyName =
			index % 6 === 0
				? pick(random, [
						`${lastName} Grundbesitz GmbH`,
						`${lastName} Immobilienverwaltung`,
						`Erbengemeinschaft ${lastName}`,
					])
				: null;

		return {
			id: seedUuid(0x11000000, index),
			fullName: `${firstName} ${lastName}`,
			companyName,
			email: `${transliterate(firstName)}.${transliterate(lastName)}.${index
				.toString()
				.padStart(3, "0")}@example.com`,
			phone: `+49 000 ${index.toString().padStart(7, "0")}`,
		};
	});

const createFeatures = (): SeedFeature[] =>
	featureDefinitions.map((feature, offset) => ({
		id: seedUuid(0x40000000, offset + 1),
		...feature,
	}));

const apartmentEras: WeightedOptions<BuildingEra> = [
	["HISTORIC", 30],
	["POSTWAR", 12],
	["LATE_20TH", 20],
	["MODERN", 18],
	["NEW_BUILD", 20],
];

const houseEras: WeightedOptions<BuildingEra> = [
	["HISTORIC", 15],
	["POSTWAR", 18],
	["LATE_20TH", 25],
	["MODERN", 24],
	["NEW_BUILD", 18],
];

const eraYears: Record<
	"APARTMENT" | "HOUSE",
	Record<BuildingEra, readonly [number, number]>
> = {
	APARTMENT: {
		HISTORIC: [1885, 1938],
		POSTWAR: [1950, 1969],
		LATE_20TH: [1970, 1989],
		MODERN: [1991, 2009],
		NEW_BUILD: [2012, 2026],
	},
	HOUSE: {
		HISTORIC: [1900, 1938],
		POSTWAR: [1950, 1979],
		LATE_20TH: [1980, 1999],
		MODERN: [2000, 2015],
		NEW_BUILD: [2016, 2026],
	},
};

const houseStyles = (city: SeedCity): WeightedOptions<HouseStyle> =>
	city.isMetropolitan
		? [
				["DETACHED", 30],
				["SEMI_DETACHED", 30],
				["END_TERRACE", 15],
				["MID_TERRACE", 15],
				["VILLA", 7],
				["BUNGALOW", 3],
			]
		: [
				["DETACHED", 45],
				["SEMI_DETACHED", 22],
				["END_TERRACE", 8],
				["MID_TERRACE", 7],
				["VILLA", 8],
				["BUNGALOW", 10],
			];

const houseRooms: Record<HouseStyle, WeightedOptions<number>> = {
	DETACHED: [
		[4, 20],
		[5, 35],
		[6, 28],
		[7, 12],
		[8, 5],
	],
	SEMI_DETACHED: [
		[4, 35],
		[5, 45],
		[6, 20],
	],
	END_TERRACE: [
		[4, 50],
		[5, 45],
		[6, 5],
	],
	MID_TERRACE: [
		[4, 55],
		[5, 45],
	],
	VILLA: [
		[6, 35],
		[7, 40],
		[8, 25],
	],
	BUNGALOW: [
		[3, 30],
		[4, 50],
		[5, 20],
	],
};

const housePlots: Record<HouseStyle, readonly [number, number]> = {
	DETACHED: [480, 1150],
	SEMI_DETACHED: [260, 560],
	END_TERRACE: [180, 340],
	MID_TERRACE: [140, 260],
	VILLA: [700, 1600],
	BUNGALOW: [500, 1000],
};

const pickFeatures = (
	random: Random,
	probabilities: Partial<Record<FeatureCode, number>>,
) =>
	new Set(
		featureDefinitions
			.map((feature) => feature.code)
			.filter((code) => chance(random, probabilities[code] ?? 0)),
	);

const apartmentFeatureSet = (
	random: Random,
	options: {
		era: BuildingEra;
		listingType: "SALE" | "RENT";
		rooms: number;
		floorNumber: number;
		totalFloors: number;
		isMetropolitan: boolean;
	},
) => {
	const { era, listingType, rooms, floorNumber, totalFloors } = options;
	const isRent = listingType === "RENT";
	const isGroundFloor = floorNumber === 0;
	const isTopFloor = floorNumber === totalFloors - 1;
	const elevator =
		totalFloors >= 6
			? 0.95
			: ({ HISTORIC: 0.12, POSTWAR: 0.05, LATE_20TH: 0.3, MODERN: 0.5 }[
					era as Exclude<BuildingEra, "NEW_BUILD">
				] ?? 0.9);
	const features = pickFeatures(random, {
		BALCONY: isGroundFloor
			? 0.3
			: ({ HISTORIC: 0.6, POSTWAR: 0.6, LATE_20TH: 0.75, MODERN: 0.85 }[
					era as Exclude<BuildingEra, "NEW_BUILD">
				] ?? 0.92),
		TERRACE: isGroundFloor ? 0.35 : isTopFloor && era === "NEW_BUILD" ? 0.6 : 0,
		GARDEN: isGroundFloor ? 0.4 : 0.1,
		ELEVATOR: elevator,
		BUILT_IN_KITCHEN: isRent ? 0.65 : 0.5,
		BASEMENT: era === "NEW_BUILD" ? 0.6 : 0.75,
		PARKING:
			(era === "NEW_BUILD" ? 0.5 : 0.3) * (options.isMetropolitan ? 0.6 : 1),
		GARAGE: era === "NEW_BUILD" ? 0.45 : era === "MODERN" ? 0.25 : 0.08,
		FLOOR_HEATING: era === "NEW_BUILD" ? 0.85 : era === "MODERN" ? 0.2 : 0.05,
		FURNISHED: isRent ? (rooms <= 2 ? 0.25 : 0.04) : 0,
		PETS_ALLOWED: isRent ? 0.3 : 0,
	});

	if (
		(features.has("ELEVATOR") || isGroundFloor) &&
		chance(random, era === "NEW_BUILD" ? 0.7 : 0.2)
	) {
		features.add("STEP_FREE");
	}
	if (features.size === 0) features.add("BASEMENT");

	return features;
};

const houseFeatureSet = (
	random: Random,
	options: {
		era: BuildingEra;
		style: HouseStyle;
		listingType: "SALE" | "RENT";
		totalFloors: number;
		isMetropolitan: boolean;
	},
) => {
	const { era, style, listingType, totalFloors } = options;
	const isRent = listingType === "RENT";
	const basement =
		style === "BUNGALOW"
			? 0.2
			: ({ HISTORIC: 0.85, POSTWAR: 0.85, LATE_20TH: 0.7, MODERN: 0.45 }[
					era as Exclude<BuildingEra, "NEW_BUILD">
				] ?? 0.3);

	return pickFeatures(random, {
		GARDEN: 0.97,
		TERRACE: 0.85,
		BALCONY: totalFloors >= 2 ? 0.4 : 0,
		BASEMENT: basement,
		GARAGE: options.isMetropolitan ? 0.35 : 0.55,
		PARKING: 0.7,
		BUILT_IN_KITCHEN: isRent ? 0.85 : 0.7,
		FLOOR_HEATING: era === "NEW_BUILD" ? 0.9 : era === "MODERN" ? 0.45 : 0.1,
		STEP_FREE: style === "BUNGALOW" ? 0.7 : era === "NEW_BUILD" ? 0.15 : 0.03,
		FURNISHED: isRent ? 0.05 : 0,
		PETS_ALLOWED: isRent ? 0.6 : 0,
	});
};

const salePriceFactor: Record<
	"APARTMENT" | "HOUSE",
	Record<BuildingEra, number>
> = {
	APARTMENT: {
		HISTORIC: 1.04,
		POSTWAR: 0.9,
		LATE_20TH: 0.82,
		MODERN: 0.98,
		NEW_BUILD: 1.18,
	},
	HOUSE: {
		HISTORIC: 0.95,
		POSTWAR: 0.88,
		LATE_20TH: 0.95,
		MODERN: 1.03,
		NEW_BUILD: 1.15,
	},
};

const rentPriceFactor: Record<BuildingEra, number> = {
	HISTORIC: 1.03,
	POSTWAR: 0.93,
	LATE_20TH: 0.9,
	MODERN: 1.02,
	NEW_BUILD: 1.15,
};

const houseStyleFactor: Record<HouseStyle, number> = {
	DETACHED: 1,
	SEMI_DETACHED: 0.95,
	END_TERRACE: 0.93,
	MID_TERRACE: 0.9,
	VILLA: 1.15,
	BUNGALOW: 1,
};

const featurePremium = (features: ReadonlySet<FeatureCode>) =>
	1 +
	(features.has("ELEVATOR") ? 0.02 : 0) +
	(features.has("BALCONY") || features.has("TERRACE") ? 0.02 : 0) +
	(features.has("GARAGE") ? 0.02 : 0) +
	(features.has("FLOOR_HEATING") ? 0.01 : 0);

const salePrice = (random: Random, profile: SeedProfile) => {
	const range =
		profile.city.salePerM2[
			profile.propertyType === "HOUSE" ? "house" : "apartment"
		];
	const perSquareMetre =
		between(random, range[0], range[1]) *
		salePriceFactor[profile.propertyType][profile.era] *
		(profile.houseStyle ? houseStyleFactor[profile.houseStyle] : 1) *
		featurePremium(profile.features);
	const landValue = (profile.plotAreaM2 ?? 0) * perSquareMetre * 0.03;
	const price = profile.livingAreaM2 * perSquareMetre + landValue;

	if (price >= 1_000_000) return roundTo(price, 5_000);
	// Many German asking prices end in 9.000 (e.g. 289.000 €).
	return chance(random, 0.45)
		? Math.ceil(price / 10_000) * 10_000 - 1_000
		: roundTo(price, 1_000);
};

const monthlyRent = (random: Random, profile: SeedProfile) => {
	const [minimum, maximum] = profile.city.rentPerM2;
	const perSquareMetre =
		between(random, minimum, maximum) *
		rentPriceFactor[profile.era] *
		(profile.livingAreaM2 < 45 ? 1.1 : 1) *
		(profile.features.has("FURNISHED") ? 1.25 : 1) *
		(profile.propertyType === "HOUSE" ? 1.05 : 1);
	return roundTo(profile.livingAreaM2 * perSquareMetre, 5);
};

const createApartment = (
	random: Random,
	city: SeedCity,
	listingType: "SALE" | "RENT",
) => {
	const rooms = weighted(random, [
		[1, 7],
		[1.5, 4],
		[2, 25],
		[2.5, 6],
		[3, 28],
		[3.5, 4],
		[4, 17],
		[5, 7],
		[6, 2],
	]);
	const livingAreaM2 = roundToTenth(
		rooms === 1
			? between(random, 26, 42)
			: rooms === 1.5
				? between(random, 36, 50)
				: rooms * between(random, 22, 28) + between(random, 4, 12),
	);
	const era = weighted(random, apartmentEras);
	const [firstYear, lastYear] = eraYears.APARTMENT[era];
	const yearBuilt = integerBetween(random, firstYear, lastYear);
	const totalFloors =
		era === "HISTORIC"
			? integerBetween(random, 3, 5)
			: era === "POSTWAR"
				? integerBetween(random, 3, 4)
				: era === "LATE_20TH"
					? chance(random, 0.3)
						? integerBetween(random, 8, 11)
						: integerBetween(random, 5, 6)
					: era === "MODERN"
						? integerBetween(random, 3, 5)
						: integerBetween(random, 3, 7);
	const floorNumber = integerBetween(random, 0, totalFloors - 1);
	const bathrooms = rooms >= 5 ? 2 : rooms >= 4 && chance(random, 0.5) ? 2 : 1;

	return {
		era,
		houseStyle: null,
		yearBuilt,
		livingAreaM2,
		plotAreaM2: null,
		rooms,
		bedrooms: rooms < 2 ? 0 : Math.floor(rooms) - 1,
		bathrooms,
		floorNumber,
		totalFloors,
		unitNumber: `${integerBetween(random, 1, totalFloors * 4)}`,
		features: apartmentFeatureSet(random, {
			era,
			listingType,
			rooms,
			floorNumber,
			totalFloors,
			isMetropolitan: city.isMetropolitan,
		}),
	};
};

const createHouse = (
	random: Random,
	city: SeedCity,
	listingType: "SALE" | "RENT",
) => {
	const houseStyle = weighted(random, houseStyles(city));
	const rooms = weighted(random, houseRooms[houseStyle]);
	const era =
		houseStyle === "BUNGALOW"
			? weighted(random, [
					["LATE_20TH", 40],
					["MODERN", 35],
					["NEW_BUILD", 25],
				] as const)
			: weighted(random, houseEras);
	const [firstYear, lastYear] = eraYears.HOUSE[era];
	const [minimumPlot, maximumPlot] = housePlots[houseStyle];
	const totalFloors =
		houseStyle === "BUNGALOW"
			? 1
			: houseStyle === "VILLA"
				? integerBetween(random, 2, 3)
				: chance(random, 0.22)
					? 3
					: 2;

	return {
		era,
		houseStyle,
		yearBuilt: integerBetween(random, firstYear, lastYear),
		livingAreaM2: roundToTenth(
			(rooms * between(random, 22, 29) + between(random, 8, 22)) *
				(houseStyle === "VILLA" ? 1.12 : 1),
		),
		plotAreaM2: Math.round(
			between(random, minimumPlot, maximumPlot) *
				(city.isMetropolitan ? 0.65 : 1),
		),
		rooms,
		bedrooms: Math.max(2, rooms - 2),
		bathrooms:
			rooms >= 7
				? chance(random, 0.5)
					? 3
					: 2
				: rooms >= 5
					? chance(random, 0.6)
						? 2
						: 1
					: chance(random, 0.2)
						? 2
						: 1,
		floorNumber: null,
		totalFloors,
		unitNumber: null,
		features: houseFeatureSet(random, {
			era,
			style: houseStyle,
			listingType,
			totalFloors,
			isMetropolitan: city.isMetropolitan,
		}),
	};
};

const createProfiles = (random: Random, contacts: SeedContact[]) => {
	const cityAssignments = shuffle(
		random,
		seedCities.flatMap((city) =>
			Array.from({ length: city.propertyCount }, () => city),
		),
	);

	return cityAssignments.map((city, offset): SeedProfile => {
		const index = offset + 1;
		const district = pick(random, city.districts);
		const propertyType = chance(random, city.isMetropolitan ? 0.85 : 0.62)
			? "APARTMENT"
			: "HOUSE";
		const listingType = chance(
			random,
			propertyType === "APARTMENT" ? 0.56 : 0.18,
		)
			? "RENT"
			: "SALE";
		const details =
			propertyType === "APARTMENT"
				? createApartment(random, city, listingType)
				: createHouse(random, city, listingType);
		const propertySource = chance(random, 0.35)
			? "AGENCY_OWNED"
			: "EXTERNAL_CLIENT";
		const houseNumber = `${integerBetween(random, 1, 120)}${
			chance(random, 0.1) ? pick(random, ["a", "b"]) : ""
		}`;
		const monthlyCosts =
			listingType === "RENT"
				? roundTo(details.livingAreaM2 * between(random, 2.3, 3.2), 10)
				: propertyType === "APARTMENT"
					? roundTo(details.livingAreaM2 * between(random, 3, 4.4), 5)
					: 0;

		const property: SeedProperty = {
			id: seedUuid(0x21000000, index),
			referenceNumber: `PE-8${index.toString().padStart(5, "0")}`,
			primaryContactId:
				propertySource === "EXTERNAL_CLIENT" ? pick(random, contacts).id : null,
			propertyType,
			propertySource,
			streetName: pick(random, city.streets),
			houseNumber,
			unitNumber: details.unitNumber,
			postalCode: district.postalCode,
			city: city.name,
			livingAreaM2: details.livingAreaM2,
			plotAreaM2: details.plotAreaM2,
			rooms: details.rooms,
			bedrooms: details.bedrooms,
			bathrooms: details.bathrooms,
			yearBuilt: details.yearBuilt,
			floorNumber: details.floorNumber,
			totalFloors: details.totalFloors,
			archivedAt: null,
		};

		return {
			property,
			propertyType,
			listingType,
			city,
			district,
			era: details.era,
			houseStyle: details.houseStyle,
			yearBuilt: details.yearBuilt,
			livingAreaM2: details.livingAreaM2,
			plotAreaM2: details.plotAreaM2,
			rooms: details.rooms,
			bedrooms: details.bedrooms,
			bathrooms: details.bathrooms,
			floorNumber: details.floorNumber,
			totalFloors: details.totalFloors,
			features: details.features,
			orientation: pick<Orientation>(random, ["Süd", "Südwest", "West", "Ost"]),
			monthlyCosts,
			isTenanted:
				propertyType === "APARTMENT" &&
				listingType === "SALE" &&
				chance(random, 0.25),
		};
	});
};

const createListings = (
	random: Random,
	profiles: SeedProfile[],
	now: Date,
): SeedListing[] => {
	const statusOrder = shuffle(
		random,
		profiles.map((_, offset) => offset),
	);
	const statusByOffset = new Map<number, SeedListing["status"]>();
	statusOrder.forEach((offset, position) => {
		statusByOffset.set(
			offset,
			position < SEED_DRAFT_LISTING_COUNT
				? "DRAFT"
				: position < SEED_DRAFT_LISTING_COUNT + SEED_ARCHIVED_LISTING_COUNT
					? "ARCHIVED"
					: "PUBLISHED",
		);
	});

	return profiles.map((profile, offset) => {
		const index = offset + 1;
		const status = statusByOffset.get(offset) ?? "PUBLISHED";
		const title = buildListingTitle(random, profile);
		const description = buildListingDescription(random, profile);
		const priceAmount =
			profile.listingType === "SALE"
				? salePrice(random, profile)
				: monthlyRent(random, profile);
		const publishedAt =
			status === "DRAFT"
				? null
				: new Date(
						now.getTime() -
							(status === "ARCHIVED"
								? between(random, 60, 240)
								: between(random, 0.5, 180)) *
								DAY_MS,
					);
		const archivedAt =
			status === "ARCHIVED" && publishedAt
				? new Date(publishedAt.getTime() + between(random, 14, 50) * DAY_MS)
				: null;

		return {
			id: seedUuid(0x31000000, index),
			propertyId: profile.property.id,
			listingType: profile.listingType,
			status,
			archiveOutcome:
				status === "ARCHIVED"
					? profile.listingType === "SALE"
						? "SOLD"
						: "RENTED"
					: null,
			priceAmount,
			title,
			description,
			slug: slugify(`${title} ${profile.property.referenceNumber}`),
			seoTitle: null,
			seoDescription: null,
			showExactAddress: false,
			publishedAt,
			archivedAt,
		};
	});
};

const imageSequence = (profile: SeedProfile): SeedImageAssetKey[] => {
	if (profile.propertyType === "HOUSE") {
		const cover: SeedImageAssetKey =
			profile.houseStyle === "VILLA" || profile.era === "NEW_BUILD"
				? "HOUSE_MODERN"
				: "HOUSE_GARDEN";
		return [
			cover,
			"INTERIOR_LIVING",
			"INTERIOR_KITCHEN",
			cover === "HOUSE_MODERN" ? "HOUSE_GARDEN" : "HOUSE_MODERN",
		];
	}

	const exteriors: SeedImageAssetKey[] = [
		"APARTMENT_HISTORIC",
		"APARTMENT_TOWER",
		"APARTMENT_MODERN",
	];
	const cover: SeedImageAssetKey =
		profile.era === "HISTORIC" || profile.era === "POSTWAR"
			? "APARTMENT_HISTORIC"
			: profile.era === "LATE_20TH"
				? "APARTMENT_TOWER"
				: "APARTMENT_MODERN";
	return [
		cover,
		"INTERIOR_LIVING",
		"INTERIOR_KITCHEN",
		...exteriors.filter((asset) => asset !== cover),
	];
};

const imageAltText = (
	asset: SeedImageAssetKey,
	profile: SeedProfile,
	isCover: boolean,
) => {
	const location = locationName(profile);
	if (asset === "INTERIOR_LIVING") return "Wohnbereich mit viel Tageslicht";
	if (asset === "INTERIOR_KITCHEN") return "Küche mit Essbereich";
	if (profile.propertyType === "HOUSE") {
		if (isCover) return `Außenansicht des Hauses in ${location}`;
		return asset === "HOUSE_GARDEN"
			? "Garten mit Rasenfläche"
			: "Außenbereich mit Terrasse";
	}
	return isCover
		? `Außenansicht des Wohnhauses in ${location}`
		: `Straßenansicht in der Nachbarschaft von ${location}`;
};

const createImages = (random: Random, profiles: SeedProfile[]): SeedImage[] => {
	let imageNumber = 0;

	return profiles.flatMap((profile) => {
		const sequence = imageSequence(profile);
		const imageCount =
			profile.propertyType === "HOUSE"
				? weighted(random, [
						[3, 40],
						[4, 60],
					])
				: weighted(random, [
						[3, 35],
						[4, 40],
						[5, 25],
					]);

		return sequence.slice(0, imageCount).map((asset, sortOrder) => {
			imageNumber += 1;
			const isCover = sortOrder === 0;
			return {
				id: seedUuid(0x51000000, imageNumber),
				propertyId: profile.property.id,
				storageKey: seedImageStorageKey(asset, imageNumber),
				altText: imageAltText(asset, profile, isCover),
				sortOrder,
				isCover,
			};
		});
	});
};

const createPropertyFeatures = (
	profiles: SeedProfile[],
): SeedPropertyFeature[] =>
	profiles.flatMap((profile) =>
		[...profile.features].map((featureCode) => ({
			propertyId: profile.property.id,
			featureCode,
		})),
	);

export const buildSeedData = (now = new Date()): SeedData => {
	const random = createRandom(SEED_RANDOM_STATE);
	const contacts = createContacts(random);
	const profiles = createProfiles(random, contacts);

	return {
		contacts,
		features: createFeatures(),
		properties: profiles.map((profile) => profile.property),
		listings: createListings(random, profiles, now),
		images: createImages(random, profiles),
		propertyFeatures: createPropertyFeatures(profiles),
	};
};

export const seedSummary = (data: SeedData) => {
	const countBy = <T>(items: T[], predicate: (item: T) => boolean) =>
		items.filter(predicate).length;

	return {
		contacts: data.contacts.length,
		properties: data.properties.length,
		apartments: countBy(
			data.properties,
			(property) => property.propertyType === "APARTMENT",
		),
		houses: countBy(
			data.properties,
			(property) => property.propertyType === "HOUSE",
		),
		features: data.features.length,
		images: data.images.length,
		coverImages: countBy(data.images, (image) => image.isCover),
		saleListings: countBy(
			data.listings,
			(listing) => listing.listingType === "SALE",
		),
		rentListings: countBy(
			data.listings,
			(listing) => listing.listingType === "RENT",
		),
		publishedListings: countBy(
			data.listings,
			(listing) => listing.status === "PUBLISHED",
		),
		draftListings: countBy(
			data.listings,
			(listing) => listing.status === "DRAFT",
		),
		archivedListings: countBy(
			data.listings,
			(listing) => listing.status === "ARCHIVED",
		),
	};
};
