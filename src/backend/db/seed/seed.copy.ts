import type { SeedCity, SeedDistrict } from "./seed.locations";

export type Random = () => number;

export type FeatureCode =
	| "BALCONY"
	| "BASEMENT"
	| "BUILT_IN_KITCHEN"
	| "ELEVATOR"
	| "FLOOR_HEATING"
	| "FURNISHED"
	| "GARAGE"
	| "GARDEN"
	| "PARKING"
	| "PETS_ALLOWED"
	| "STEP_FREE"
	| "TERRACE";

export type BuildingEra =
	| "HISTORIC"
	| "POSTWAR"
	| "LATE_20TH"
	| "MODERN"
	| "NEW_BUILD";

export type HouseStyle =
	| "DETACHED"
	| "SEMI_DETACHED"
	| "END_TERRACE"
	| "MID_TERRACE"
	| "VILLA"
	| "BUNGALOW";

export type Orientation = "Süd" | "Südwest" | "West" | "Ost";

export type ListingCopyInput = {
	propertyType: "APARTMENT" | "HOUSE";
	listingType: "SALE" | "RENT";
	city: SeedCity;
	district: SeedDistrict;
	era: BuildingEra;
	houseStyle: HouseStyle | null;
	yearBuilt: number;
	livingAreaM2: number;
	plotAreaM2: number | null;
	rooms: number;
	bedrooms: number;
	bathrooms: number;
	floorNumber: number | null;
	totalFloors: number;
	features: ReadonlySet<FeatureCode>;
	orientation: Orientation;
	/** Service charges for rentals, Hausgeld for apartments for sale. */
	monthlyCosts: number;
	isTenanted: boolean;
};

export const DEMO_NOTICE =
	"Hinweis: Dies ist ein fiktives Demo-Inserat. Objekt, Lage und Preis sind frei erfunden und dienen ausschließlich der Präsentation von Prime Estate.";

export const pick = <T>(random: Random, values: readonly T[]): T => {
	const value = values[Math.floor(random() * values.length)];
	if (value === undefined) throw new Error("Cannot pick from an empty list");
	return value;
};

export const formatDecimal = (value: number) =>
	Number.isInteger(value)
		? value.toString()
		: value.toFixed(1).replace(".", ",");

export const formatInteger = (value: number) =>
	Math.round(value)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const numberWords = ["null", "ein", "zwei", "drei", "vier", "fünf", "sechs"];

const countWord = (value: number) => numberWords[value] ?? value.toString();

export const locationName = (
	input: Pick<ListingCopyInput, "city" | "district">,
) => `${input.city.shortName}-${input.district.name}`;

const isTopFloor = (input: ListingCopyInput) =>
	input.floorNumber !== null && input.floorNumber === input.totalFloors - 1;

const orientationPhrases: Record<Orientation, string> = {
	Süd: "ist den ganzen Tag über sonnig",
	Südwest: "ist ab dem Mittag sonnig",
	West: "lädt zu entspannten Abenden in der Sonne ein",
	Ost: "bietet am Morgen viel Sonne",
};

const apartmentHighlights: readonly (readonly [FeatureCode, string])[] = [
	["BALCONY", "Balkon"],
	["TERRACE", "Terrasse"],
	["BUILT_IN_KITCHEN", "Einbauküche"],
	["ELEVATOR", "Aufzug"],
	["FLOOR_HEATING", "Fußbodenheizung"],
	["GARDEN", "Gartenanteil"],
	["PARKING", "Stellplatz"],
];

const houseHighlights: readonly (readonly [FeatureCode, string])[] = [
	["GARDEN", "Garten"],
	["TERRACE", "Terrasse"],
	["GARAGE", "Garage"],
	["FLOOR_HEATING", "Fußbodenheizung"],
	["BASEMENT", "Vollkeller"],
];

const highlight = (
	random: Random,
	input: ListingCopyInput,
	options: readonly (readonly [FeatureCode, string])[],
	fallback: string,
) => {
	const available = options.filter(([code]) => input.features.has(code));
	return available.length > 0 ? pick(random, available)[1] : fallback;
};

const houseNames: Record<HouseStyle, string> = {
	DETACHED: "Einfamilienhaus",
	SEMI_DETACHED: "Doppelhaushälfte",
	END_TERRACE: "Reihenendhaus",
	MID_TERRACE: "Reihenmittelhaus",
	VILLA: "Stadtvilla",
	BUNGALOW: "Bungalow",
};

const houseSubjects: Record<HouseStyle, string> = {
	DETACHED: "Dieses freistehende Einfamilienhaus",
	SEMI_DETACHED: "Diese Doppelhaushälfte",
	END_TERRACE: "Dieses Reihenendhaus",
	MID_TERRACE: "Dieses Reihenmittelhaus",
	VILLA: "Diese Stadtvilla",
	BUNGALOW: "Dieser Bungalow",
};

const apartmentTitle = (random: Random, input: ListingCopyInput) => {
	const location = locationName(input);
	const rooms = formatDecimal(input.rooms);
	const feature = highlight(
		random,
		input,
		apartmentHighlights,
		"guter Anbindung",
	);

	if (input.listingType === "RENT" && input.features.has("FURNISHED")) {
		return `Möblierte ${rooms}-Zimmer-Wohnung in ${location}`;
	}
	if (input.rooms < 2) {
		return pick(random, [
			`Kompaktes ${rooms}-Zimmer-Apartment in ${location}`,
			`Gemütliches Apartment mit ${feature} in ${location}`,
		]);
	}
	if (input.floorNumber === 0 && input.features.has("GARDEN")) {
		return `Erdgeschosswohnung mit Gartenanteil in ${location}`;
	}
	if (isTopFloor(input) && input.features.has("TERRACE")) {
		return input.era === "NEW_BUILD"
			? `Penthouse mit Dachterrasse in ${location}`
			: `Dachgeschosswohnung mit Terrasse in ${location}`;
	}
	if (isTopFloor(input) && input.era === "HISTORIC") {
		return `Charmante Dachgeschosswohnung in ${location}`;
	}
	if (input.era === "NEW_BUILD") {
		return input.yearBuilt >= 2025
			? `Erstbezug: ${rooms}-Zimmer-Wohnung mit ${feature} in ${location}`
			: `Moderne ${rooms}-Zimmer-Neubauwohnung mit ${feature} in ${location}`;
	}
	if (input.era === "HISTORIC") {
		return pick(random, [
			`Sanierte Altbauwohnung mit ${feature} in ${location}`,
			`${rooms}-Zimmer-Altbauwohnung mit hohen Decken in ${location}`,
		]);
	}
	if (input.rooms >= 4) {
		return `Großzügige ${rooms}-Zimmer-Wohnung für Familien in ${location}`;
	}
	return pick(random, [
		`Helle ${rooms}-Zimmer-Wohnung mit ${feature} in ${location}`,
		`Gepflegte ${rooms}-Zimmer-Wohnung in ${location}`,
		`Ruhig gelegene ${rooms}-Zimmer-Wohnung mit ${feature} in ${location}`,
	]);
};

const houseTitle = (random: Random, input: ListingCopyInput) => {
	const location = locationName(input);
	const feature = highlight(random, input, houseHighlights, "Garten");

	switch (input.houseStyle) {
		case "VILLA":
			return input.era === "HISTORIC"
				? `Historische Stadtvilla mit großem Garten in ${location}`
				: `Moderne Stadtvilla mit ${feature} in ${location}`;
		case "BUNGALOW":
			return input.features.has("STEP_FREE")
				? `Barrierearmer Bungalow in ${location}`
				: `Bungalow mit ${feature} in ${location}`;
		case "SEMI_DETACHED":
			return `Doppelhaushälfte mit ${feature} in ${location}`;
		case "END_TERRACE":
		case "MID_TERRACE": {
			const name = houseNames[input.houseStyle];
			return pick(random, [
				`${name} mit Garten in ${location}`,
				`Gepflegtes ${name} in ${location}`,
			]);
		}
		default:
			if (input.era === "NEW_BUILD") {
				return `Neuwertiges Einfamilienhaus mit ${feature} in ${location}`;
			}
			if (input.era === "HISTORIC") {
				return `Saniertes Einfamilienhaus mit Charme in ${location}`;
			}
			return pick(random, [
				`Freistehendes Einfamilienhaus mit ${feature} in ${location}`,
				`Familienfreundliches Einfamilienhaus in ${location}`,
				`Einfamilienhaus mit ${formatInteger(input.plotAreaM2 ?? 0)} m² Grundstück in ${location}`,
			]);
	}
};

export const buildListingTitle = (random: Random, input: ListingCopyInput) =>
	input.propertyType === "HOUSE"
		? houseTitle(random, input)
		: apartmentTitle(random, input);

const decade = (year: number) => Math.floor(year / 10) * 10;

const apartmentBuilding = (random: Random, input: ListingCopyInput) => {
	switch (input.era) {
		case "HISTORIC":
			return input.yearBuilt < 1915
				? pick(random, [
						"eines sanierten Gründerzeithauses",
						`eines gepflegten Altbaus von ${input.yearBuilt}`,
					])
				: `eines gepflegten Mehrfamilienhauses aus den ${decade(input.yearBuilt)}er-Jahren`;
		case "POSTWAR":
			return `eines solide gebauten Mehrfamilienhauses aus den ${decade(input.yearBuilt)}er-Jahren`;
		case "LATE_20TH":
			return input.totalFloors >= 8
				? `eines modernisierten Wohnhochhauses aus dem Jahr ${input.yearBuilt}`
				: `eines modernisierten Mehrfamilienhauses aus dem Jahr ${input.yearBuilt}`;
		case "MODERN":
			return `eines gepflegten Mehrfamilienhauses aus dem Jahr ${input.yearBuilt}`;
		case "NEW_BUILD":
			return input.yearBuilt >= 2025
				? `eines ${input.yearBuilt} fertiggestellten Neubaus`
				: `eines modernen Neubaus aus dem Jahr ${input.yearBuilt}`;
	}
};

const apartmentFloor = (input: ListingCopyInput) => {
	if (input.floorNumber === 0) return "im Erdgeschoss";
	if (isTopFloor(input) && input.era === "HISTORIC") {
		return "im ausgebauten Dachgeschoss";
	}
	if (
		isTopFloor(input) &&
		input.era === "NEW_BUILD" &&
		input.features.has("TERRACE")
	) {
		return "im Staffelgeschoss";
	}
	return `im ${input.floorNumber}. Obergeschoss`;
};

const apartmentIntro = (random: Random, input: ListingCopyInput) => {
	const adjective =
		input.era === "NEW_BUILD"
			? "moderne"
			: input.livingAreaM2 >= 95
				? "großzügige"
				: input.livingAreaM2 < 45
					? "gemütliche"
					: pick(random, ["helle", "gepflegte", "freundliche"]);

	return `Diese ${adjective} ${formatDecimal(input.rooms)}-Zimmer-Wohnung liegt ${apartmentFloor(
		input,
	)} ${apartmentBuilding(random, input)} in ${locationName(
		input,
	)} und bietet ${formatDecimal(input.livingAreaM2)} m² Wohnfläche.`;
};

const apartmentKitchen = (input: ListingCopyInput) => {
	if (input.features.has("BUILT_IN_KITCHEN")) {
		return input.listingType === "RENT"
			? "eine moderne Einbauküche"
			: "eine hochwertige Einbauküche";
	}
	return input.era === "NEW_BUILD" || input.era === "MODERN"
		? "eine offene Küche"
		: "eine separate Küche mit Fenster";
};

const apartmentBath = (random: Random, input: ListingCopyInput) => {
	if (input.bathrooms >= 2) return "zwei Badezimmer";
	if (input.era === "NEW_BUILD") {
		return "ein modernes Duschbad mit bodengleicher Dusche";
	}
	if (input.era === "HISTORIC") return "ein saniertes Tageslichtbad mit Wanne";
	return pick(random, [
		"ein Tageslichtbad mit Wanne",
		"ein modernisiertes Bad mit Dusche",
	]);
};

const apartmentLayout = (random: Random, input: ListingCopyInput) => {
	const kitchen = apartmentKitchen(input);
	const bath = apartmentBath(random, input);
	const sentences: string[] = [];

	if (input.rooms < 2) {
		sentences.push(
			`Wohn- und Schlafbereich gehen fließend ineinander über, ${kitchen} und ${bath} ergänzen das Raumangebot.`,
		);
		if (input.rooms > 1) {
			sentences.push(
				"Eine abgetrennte Schlafnische schafft zusätzliche Privatsphäre.",
			);
		}
	} else {
		const livingRoom = pick(random, [
			"ein helles Wohnzimmer",
			"einen großzügigen Wohn- und Essbereich",
			"ein gemütliches Wohnzimmer",
		]);
		const bedrooms =
			input.bedrooms === 1
				? "ein ruhig gelegenes Schlafzimmer"
				: `${countWord(input.bedrooms)} Schlafzimmer`;
		sentences.push(
			`Der durchdachte Grundriss umfasst ${livingRoom}, ${bedrooms}, ${kitchen} und ${bath}.`,
		);
		if (!Number.isInteger(input.rooms)) {
			sentences.push(
				"Das zusätzliche halbe Zimmer eignet sich ideal als Arbeitsbereich.",
			);
		}
	}

	if (random() < 0.35) {
		sentences.push(
			"Ein Abstellraum innerhalb der Wohnung schafft zusätzlichen Stauraum.",
		);
	}

	return sentences.join(" ");
};

const apartmentCharacter = (random: Random, input: ListingCopyInput) => {
	switch (input.era) {
		case "HISTORIC":
			return pick(random, [
				"Hohe Decken, restaurierte Dielenböden und große Fenster verleihen den Räumen ihren besonderen Charakter.",
				"Stuckdecken, hohe Räume und liebevoll erhaltene Details machen den Charme dieser Altbauwohnung aus.",
			]);
		case "POSTWAR":
			return "Das Haus wurde in den vergangenen Jahren modernisiert, Fenster und Heizungsanlage entsprechen einem zeitgemäßen Standard.";
		case "LATE_20TH":
			return "Fassade, Fenster und Treppenhaus des Gebäudes wurden energetisch saniert.";
		case "MODERN":
			return "Das Gebäude ist gepflegt und befindet sich in einem guten baulichen Zustand.";
		case "NEW_BUILD":
			return "Dreifachverglasung, eine effiziente Wärmeversorgung und hochwertige Bodenbeläge sorgen für modernen Wohnkomfort.";
	}
};

const apartmentFeatures = (input: ListingCopyInput) => {
	const { features } = input;
	const sentences: string[] = [];

	if (features.has("BALCONY")) {
		sentences.push(
			`Der ${input.orientation}balkon ${orientationPhrases[input.orientation]}.`,
		);
	}
	if (features.has("TERRACE")) {
		sentences.push(
			input.floorNumber === 0
				? "Eine eigene Terrasse erweitert den Wohnraum ins Freie."
				: `Von der Dachterrasse genießen Sie einen weiten Blick über ${input.city.shortName}.`,
		);
	}
	if (features.has("GARDEN")) {
		sentences.push(
			input.floorNumber === 0
				? "Zur Wohnung gehört ein eigener Gartenanteil."
				: "Der gemeinschaftliche Garten kann mitgenutzt werden.",
		);
	}
	if (features.has("ELEVATOR")) {
		sentences.push("Ein Aufzug erschließt alle Etagen.");
	}
	if (features.has("STEP_FREE")) {
		sentences.push(
			"Die Wohnung ist stufenlos erreichbar und barrierearm gestaltet.",
		);
	}
	if (features.has("FLOOR_HEATING")) {
		sentences.push(
			"Eine Fußbodenheizung sorgt in allen Räumen für angenehme Wärme.",
		);
	}
	if (features.has("BASEMENT")) {
		sentences.push("Ein eigenes Kellerabteil bietet zusätzlichen Stauraum.");
	}
	if (features.has("GARAGE")) {
		sentences.push(
			input.era === "NEW_BUILD" || input.era === "MODERN"
				? "Ein Tiefgaragenstellplatz gehört zur Wohnung."
				: "Eine Garage gehört zur Wohnung.",
		);
	}
	if (features.has("PARKING")) {
		sentences.push(
			features.has("GARAGE")
				? "Zusätzlich steht ein Außenstellplatz zur Verfügung."
				: "Ein Pkw-Stellplatz steht zur Verfügung.",
		);
	}
	if (features.has("FURNISHED")) {
		sentences.push(
			"Die Wohnung wird voll möbliert übergeben, sodass Sie direkt einziehen können.",
		);
	}
	if (features.has("PETS_ALLOWED")) {
		sentences.push("Haustiere sind nach Absprache willkommen.");
	}

	return sentences.join(" ");
};

const houseIntro = (input: ListingCopyInput) => {
	const style = input.houseStyle ?? "DETACHED";
	const levels =
		input.totalFloors === 1
			? "einer Ebene"
			: `${countWord(input.totalFloors)} Etagen`;

	return `${houseSubjects[style]} (Baujahr ${input.yearBuilt}) steht auf einem ${formatInteger(
		input.plotAreaM2 ?? 0,
	)} m² großen Grundstück in ${locationName(
		input,
	)} und bietet auf ${levels} ${formatDecimal(input.livingAreaM2)} m² Wohnfläche.`;
};

const houseLayout = (random: Random, input: ListingCopyInput) => {
	const hasTerrace = input.features.has("TERRACE");
	const kitchen = input.features.has("BUILT_IN_KITCHEN")
		? "die Einbauküche"
		: "die Küche";
	const bath =
		input.bathrooms === 1
			? "das Familienbad mit Wanne und Dusche"
			: `${countWord(input.bathrooms)} Bäder`;
	const bedrooms = `${countWord(input.bedrooms)} Schlafzimmer`;

	if (input.totalFloors === 1) {
		return `Alle Räume liegen auf einer Ebene: ein offener Wohn- und Essbereich ${
			hasTerrace ? "mit Zugang zur Terrasse" : "mit großen Fensterflächen"
		}, ${kitchen}, ${bedrooms} und ${bath}.`;
	}

	const sentences = [
		`Im Erdgeschoss befinden sich der ${pick(random, [
			"offene",
			"großzügige",
			"lichtdurchflutete",
		])} Wohn- und Essbereich${
			hasTerrace ? " mit Zugang zur Terrasse" : ""
		}, ${kitchen} sowie ein Gäste-WC.`,
		`Im Obergeschoss liegen ${bedrooms} und ${bath}.`,
	];
	if (input.totalFloors >= 3) {
		sentences.push(
			"Das ausgebaute Dachgeschoss bietet zusätzlichen Platz für ein Arbeits- oder Gästezimmer.",
		);
	}
	return sentences.join(" ");
};

const houseCharacter = (random: Random, input: ListingCopyInput) => {
	switch (input.era) {
		case "HISTORIC":
			return `Das Haus wurde ${2008 + Math.floor(random() * 16)} umfassend modernisiert, ohne seinen historischen Charme zu verlieren.`;
		case "POSTWAR":
			return "Dach, Fenster und Heizung wurden in den vergangenen Jahren erneuert.";
		case "LATE_20TH":
			return "Das Haus wurde kontinuierlich gepflegt und befindet sich in einem guten Zustand.";
		case "MODERN":
			return "Die solide Bauweise und die durchdachte Raumaufteilung machen das Haus zu einem komfortablen Zuhause.";
		case "NEW_BUILD":
			return "Die energieeffiziente Bauweise mit Wärmepumpe hält die Heizkosten niedrig.";
	}
};

const houseFeatures = (random: Random, input: ListingCopyInput) => {
	const { features } = input;
	const sentences: string[] = [];

	if (features.has("GARDEN")) {
		sentences.push(
			input.houseStyle === "MID_TERRACE" || input.houseStyle === "END_TERRACE"
				? "Der Garten ist pflegeleicht angelegt und bietet dennoch Platz zum Spielen und Grillen."
				: pick(random, [
						"Der eingewachsene Garten bietet viel Platz für Kinder, Hobbygärtner und entspannte Sommerabende.",
						"Der gepflegte Garten mit Rasenfläche und Obstbäumen lädt zum Entspannen ein.",
					]),
		);
	}
	if (features.has("TERRACE")) {
		sentences.push(
			`Die ${input.orientation}terrasse ${orientationPhrases[input.orientation]}.`,
		);
	}
	if (features.has("BALCONY") && input.totalFloors >= 2) {
		sentences.push("Ein Balkon im Obergeschoss ergänzt die Freiflächen.");
	}
	if (features.has("BASEMENT")) {
		sentences.push(
			"Der Keller bietet Platz für Hobby-, Vorrats- und Technikräume.",
		);
	}
	if (features.has("GARAGE")) {
		sentences.push(
			`${pick(random, ["Eine Garage", "Eine Doppelgarage"])} gehört zum Haus.`,
		);
	}
	if (features.has("PARKING")) {
		sentences.push(
			features.has("GARAGE")
				? "Ein weiterer Stellplatz befindet sich direkt vor dem Haus."
				: "Ein Pkw-Stellplatz befindet sich direkt vor dem Haus.",
		);
	}
	if (features.has("FLOOR_HEATING")) {
		sentences.push(
			"Eine Fußbodenheizung sorgt in allen Wohnräumen für angenehme Wärme.",
		);
	}
	if (features.has("STEP_FREE")) {
		sentences.push(
			"Das Haus ist barrierearm gestaltet und damit auch für das Wohnen im Alter geeignet.",
		);
	}
	if (features.has("FURNISHED")) {
		sentences.push("Das Haus wird möbliert vermietet.");
	}
	if (features.has("PETS_ALLOWED")) {
		sentences.push("Haustiere sind nach Absprache willkommen.");
	}

	return sentences.join(" ");
};

const locationParagraph = (random: Random, input: ListingCopyInput) => {
	const location = locationName(input);
	const district = pick(random, [
		`${location} ist eine gefragte Wohnlage mit guter Infrastruktur.`,
		`Die Lage in ${location} verbindet ruhiges Wohnen mit kurzen Wegen.`,
		`${location} ist ein beliebtes Wohnviertel mit gewachsener Nachbarschaft.`,
	]);
	const distance = pick(random, ["fußläufig", "in wenigen Minuten"]);

	return `${district} ${input.city.locationHighlight} Supermärkte, Schulen und Kitas sind ${distance} erreichbar, die nächste ${input.city.transitStop} liegt nur wenige Gehminuten entfernt.`;
};

const termsParagraph = (random: Random, input: ListingCopyInput) => {
	const subject = input.propertyType === "HOUSE" ? "Das Haus" : "Die Wohnung";
	const closing = pick(random, [
		"Gern senden wir Ihnen weitere Unterlagen und vereinbaren einen Besichtigungstermin.",
		"Für weitere Informationen oder einen Besichtigungstermin freuen wir uns auf Ihre Anfrage.",
	]);

	if (input.listingType === "RENT") {
		const availability = pick(random, [
			"ab sofort",
			"nach Vereinbarung",
			"zum nächstmöglichen Termin",
		]);
		return `${subject} ist ${availability} bezugsfrei. Zur Nettokaltmiete kommen Nebenkosten von etwa ${formatInteger(
			input.monthlyCosts,
		)} € im Monat hinzu, die Kaution beträgt drei Nettokaltmieten. ${closing}`;
	}

	const availability = pick(random, ["ab sofort", "nach Absprache"]);
	const handover = input.isTenanted
		? `${subject} ist derzeit vermietet und eignet sich damit als Kapitalanlage.`
		: `${subject} ist ${availability} bezugsfrei.`;
	const serviceCharge =
		input.propertyType === "APARTMENT"
			? ` Das monatliche Hausgeld beträgt rund ${formatInteger(input.monthlyCosts)} €.`
			: "";

	return `${handover}${serviceCharge} ${closing}`;
};

export const buildListingDescription = (
	random: Random,
	input: ListingCopyInput,
) => {
	const paragraphs =
		input.propertyType === "HOUSE"
			? [
					`${houseIntro(input)} ${houseCharacter(random, input)}`,
					houseLayout(random, input),
					houseFeatures(random, input),
				]
			: [
					`${apartmentIntro(random, input)} ${apartmentCharacter(random, input)}`,
					apartmentLayout(random, input),
					apartmentFeatures(input),
				];

	return [
		...paragraphs,
		locationParagraph(random, input),
		termsParagraph(random, input),
		DEMO_NOTICE,
	]
		.filter((paragraph) => paragraph.trim() !== "")
		.join("\n\n");
};
