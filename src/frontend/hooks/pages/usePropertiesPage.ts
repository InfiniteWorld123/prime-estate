import { useEffect, useMemo, useState } from "react";
import type { PropertyFeatureOption } from "@/frontend/features/listings/listing.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import {
	mockPropertyFeatures,
	mockPropertyListings,
} from "@/frontend/pages/marketing/properties/properties.mock";

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

export type PropertyFilterChip = {
	id: string;
	label: string;
};

const PAGE_SIZE = 12;

const initialFilters: PropertyFilters = {
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

const numberOrUndefined = (value: string) =>
	value === "" ? undefined : Number(value);

const matchesRange = (value: number, minimum: string, maximum?: string) => {
	const min = numberOrUndefined(minimum);
	const max = maximum === undefined ? undefined : numberOrUndefined(maximum);
	return (
		(min === undefined || value >= min) && (max === undefined || value <= max)
	);
};

export function usePropertiesPage() {
	const { copy, language } = useLanguage();
	const [draftFilters, setDraftFilters] =
		useState<PropertyFilters>(initialFilters);
	const [appliedFilters, setAppliedFilters] =
		useState<PropertyFilters>(initialFilters);
	const [sort, setSortState] = useState<PropertySort>("newest");
	const [page, setPageState] = useState(1);
	const [locationError, setLocationError] = useState("");
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [previewState, setPreviewState] =
		useState<PropertyResultsPreviewState>("ready");

	useEffect(() => {
		const loadingTimer = window.setTimeout(() => {
			setIsInitialLoading(false);
		}, 650);

		return () => window.clearTimeout(loadingTimer);
	}, []);

	const updateDraftFilter = <Key extends keyof PropertyFilters>(
		key: Key,
		value: PropertyFilters[Key],
	) => {
		setDraftFilters((current) => ({ ...current, [key]: value }));
		if (key === "location") setLocationError("");
	};

	const setListingType = (listingType: ListingIntent) => {
		setDraftFilters((current) => ({ ...current, listingType }));
		setAppliedFilters((current) => ({ ...current, listingType }));
		setPageState(1);
	};

	const toggleFeature = (featureId: string) => {
		setDraftFilters((current) => ({
			...current,
			featureIds: current.featureIds.includes(featureId)
				? current.featureIds.filter((id) => id !== featureId)
				: [...current.featureIds, featureId],
		}));
	};

	const applyFilters = () => {
		const location = draftFilters.location.trim();
		if (/^\d+$/.test(location) && location.length !== 5) {
			setLocationError(copy.properties.filters.postalCodeError);
			return false;
		}

		setLocationError("");
		setDraftFilters((current) => ({ ...current, location }));
		setAppliedFilters({ ...draftFilters, location });
		setPageState(1);
		return true;
	};

	const clearFilters = () => {
		setDraftFilters(initialFilters);
		setAppliedFilters(initialFilters);
		setLocationError("");
		setPageState(1);
	};

	const filteredListings = useMemo(() => {
		const location = appliedFilters.location.toLocaleLowerCase();
		return mockPropertyListings.filter((listing) => {
			if (
				appliedFilters.listingType !== "ALL" &&
				listing.listingType !== appliedFilters.listingType
			)
				return false;
			if (
				appliedFilters.propertyType !== "ALL" &&
				listing.propertyType !== appliedFilters.propertyType
			)
				return false;
			if (
				location &&
				listing.city.toLocaleLowerCase() !== location &&
				listing.postalCode !== location
			)
				return false;
			if (
				!matchesRange(
					listing.price,
					appliedFilters.minPrice,
					appliedFilters.maxPrice,
				)
			)
				return false;
			if (
				!matchesRange(
					listing.livingArea,
					appliedFilters.minLivingArea,
					appliedFilters.maxLivingArea,
				)
			)
				return false;
			if (
				!matchesRange(
					listing.rooms,
					appliedFilters.minRooms,
					appliedFilters.maxRooms,
				)
			)
				return false;
			if (!matchesRange(listing.bedrooms, appliedFilters.minBedrooms))
				return false;
			return appliedFilters.featureIds.every((featureId) =>
				listing.featureIds.includes(featureId),
			);
		});
	}, [appliedFilters]);

	const sortedListings = useMemo(() => {
		const items = [...filteredListings];
		if (sort === "price_asc") items.sort((a, b) => a.price - b.price);
		if (sort === "price_desc") items.sort((a, b) => b.price - a.price);
		if (sort === "living_area_asc")
			items.sort((a, b) => a.livingArea - b.livingArea);
		if (sort === "living_area_desc")
			items.sort((a, b) => b.livingArea - a.livingArea);
		return items;
	}, [filteredListings, sort]);

	const totalPages = Math.max(1, Math.ceil(sortedListings.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const pageListings = sortedListings.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	const listings = (() => {
		if (previewState !== "missing-image") {
			return pageListings;
		}

		const [firstListing, ...remainingListings] = pageListings;

		if (!firstListing) {
			return pageListings;
		}

		return [
			{
				...firstListing,
				image: {
					...firstListing.image,
					src: "/images/properties/missing-preview-image.jpg",
				},
			},
			...remainingListings,
		];
	})();

	const chips = useMemo<PropertyFilterChip[]>(() => {
		const items: PropertyFilterChip[] = [];
		const featureLabel = (feature: PropertyFeatureOption) =>
			feature.label[language];
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
		] as const) {
			if (appliedFilters[key])
				items.push({
					id: key,
					label: `${copy.properties.chips[key]} ${appliedFilters[key]}`,
				});
		}
		for (const featureId of appliedFilters.featureIds) {
			const feature = mockPropertyFeatures.find(
				(item) => item.id === featureId,
			);
			if (feature)
				items.push({
					id: `feature:${featureId}`,
					label: featureLabel(feature),
				});
		}
		return items;
	}, [appliedFilters, copy, language]);

	const removeChip = (chipId: string) => {
		let next = { ...appliedFilters };
		if (chipId.startsWith("feature:")) {
			const featureId = chipId.replace("feature:", "");
			next = {
				...next,
				featureIds: next.featureIds.filter((id) => id !== featureId),
			};
		} else if (chipId === "listingType") next.listingType = "ALL";
		else if (chipId === "propertyType") next.propertyType = "ALL";
		else if (chipId in next) {
			next = { ...next, [chipId]: "" };
		}
		setAppliedFilters(next);
		setDraftFilters(next);
		setPageState(1);
	};

	const headingLocation =
		appliedFilters.location || copy.properties.defaultLocation;
	const heading = (() => {
		const type = appliedFilters.propertyType;
		const intent = appliedFilters.listingType;
		if (language === "de") {
			const noun =
				type === "HOUSE"
					? "Häuser"
					: type === "APARTMENT"
						? "Wohnungen"
						: "Immobilien";
			const purpose =
				intent === "SALE" ? " zum Kauf" : intent === "RENT" ? " zur Miete" : "";
			return `${noun}${purpose} in ${headingLocation}`;
		}
		const noun =
			type === "HOUSE"
				? "Houses"
				: type === "APARTMENT"
					? "Apartments"
					: "Properties";
		const purpose =
			intent === "SALE" ? " for sale" : intent === "RENT" ? " for rent" : "";
		return `${noun}${purpose} in ${headingLocation}`;
	})();

	return {
		applyFilters,
		chips,
		clearFilters,
		currentPage,
		draftFilters,
		features: mockPropertyFeatures,
		heading,
		listings,
		locationError,
		removeChip,
		setListingType,
		setPage: (nextPage: number) =>
			setPageState(Math.min(Math.max(nextPage, 1), totalPages)),
		setSort: (nextSort: PropertySort) => {
			setSortState(nextSort);
			setPageState(1);
		},
		sort,
		toggleFeature,
		totalItems: sortedListings.length,
		totalPages,
		updateDraftFilter,
		isInitialLoading,
		previewState,
		retryResults: () => setPreviewState("ready"),
		setPreviewState,
	};
}
