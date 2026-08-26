import type {
	AdminListingDetailRecord,
	AdminPropertyImage,
} from "@/frontend/features/listings/admin-listing.types";
import type { AdminPropertyRecord } from "@/frontend/features/properties/admin-property.types";

type DemoWorkspace = {
	featuresByProperty: Record<string, Array<{ id: string; name: string }>>;
	imagesByProperty: Record<string, AdminPropertyImage[]>;
	listings: AdminListingDetailRecord[];
	properties: AdminPropertyRecord[];
};

const workspace: DemoWorkspace = {
	featuresByProperty: {},
	imagesByProperty: {},
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
	workspace.listings = workspace.listings.map((listing) =>
		listing.property.id === propertyId ? { ...listing, features } : listing,
	);
}

export const getDemoPropertyFeatures = (propertyId: string) =>
	workspace.featuresByProperty[propertyId] ?? [];

export function setDemoPropertyImages(
	propertyId: string,
	images: AdminPropertyImage[],
) {
	workspace.imagesByProperty[propertyId] = images;
	const coverImage = images.find((image) => image.isCover)?.url ?? null;
	workspace.listings = workspace.listings.map((listing) =>
		listing.property.id === propertyId
			? { ...listing, coverImage, images }
			: listing,
	);
}

export const getDemoPropertyImages = (propertyId: string) =>
	workspace.imagesByProperty[propertyId] ?? [];

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
