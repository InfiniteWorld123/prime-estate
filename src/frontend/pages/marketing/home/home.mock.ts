import type { PropertyCardListing } from "@/frontend/features/listings/listing.types";

export type HomeListing = PropertyCardListing;

export const heroListing: HomeListing = {
	id: "mock-erfurt-modern-home",
	title: {
		de: "Modernes Familienhaus mit ruhigem Garten",
		en: "Modern family home with a quiet garden",
	},
	city: "Erfurt",
	postalCode: "99094",
	price: 435000,
	rooms: 5,
	livingArea: 148,
	propertyType: "HOUSE",
	listingType: "SALE",
	image: {
		src: "/images/properties/modern-home-erfurt.jpg",
		alt: {
			de: "Modernes Familienhaus mit großen Fenstern und angelegtem Garten",
			en: "Modern family home with large windows and a landscaped garden",
		},
	},
};

export const latestListings: HomeListing[] = [
	{
		id: "mock-erfurt-apartment",
		title: {
			de: "Helle Wohnung nahe der Erfurter Innenstadt",
			en: "Bright apartment close to Erfurt city centre",
		},
		city: "Erfurt",
		postalCode: "99084",
		price: 285000,
		rooms: 3,
		livingArea: 82,
		propertyType: "APARTMENT",
		listingType: "SALE",
		image: {
			src: "/images/properties/erfurt-apartment.jpg",
			alt: {
				de: "Modernes Wohnhaus mit Balkonen",
				en: "Modern apartment building with balconies",
			},
		},
	},
	{
		id: "mock-weimar-apartment",
		title: {
			de: "Ruhige Wohnung mit lichtdurchflutetem Wohnbereich",
			en: "Calm apartment with a light-filled living space",
		},
		city: "Weimar",
		postalCode: "99423",
		price: 980,
		rooms: 2,
		livingArea: 64,
		propertyType: "APARTMENT",
		listingType: "RENT",
		image: {
			src: "/images/properties/weimar-apartment.jpg",
			alt: {
				de: "Lichtdurchflutetes Wohnzimmer einer modernen Wohnung",
				en: "Light-filled modern apartment living room",
			},
		},
	},
	{
		id: "mock-jena-residence",
		title: {
			de: "Zeitgemäßes Wohnhaus mit großzügigen Räumen",
			en: "Contemporary residence with generous rooms",
		},
		city: "Jena",
		postalCode: "07743",
		price: 520000,
		rooms: 5,
		livingArea: 156,
		propertyType: "HOUSE",
		listingType: "SALE",
		image: {
			src: "/images/properties/jena-residence.jpg",
			alt: {
				de: "Zeitgemäßes Wohngebäude mit geometrischen Balkonen",
				en: "Contemporary residential building with geometric balconies",
			},
		},
	},
	{
		id: "mock-gotha-apartment",
		title: {
			de: "Wohnliche Wohnung für einen komfortablen Alltag",
			en: "Warm apartment designed for everyday comfort",
		},
		city: "Gotha",
		postalCode: "99867",
		price: 1350,
		rooms: 4,
		livingArea: 108,
		propertyType: "APARTMENT",
		listingType: "RENT",
		image: {
			src: "/images/properties/gotha-apartment.jpg",
			alt: {
				de: "Helle Wohnung mit modernen Möbeln und natürlichem Licht",
				en: "Bright apartment with modern furniture and natural light",
			},
		},
	},
	{
		id: "mock-eisenach-house",
		title: {
			de: "Freistehendes Haus mit Garten und offenen Wohnbereichen",
			en: "Detached home with garden and open living areas",
		},
		city: "Eisenach",
		postalCode: "99817",
		price: 369000,
		rooms: 4,
		livingArea: 132,
		propertyType: "HOUSE",
		listingType: "SALE",
		image: {
			src: "/images/properties/eisenach-house.jpg",
			alt: {
				de: "Modernes freistehendes Haus mit angelegtem Garten",
				en: "Modern detached house surrounded by a landscaped garden",
			},
		},
	},
	{
		id: "mock-gera-apartment",
		title: {
			de: "Gut angebundene Wohnung in ruhiger Nachbarschaft",
			en: "Well-connected apartment in a quiet neighbourhood",
		},
		city: "Gera",
		postalCode: "07545",
		price: 1150,
		rooms: 3,
		livingArea: 88,
		propertyType: "APARTMENT",
		listingType: "RENT",
		image: {
			src: "/images/properties/gera-apartment.jpg",
			alt: {
				de: "Wohngebäude mit sonnigen Balkonen",
				en: "Residential apartment building with sunlit balconies",
			},
		},
	},
];
