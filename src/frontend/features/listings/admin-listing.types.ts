export type AdminListingStatus = "ARCHIVED" | "DRAFT" | "PUBLISHED";
export type AdminListingType = "RENT" | "SALE";
export type AdminListingArchiveOutcome = "RENTED" | "SOLD" | "WITHDRAWN";

export type AdminPropertyImage = {
	altText: string | null;
	id: string;
	isCover: boolean;
	url: string;
};

export type AdminListingSort =
	| "newest"
	| "oldest"
	| "recently_updated"
	| "price_asc"
	| "price_desc"
	| "published_newest"
	| "title_asc"
	| "title_desc";

export type AdminListingRecord = {
	archiveOutcome: AdminListingArchiveOutcome | null;
	archivedAt: string | null;
	coverImage: string | null;
	createdAt: string;
	currencyCode: "EUR";
	id: string;
	listingType: AdminListingType;
	priceAmount: number | null;
	property: {
		city: string;
		houseNumber: string;
		id: string;
		livingArea: number;
		postalCode: string;
		propertyType: "APARTMENT" | "HOUSE";
		referenceNumber: string;
		rooms: number;
		streetName: string;
	};
	publishedAt: string | null;
	slug: string | null;
	status: AdminListingStatus;
	title: string | null;
	updatedAt: string;
};

export type AdminListingDetailRecord = AdminListingRecord & {
	description: string | null;
	features: Array<{ id: string; name: string }>;
	images: AdminPropertyImage[];
	seoDescription: string | null;
	seoTitle: string | null;
	showExactAddress: boolean;
};

export type AdminListingPublishBlocker =
	| "coverImage"
	| "description"
	| "price"
	| "title";

export type AdminListingFilters = {
	archiveOutcome: "ALL" | AdminListingArchiveOutcome;
	city: string;
	listingType: "ALL" | AdminListingType;
	maxPrice: string;
	minPrice: string;
	search: string;
	status: "ALL" | AdminListingStatus;
};

export type AdminListingsSearch = {
	archiveOutcome?: AdminListingArchiveOutcome;
	city?: string;
	listingType?: AdminListingType;
	maxPrice?: string;
	minPrice?: string;
	page?: number;
	pageSize?: 20 | 50 | 100;
	search?: string;
	sort?: AdminListingSort;
	status?: AdminListingStatus;
};
