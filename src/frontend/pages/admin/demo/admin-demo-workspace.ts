import type { AdminListingDetailRecord } from "@/frontend/features/listings/admin-listing.types";
import type { AdminPropertyRecord } from "@/frontend/features/properties/admin-property.types";

type DemoWorkspace = {
	featuresByProperty: Record<string, Array<{ id: string; name: string }>>;
	listings: AdminListingDetailRecord[];
	properties: AdminPropertyRecord[];
};

const workspace: DemoWorkspace = {
	featuresByProperty: {},
	listings: [],
	properties: [],
};

export const getDemoProperties = () => workspace.properties;
export const getDemoListings = () => workspace.listings;

export function addDemoProperty(property: AdminPropertyRecord) {
	workspace.properties = [property, ...workspace.properties];
}

export function updateDemoProperty(
	propertyId: string,
	update: Partial<AdminPropertyRecord>,
) {
	workspace.properties = workspace.properties.map((property) =>
		property.id === propertyId ? { ...property, ...update } : property,
	);
}

export function setDemoPropertyFeatures(
	propertyId: string,
	features: Array<{ id: string; name: string }>,
) {
	workspace.featuresByProperty[propertyId] = features;
}

export const getDemoPropertyFeatures = (propertyId: string) =>
	workspace.featuresByProperty[propertyId] ?? [];

export function addDemoListing(listing: AdminListingDetailRecord) {
	workspace.listings = [listing, ...workspace.listings];
}

export function updateDemoListing(listing: AdminListingDetailRecord) {
	workspace.listings = workspace.listings.map((item) =>
		item.id === listing.id ? listing : item,
	);
}

export function deleteDemoListing(listingId: string) {
	workspace.listings = workspace.listings.filter(
		(listing) => listing.id !== listingId,
	);
}
