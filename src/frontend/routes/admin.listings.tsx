import { createFileRoute } from "@tanstack/react-router";

import type {
	AdminListingArchiveOutcome,
	AdminListingSort,
	AdminListingStatus,
	AdminListingsSearch,
	AdminListingType,
} from "@/frontend/features/listings/admin-listing.types";
import { AdminListingsPage } from "@/frontend/pages/admin/listings/AdminListingsPage";

const statusValues = new Set<AdminListingStatus>([
	"ARCHIVED",
	"DRAFT",
	"PUBLISHED",
]);
const listingTypeValues = new Set<AdminListingType>(["RENT", "SALE"]);
const archiveOutcomeValues = new Set<AdminListingArchiveOutcome>([
	"RENTED",
	"SOLD",
	"WITHDRAWN",
]);
const sortValues = new Set<AdminListingSort>([
	"newest",
	"oldest",
	"recently_updated",
	"price_asc",
	"price_desc",
	"published_newest",
	"title_asc",
	"title_desc",
]);

const optionalString = (value: unknown) =>
	typeof value === "string" && value.trim() ? value.trim() : undefined;
const optionalPositiveInteger = (value: unknown) => {
	const parsed = typeof value === "number" ? value : Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};
const optionalNonNegativeNumber = (value: unknown) => {
	const stringValue = optionalString(value);
	if (!stringValue) return undefined;
	const parsed = Number(stringValue);
	return Number.isFinite(parsed) && parsed >= 0 ? String(parsed) : undefined;
};

export const Route = createFileRoute("/admin/listings")({
	component: AdminListingsPage,
	validateSearch: (raw: Record<string, unknown>): AdminListingsSearch => {
		const status = optionalString(raw.status) as AdminListingStatus | undefined;
		const listingType = optionalString(raw.listingType) as
			| AdminListingType
			| undefined;
		const archiveOutcome = optionalString(raw.archiveOutcome) as
			| AdminListingArchiveOutcome
			| undefined;
		const sort = optionalString(raw.sort) as AdminListingSort | undefined;
		const pageSize = optionalPositiveInteger(raw.pageSize);

		return {
			archiveOutcome:
				archiveOutcome && archiveOutcomeValues.has(archiveOutcome)
					? archiveOutcome
					: undefined,
			city: optionalString(raw.city),
			listingType:
				listingType && listingTypeValues.has(listingType)
					? listingType
					: undefined,
			maxPrice: optionalNonNegativeNumber(raw.maxPrice),
			minPrice: optionalNonNegativeNumber(raw.minPrice),
			page: optionalPositiveInteger(raw.page),
			pageSize:
				pageSize === 20 || pageSize === 50 || pageSize === 100
					? pageSize
					: undefined,
			search: optionalString(raw.search),
			sort:
				sort && sortValues.has(sort) && sort !== "newest" ? sort : undefined,
			status: status && statusValues.has(status) ? status : undefined,
		};
	},
});
