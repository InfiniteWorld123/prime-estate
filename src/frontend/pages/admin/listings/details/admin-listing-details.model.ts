import type {
	AdminListingArchiveOutcome,
	AdminListingDetailRecord,
	AdminListingPublishBlocker,
	AdminListingType,
} from "@/frontend/features/listings/admin-listing.types";
import { getDemoListings } from "@/frontend/pages/admin/demo/admin-demo-workspace";

export function getAdminListingDetailMock(listingId: string) {
	return getDemoListings().find((item) => item.id === listingId) ?? null;
}

export function getPublishBlockers(
	listing: Pick<
		AdminListingDetailRecord,
		"coverImage" | "description" | "priceAmount" | "title"
	>,
): AdminListingPublishBlocker[] {
	const blockers: AdminListingPublishBlocker[] = [];
	if (listing.priceAmount === null || listing.priceAmount <= 0)
		blockers.push("price");
	if (!listing.title?.trim()) blockers.push("title");
	if (!listing.description?.trim()) blockers.push("description");
	if (!listing.coverImage) blockers.push("coverImage");
	return blockers;
}

export function getArchiveOutcomes(
	listingType: AdminListingType,
): AdminListingArchiveOutcome[] {
	return listingType === "SALE"
		? ["SOLD", "WITHDRAWN"]
		: ["RENTED", "WITHDRAWN"];
}

export function createFallbackSlug(title: string) {
	return title
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLocaleLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
