import type { AdminPropertyImage } from "@/frontend/features/listings/admin-listing.types";

export const MAX_PROPERTY_IMAGES = 30;
export const MAX_PROPERTY_IMAGE_BYTES = 10 * 1024 * 1024;
export const PROPERTY_IMAGE_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
]);

export function movePropertyImage(
	images: AdminPropertyImage[],
	id: string,
	direction: -1 | 1,
) {
	const index = images.findIndex((image) => image.id === id);
	const target = index + direction;
	if (index < 0 || target < 0 || target >= images.length) return images;
	const next = [...images];
	[next[index], next[target]] = [next[target], next[index]];
	return next;
}

export function movePropertyImageTo(
	images: AdminPropertyImage[],
	sourceId: string,
	targetId: string,
) {
	if (sourceId === targetId) return images;
	const sourceIndex = images.findIndex((image) => image.id === sourceId);
	const targetIndex = images.findIndex((image) => image.id === targetId);
	if (sourceIndex < 0 || targetIndex < 0) return images;
	const next = [...images];
	const [moved] = next.splice(sourceIndex, 1);
	next.splice(targetIndex, 0, moved);
	return next;
}

export function setPropertyImageCover(
	images: AdminPropertyImage[],
	id: string,
) {
	return images.map((image) => ({ ...image, isCover: image.id === id }));
}

export function removePropertyImage(images: AdminPropertyImage[], id: string) {
	const removed = images.find((image) => image.id === id);
	const next = images.filter((image) => image.id !== id);
	if (!removed?.isCover || next.length === 0) return next;
	return next.map((image, index) => ({ ...image, isCover: index === 0 }));
}

export function createFeatureCode(name: string) {
	return name
		.trim()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLocaleUpperCase()
		.replace(/[^A-Z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");
}

export function hasFeatureName(
	features: Array<{ name: string }>,
	name: string,
) {
	const normalized = name.trim().toLocaleLowerCase();
	return features.some(
		(feature) => feature.name.trim().toLocaleLowerCase() === normalized,
	);
}
