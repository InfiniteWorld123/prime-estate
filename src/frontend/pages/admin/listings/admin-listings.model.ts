import type {
	AdminListingFilters,
	AdminListingRecord,
	AdminListingSort,
} from "@/frontend/features/listings/admin-listing.types";

export const defaultAdminListingFilters: AdminListingFilters = {
	archiveOutcome: "ALL",
	city: "",
	listingType: "ALL",
	maxPrice: "",
	minPrice: "",
	search: "",
	status: "ALL",
};

const compareNullableNumbers = (
	left: number | null,
	right: number | null,
	direction: 1 | -1,
) => {
	if (left === null && right === null) return 0;
	if (left === null) return 1;
	if (right === null) return -1;
	return (left - right) * direction;
};

const compareNullableText = (
	left: string | null,
	right: string | null,
	direction: 1 | -1,
) => {
	if (left === null && right === null) return 0;
	if (left === null) return 1;
	if (right === null) return -1;
	return (
		left.localeCompare(right, undefined, { sensitivity: "base" }) * direction
	);
};

export function filterAdminListings(
	listings: AdminListingRecord[],
	filters: AdminListingFilters,
) {
	const search = filters.search.trim().toLocaleLowerCase();
	const city = filters.city.trim().toLocaleLowerCase();
	const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
	const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

	return listings.filter((listing) => {
		if (
			search &&
			!`${listing.title ?? ""} ${listing.slug ?? ""} ${listing.property.referenceNumber} ${listing.property.city} ${listing.property.streetName}`
				.toLocaleLowerCase()
				.includes(search)
		)
			return false;
		if (
			filters.listingType !== "ALL" &&
			listing.listingType !== filters.listingType
		)
			return false;
		if (filters.status !== "ALL" && listing.status !== filters.status)
			return false;
		if (
			filters.archiveOutcome !== "ALL" &&
			listing.archiveOutcome !== filters.archiveOutcome
		)
			return false;
		if (city && listing.property.city.toLocaleLowerCase() !== city)
			return false;
		if (
			minPrice !== null &&
			(listing.priceAmount === null || listing.priceAmount < minPrice)
		)
			return false;
		if (
			maxPrice !== null &&
			(listing.priceAmount === null || listing.priceAmount > maxPrice)
		)
			return false;
		return true;
	});
}

export function sortAdminListings(
	listings: AdminListingRecord[],
	sort: AdminListingSort,
) {
	return [...listings].sort((left, right) => {
		switch (sort) {
			case "oldest":
				return left.createdAt.localeCompare(right.createdAt);
			case "recently_updated":
				return right.updatedAt.localeCompare(left.updatedAt);
			case "price_asc":
				return compareNullableNumbers(left.priceAmount, right.priceAmount, 1);
			case "price_desc":
				return compareNullableNumbers(left.priceAmount, right.priceAmount, -1);
			case "published_newest":
				return compareNullableText(left.publishedAt, right.publishedAt, -1);
			case "title_asc":
				return compareNullableText(left.title, right.title, 1);
			case "title_desc":
				return compareNullableText(left.title, right.title, -1);
			default:
				return right.createdAt.localeCompare(left.createdAt);
		}
	});
}

export function paginateAdminListings(
	listings: AdminListingRecord[],
	page: number,
	pageSize: number,
) {
	const totalPages = Math.max(1, Math.ceil(listings.length / pageSize));
	const currentPage = Math.min(Math.max(page, 1), totalPages);
	const start = (currentPage - 1) * pageSize;
	return {
		currentPage,
		items: listings.slice(start, start + pageSize),
		totalItems: listings.length,
		totalPages,
	};
}
