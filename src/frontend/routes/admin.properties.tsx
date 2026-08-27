import { createFileRoute } from "@tanstack/react-router";

import type {
	AdminPropertiesSearch,
	AdminPropertyArchiveFilter,
	AdminPropertySort,
	AdminPropertySource,
	AdminPropertyType,
} from "@/frontend/features/properties/admin-property.types";
import { AdminPropertiesPage } from "@/frontend/pages/admin/properties/AdminPropertiesPage";

const archiveValues = new Set<AdminPropertyArchiveFilter>([
	"active",
	"archived",
	"all",
]);
const propertyTypeValues = new Set<AdminPropertyType>(["APARTMENT", "HOUSE"]);
const propertySourceValues = new Set<AdminPropertySource>([
	"AGENCY_OWNED",
	"EXTERNAL_CLIENT",
]);
const sortValues = new Set<AdminPropertySort>([
	"newest",
	"oldest",
	"recently_updated",
	"reference_asc",
	"reference_desc",
	"living_area_asc",
	"living_area_desc",
	"rooms_asc",
	"rooms_desc",
	"year_built_asc",
	"year_built_desc",
	"city_asc",
	"city_desc",
]);

const optionalString = (value: unknown) =>
	typeof value === "string" && value.trim() ? value.trim() : undefined;
const optionalPositiveInteger = (value: unknown) => {
	const parsed = typeof value === "number" ? value : Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

export const Route = createFileRoute("/admin/properties")({
	component: AdminPropertiesRoute,
	validateSearch: (raw: Record<string, unknown>): AdminPropertiesSearch => {
		const archive = optionalString(raw.archive) as
			| AdminPropertyArchiveFilter
			| undefined;
		const propertyType = optionalString(raw.propertyType) as
			| AdminPropertyType
			| undefined;
		const propertySource = optionalString(raw.propertySource) as
			| AdminPropertySource
			| undefined;
		const sort = optionalString(raw.sort) as AdminPropertySort | undefined;
		const pageSize = optionalPositiveInteger(raw.pageSize);

		return {
			archive:
				archive && archiveValues.has(archive) && archive !== "active"
					? archive
					: undefined,
			city: optionalString(raw.city),
			maxBathrooms: optionalString(raw.maxBathrooms),
			maxBedrooms: optionalString(raw.maxBedrooms),
			maxLivingArea: optionalString(raw.maxLivingArea),
			maxPlotArea: optionalString(raw.maxPlotArea),
			maxRooms: optionalString(raw.maxRooms),
			maxYearBuilt: optionalString(raw.maxYearBuilt),
			minBathrooms: optionalString(raw.minBathrooms),
			minBedrooms: optionalString(raw.minBedrooms),
			minLivingArea: optionalString(raw.minLivingArea),
			minPlotArea: optionalString(raw.minPlotArea),
			minRooms: optionalString(raw.minRooms),
			minYearBuilt: optionalString(raw.minYearBuilt),
			page: optionalPositiveInteger(raw.page),
			pageSize:
				pageSize === 20 || pageSize === 50 || pageSize === 100
					? pageSize
					: undefined,
			postalCode: optionalString(raw.postalCode),
			primaryContactId: optionalString(raw.primaryContactId),
			propertySource:
				propertySource && propertySourceValues.has(propertySource)
					? propertySource
					: undefined,
			propertyType:
				propertyType && propertyTypeValues.has(propertyType)
					? propertyType
					: undefined,
			search: optionalString(raw.search),
			sort:
				sort && sortValues.has(sort) && sort !== "newest" ? sort : undefined,
		};
	},
});

function AdminPropertiesRoute() {
	return <AdminPropertiesPage />;
}
