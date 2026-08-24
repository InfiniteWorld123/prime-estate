export type LocalizedText = {
	de: string;
	en: string;
};

export type PropertyCardListing = {
	id: string;
	slug: string;
	title: LocalizedText;
	city: string;
	postalCode: string;
	price: number;
	rooms: number;
	livingArea: number;
	propertyType: "HOUSE" | "APARTMENT";
	listingType: "SALE" | "RENT";
	image: {
		src: string;
		alt: LocalizedText;
	};
};

export type PropertySearchListing = PropertyCardListing & {
	bedrooms: number;
	featureIds: string[];
};

export type PropertyFeatureOption = {
	id: string;
	label: LocalizedText;
};

export type PropertyDetailImage = {
	id: string;
	src: string;
	alt: string | null;
	sortOrder: number;
	isCover: boolean;
};

export type PropertyDetailFeature = {
	id: string;
	code: string;
	name: string;
};

export type PropertyPublicAddress = {
	streetName: string | null;
	houseNumber: string | null;
	unitNumber: string | null;
	postalCode: string;
	city: string;
};

export type PropertyDetailListing = {
	slug: string;
	title: string;
	description: string;
	seoTitle: string;
	seoDescription: string;
	listingType: "SALE" | "RENT";
	price: number;
	currencyCode: "EUR";
	archiveOutcome: "SOLD" | "RENTED" | null;
	isAvailable: boolean;
	referenceNumber: string;
	propertyType: "HOUSE" | "APARTMENT";
	address: PropertyPublicAddress;
	livingArea: number;
	plotArea: number | null;
	rooms: number;
	bedrooms: number | null;
	bathrooms: number;
	yearBuilt: number | null;
	floorNumber: number | null;
	totalFloors: number | null;
	images: PropertyDetailImage[];
	features: PropertyDetailFeature[];
	publishedAt: string;
	archivedAt: string | null;
};

export type PropertyDetailsPreviewState =
	| "ready"
	| "loading"
	| "error"
	| "not-found"
	| "background-error"
	| "missing-image"
	| "all-images-missing"
	| "sold"
	| "rented";
