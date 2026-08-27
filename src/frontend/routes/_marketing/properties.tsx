import { createFileRoute } from "@tanstack/react-router";

import { PropertiesPage } from "@/frontend/pages/marketing/properties/PropertiesPage";

const optionalText = (value: unknown) =>
	typeof value === "string" && value.trim() ? value.trim() : undefined;

const propertySort = (value: unknown) =>
	value === "price_asc" ||
	value === "price_desc" ||
	value === "living_area_asc" ||
	value === "living_area_desc"
		? value
		: undefined;

export const Route = createFileRoute("/_marketing/properties")({
	component: PropertiesPage,
	validateSearch: (search: Record<string, unknown>) => ({
		...(search.listingType === "SALE" || search.listingType === "RENT"
			? { listingType: search.listingType }
			: {}),
		...(typeof search.location === "string" && search.location.trim()
			? { location: search.location.trim() }
			: {}),
		...(search.propertyType === "APARTMENT" || search.propertyType === "HOUSE"
			? { propertyType: search.propertyType }
			: {}),
		...(optionalText(search.minPrice)
			? { minPrice: optionalText(search.minPrice) }
			: {}),
		...(optionalText(search.maxPrice)
			? { maxPrice: optionalText(search.maxPrice) }
			: {}),
		...(optionalText(search.minLivingArea)
			? { minLivingArea: optionalText(search.minLivingArea) }
			: {}),
		...(optionalText(search.maxLivingArea)
			? { maxLivingArea: optionalText(search.maxLivingArea) }
			: {}),
		...(optionalText(search.minRooms)
			? { minRooms: optionalText(search.minRooms) }
			: {}),
		...(optionalText(search.maxRooms)
			? { maxRooms: optionalText(search.maxRooms) }
			: {}),
		...(optionalText(search.minBedrooms)
			? { minBedrooms: optionalText(search.minBedrooms) }
			: {}),
		...(Array.isArray(search.featureIds)
			? {
					featureIds: search.featureIds.filter(
						(value): value is string => typeof value === "string",
					),
				}
			: {}),
		...(typeof search.page === "number" && search.page > 1
			? { page: Math.floor(search.page) }
			: {}),
		...(propertySort(search.sort) ? { sort: propertySort(search.sort) } : {}),
	}),
});
