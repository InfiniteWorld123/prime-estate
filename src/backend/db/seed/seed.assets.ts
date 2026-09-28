export type SeedImageAssetKey =
	| "APARTMENT_HISTORIC"
	| "APARTMENT_TOWER"
	| "APARTMENT_MODERN"
	| "HOUSE_MODERN"
	| "HOUSE_GARDEN"
	| "INTERIOR_LIVING"
	| "INTERIOR_KITCHEN";

export type SeedImageAsset = {
	sourceFile: string;
	publicId: string;
};

// Every demo property reuses this small set of Cloudinary assets. The public
// IDs are the ones created by the first seed run and already exist in the
// production Cloudinary account.
export const seedImageAssets: Record<SeedImageAssetKey, SeedImageAsset> = {
	APARTMENT_HISTORIC: {
		sourceFile: "gera-apartment.jpg",
		publicId:
			"prime-estate/seed/properties/20000000-0000-4000-8000-000000000003/gallery-4",
	},
	APARTMENT_TOWER: {
		sourceFile: "jena-residence.jpg",
		publicId:
			"prime-estate/seed/properties/20000000-0000-4000-8000-000000000001/gallery-3",
	},
	APARTMENT_MODERN: {
		sourceFile: "erfurt-apartment.jpg",
		publicId:
			"prime-estate/seed/properties/20000000-0000-4000-8000-000000000001/cover",
	},
	HOUSE_MODERN: {
		sourceFile: "eisenach-house.jpg",
		publicId:
			"prime-estate/seed/properties/20000000-0000-4000-8000-000000000002/gallery-4",
	},
	HOUSE_GARDEN: {
		sourceFile: "modern-home-erfurt.jpg",
		publicId:
			"prime-estate/seed/properties/20000000-0000-4000-8000-000000000001/gallery-1",
	},
	INTERIOR_LIVING: {
		sourceFile: "weimar-apartment.jpg",
		publicId:
			"prime-estate/seed/properties/20000000-0000-4000-8000-000000000001/gallery-2",
	},
	INTERIOR_KITCHEN: {
		sourceFile: "gotha-apartment.jpg",
		publicId:
			"prime-estate/seed/properties/20000000-0000-4000-8000-000000000001/gallery-4",
	},
};

// `property_images.storage_key` is unique, but many demo images show the same
// asset. Cloudinary ignores the version segment of a delivery URL, so a
// `v<n>/` prefix gives every row its own key while `getStoredImageUrl` still
// delivers the shared asset. Deleting such an image in the admin area asks
// Cloudinary to destroy a public ID that does not exist ("not found"), which
// leaves the shared asset intact for every other property.
export const seedImageStorageKey = (
	asset: SeedImageAssetKey,
	imageNumber: number,
) => `v${imageNumber}/${seedImageAssets[asset].publicId}`;
