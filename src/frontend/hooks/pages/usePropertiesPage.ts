import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ListPublicListingsQueryType } from "#/shared/types/public-listing.type";
import { usePublicFeaturesQuery } from "@/frontend/features/listings/hooks/usePublicFeaturesQuery";
import { usePublicListingsQuery } from "@/frontend/features/listings/hooks/usePublicListingsQuery";
import {
	toPropertyFeatureOption,
	toPropertySearchListing,
} from "@/frontend/features/listings/public-listing.mapper";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { Route } from "@/frontend/routes/_marketing/properties";

export type ListingIntent = "ALL" | "SALE" | "RENT";
export type PropertyTypeFilter = "ALL" | "APARTMENT" | "HOUSE";
export type PropertySort =
	| "newest"
	| "price_asc"
	| "price_desc"
	| "living_area_asc"
	| "living_area_desc";
export type PropertyResultsPreviewState =
	| "ready"
	| "error"
	| "refreshing"
	| "background-error"
	| "missing-image";
export type PropertyFilters = {
	listingType: ListingIntent;
	location: string;
	propertyType: PropertyTypeFilter;
	minPrice: string;
	maxPrice: string;
	minLivingArea: string;
	maxLivingArea: string;
	minRooms: string;
	maxRooms: string;
	minBedrooms: string;
	featureIds: string[];
};
export type PropertyFilterChip = { id: string; label: string };

const emptyFilters: PropertyFilters = {
	listingType: "ALL",
	location: "",
	propertyType: "ALL",
	minPrice: "",
	maxPrice: "",
	minLivingArea: "",
	maxLivingArea: "",
	minRooms: "",
	maxRooms: "",
	minBedrooms: "",
	featureIds: [],
};
const numeric = (value: string) => (value === "" ? undefined : Number(value));

export function usePropertiesPage() {
	const { copy, language } = useLanguage();
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/properties" });
	const appliedFilters = useMemo<PropertyFilters>(
		() => ({
			...emptyFilters,
			listingType:
				search.listingType === "SALE" || search.listingType === "RENT"
					? search.listingType
					: "ALL",
			location: search.location ?? "",
			propertyType:
				search.propertyType === "APARTMENT" || search.propertyType === "HOUSE"
					? search.propertyType
					: "ALL",
			minPrice: search.minPrice ?? "",
			maxPrice: search.maxPrice ?? "",
			minLivingArea: search.minLivingArea ?? "",
			maxLivingArea: search.maxLivingArea ?? "",
			minRooms: search.minRooms ?? "",
			maxRooms: search.maxRooms ?? "",
			minBedrooms: search.minBedrooms ?? "",
			featureIds: search.featureIds ?? [],
		}),
		[
			search.featureIds,
			search.listingType,
			search.location,
			search.maxLivingArea,
			search.maxPrice,
			search.maxRooms,
			search.minBedrooms,
			search.minLivingArea,
			search.minPrice,
			search.minRooms,
			search.propertyType,
		],
	);
	const [draftFilters, setDraftFilters] =
		useState<PropertyFilters>(appliedFilters);
	useEffect(() => {
		setDraftFilters(appliedFilters);
	}, [appliedFilters]);
	const [locationError, setLocationError] = useState("");
	const [previewState, setPreviewState] =
		useState<PropertyResultsPreviewState>("ready");
	const page = search.page ?? 1;
	const sort = (search.sort ?? "newest") as PropertySort;
	const location = appliedFilters.location.trim();
	const apiQuery: ListPublicListingsQueryType = {
		...(appliedFilters.listingType !== "ALL"
			? { listing_type: appliedFilters.listingType }
			: {}),
		...(appliedFilters.propertyType !== "ALL"
			? { property_type: appliedFilters.propertyType }
			: {}),
		...(/^\d{5}$/.test(location)
			? { postal_code: location }
			: location
				? { city: location }
				: {}),
		...(numeric(appliedFilters.minPrice) !== undefined
			? { min_price: numeric(appliedFilters.minPrice) }
			: {}),
		...(numeric(appliedFilters.maxPrice) !== undefined
			? { max_price: numeric(appliedFilters.maxPrice) }
			: {}),
		...(numeric(appliedFilters.minLivingArea) !== undefined
			? { min_living_area: numeric(appliedFilters.minLivingArea) }
			: {}),
		...(numeric(appliedFilters.maxLivingArea) !== undefined
			? { max_living_area: numeric(appliedFilters.maxLivingArea) }
			: {}),
		...(numeric(appliedFilters.minRooms) !== undefined
			? { min_rooms: numeric(appliedFilters.minRooms) }
			: {}),
		...(numeric(appliedFilters.maxRooms) !== undefined
			? { max_rooms: numeric(appliedFilters.maxRooms) }
			: {}),
		...(numeric(appliedFilters.minBedrooms) !== undefined
			? { min_bedrooms: numeric(appliedFilters.minBedrooms) }
			: {}),
		...(appliedFilters.featureIds.length
			? { feature_ids: appliedFilters.featureIds }
			: {}),
		page,
		page_size: 12,
		sort,
	};
	const listingsQuery = usePublicListingsQuery(apiQuery);
	const featuresQuery = usePublicFeaturesQuery();
	const features = useMemo(
		() => featuresQuery.data?.map(toPropertyFeatureOption) ?? [],
		[featuresQuery.data],
	);
	const baseListings = useMemo(
		() => listingsQuery.data?.items.map(toPropertySearchListing) ?? [],
		[listingsQuery.data],
	);
	const listings =
		previewState === "missing-image" && baseListings[0]
			? [
					{
						...baseListings[0],
						image: {
							...baseListings[0].image,
							src: "/images/properties/missing-preview-image.jpg",
						},
					},
					...baseListings.slice(1),
				]
			: baseListings;
	const updateDraftFilter = <Key extends keyof PropertyFilters>(
		key: Key,
		value: PropertyFilters[Key],
	) => {
		setDraftFilters((current) => ({ ...current, [key]: value }));
		if (key === "location") setLocationError("");
	};
	const writeSearch = (
		filters: PropertyFilters,
		overrides: { page?: number; sort?: PropertySort } = {},
	) => {
		void navigate({
			search: {
				...(filters.listingType !== "ALL"
					? { listingType: filters.listingType }
					: {}),
				...(filters.location ? { location: filters.location } : {}),
				...(filters.propertyType !== "ALL"
					? { propertyType: filters.propertyType }
					: {}),
				...Object.fromEntries(
					(
						[
							"minPrice",
							"maxPrice",
							"minLivingArea",
							"maxLivingArea",
							"minRooms",
							"maxRooms",
							"minBedrooms",
						] as const
					).flatMap((key) => (filters[key] ? [[key, filters[key]]] : [])),
				),
				...(filters.featureIds.length
					? { featureIds: filters.featureIds }
					: {}),
				...((overrides.page ?? 1) > 1 ? { page: overrides.page } : {}),
				...((overrides.sort ?? sort) !== "newest"
					? { sort: overrides.sort ?? sort }
					: {}),
			},
			replace: true,
		});
	};
	const applyFilters = () => {
		const nextLocation = draftFilters.location.trim();
		if (/^\d+$/.test(nextLocation) && nextLocation.length !== 5) {
			setLocationError(copy.properties.filters.postalCodeError);
			return false;
		}
		const next = { ...draftFilters, location: nextLocation };
		setDraftFilters(next);
		setLocationError("");
		writeSearch(next, { page: 1 });
		return true;
	};
	const clearFilters = () => {
		setDraftFilters(emptyFilters);
		setLocationError("");
		writeSearch(emptyFilters, { page: 1 });
	};
	const toggleFeature = (featureId: string) =>
		setDraftFilters((current) => ({
			...current,
			featureIds: current.featureIds.includes(featureId)
				? current.featureIds.filter((id) => id !== featureId)
				: [...current.featureIds, featureId],
		}));
	const chips = useMemo<PropertyFilterChip[]>(() => {
		const items: PropertyFilterChip[] = [];
		if (appliedFilters.listingType !== "ALL")
			items.push({
				id: "listingType",
				label:
					appliedFilters.listingType === "SALE"
						? copy.properties.tabs.buy
						: copy.properties.tabs.rent,
			});
		if (appliedFilters.location)
			items.push({ id: "location", label: appliedFilters.location });
		if (appliedFilters.propertyType !== "ALL")
			items.push({
				id: "propertyType",
				label:
					appliedFilters.propertyType === "HOUSE"
						? copy.property.house
						: copy.property.apartment,
			});
		for (const key of [
			"minPrice",
			"maxPrice",
			"minLivingArea",
			"maxLivingArea",
			"minRooms",
			"maxRooms",
			"minBedrooms",
		] as const)
			if (appliedFilters[key])
				items.push({
					id: key,
					label: `${copy.properties.chips[key]} ${appliedFilters[key]}`,
				});
		for (const id of appliedFilters.featureIds) {
			const feature = features.find((item) => item.id === id);
			if (feature)
				items.push({ id: `feature:${id}`, label: feature.label[language] });
		}
		return items;
	}, [appliedFilters, copy, features, language]);
	const removeChip = (chipId: string) => {
		const next = {
			...appliedFilters,
			featureIds: [...appliedFilters.featureIds],
		};
		if (chipId.startsWith("feature:"))
			next.featureIds = next.featureIds.filter((id) => id !== chipId.slice(8));
		else if (chipId === "listingType") next.listingType = "ALL";
		else if (chipId === "propertyType") next.propertyType = "ALL";
		else if (chipId in next) Object.assign(next, { [chipId]: "" });
		setDraftFilters(next);
		writeSearch(next, { page: 1 });
	};
	const headingLocation =
		appliedFilters.location || copy.properties.defaultLocation;
	const noun =
		language === "de"
			? appliedFilters.propertyType === "HOUSE"
				? "Häuser"
				: appliedFilters.propertyType === "APARTMENT"
					? "Wohnungen"
					: "Immobilien"
			: appliedFilters.propertyType === "HOUSE"
				? "Houses"
				: appliedFilters.propertyType === "APARTMENT"
					? "Apartments"
					: "Properties";
	const purpose =
		language === "de"
			? appliedFilters.listingType === "SALE"
				? " zum Kauf"
				: appliedFilters.listingType === "RENT"
					? " zur Miete"
					: ""
			: appliedFilters.listingType === "SALE"
				? " for sale"
				: appliedFilters.listingType === "RENT"
					? " for rent"
					: "";
	return {
		applyFilters,
		chips,
		clearFilters,
		currentPage: listingsQuery.data?.page ?? page,
		draftFilters,
		features,
		heading: `${noun}${purpose} in ${headingLocation}`,
		hasBackgroundError: listingsQuery.isError && Boolean(listingsQuery.data),
		isFullError:
			(listingsQuery.isError && !listingsQuery.data) ||
			previewState === "error",
		isInitialLoading: listingsQuery.isPending,
		isRefreshing:
			(listingsQuery.isFetching && !listingsQuery.isPending) ||
			previewState === "refreshing",
		listings,
		locationError,
		previewState,
		removeChip,
		retryResults: listingsQuery.refetch,
		setListingType: (listingType: ListingIntent) => {
			const next = { ...appliedFilters, listingType };
			setDraftFilters(next);
			writeSearch(next, { page: 1 });
		},
		setPage: (nextPage: number) =>
			writeSearch(appliedFilters, {
				page: Math.max(
					1,
					Math.min(nextPage, listingsQuery.data?.total_pages ?? 1),
				),
			}),
		setPreviewState,
		setSort: (nextSort: PropertySort) =>
			writeSearch(appliedFilters, { page: 1, sort: nextSort }),
		sort,
		toggleFeature,
		totalItems: listingsQuery.data?.total_items ?? 0,
		totalPages: listingsQuery.data?.total_pages ?? 1,
		updateDraftFilter,
	};
}
