export type AdminPropertyType = "APARTMENT" | "HOUSE";
export type AdminPropertySource = "AGENCY_OWNED" | "EXTERNAL_CLIENT";
export type AdminPropertyStatus = "ACTIVE" | "ARCHIVED";

export type AdminPropertyRecord = {
	archivedAt: string | null;
	bathrooms: number;
	bedrooms: number | null;
	city: string;
	contactCompany: string | null;
	contactName: string | null;
	coverImage: string | null;
	floorNumber: number | null;
	houseNumber: string;
	id: string;
	livingArea: number;
	plotArea: number | null;
	postalCode: string;
	primaryContactId: string | null;
	propertySource: AdminPropertySource;
	propertyType: AdminPropertyType;
	referenceNumber: string;
	rooms: number;
	streetName: string;
	totalFloors: number | null;
	unitNumber: string | null;
	updatedAt: string;
	yearBuilt: number | null;
};

export type AdminPropertyArchiveFilter = "active" | "archived" | "all";
export type AdminPropertyTypeFilter = "ALL" | AdminPropertyType;
export type AdminPropertyView = "table" | "grid";
export type AdminPropertySort =
	| "newest"
	| "oldest"
	| "recently_updated"
	| "reference_asc"
	| "reference_desc"
	| "living_area_asc"
	| "living_area_desc"
	| "rooms_asc"
	| "rooms_desc"
	| "year_built_asc"
	| "year_built_desc"
	| "city_asc"
	| "city_desc";

export type AdminPropertyAdvancedFilters = {
	city: string;
	maxBathrooms: string;
	maxBedrooms: string;
	maxLivingArea: string;
	maxPlotArea: string;
	maxRooms: string;
	maxYearBuilt: string;
	minBathrooms: string;
	minBedrooms: string;
	minLivingArea: string;
	minPlotArea: string;
	minRooms: string;
	minYearBuilt: string;
	postalCode: string;
	primaryContactId: string;
	propertySource: "ALL" | AdminPropertySource;
};

export type AdminPropertiesSearch = {
	archive?: AdminPropertyArchiveFilter;
	city?: string;
	maxBathrooms?: string;
	maxBedrooms?: string;
	maxLivingArea?: string;
	maxPlotArea?: string;
	maxRooms?: string;
	maxYearBuilt?: string;
	minBathrooms?: string;
	minBedrooms?: string;
	minLivingArea?: string;
	minPlotArea?: string;
	minRooms?: string;
	minYearBuilt?: string;
	page?: number;
	pageSize?: 20 | 50 | 100;
	postalCode?: string;
	primaryContactId?: string;
	propertySource?: AdminPropertySource;
	propertyType?: AdminPropertyType;
	search?: string;
	sort?: AdminPropertySort;
};
