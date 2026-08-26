import { useEffect, useMemo, useState } from "react";

import type {
	AdminPropertyAdvancedFilters,
	AdminPropertyArchiveFilter,
	AdminPropertySort,
	AdminPropertyTypeFilter,
	AdminPropertyView,
} from "@/frontend/features/properties/admin-property.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { getDemoProperties } from "@/frontend/pages/admin/demo/admin-demo-workspace";
import { adminPropertiesCopy } from "@/frontend/pages/admin/properties/admin-properties.copy";

const VIEW_STORAGE_KEY = "prime-estate-admin-properties-view";

export const initialAdminPropertyFilters: AdminPropertyAdvancedFilters = {
	city: "",
	maxBathrooms: "",
	maxBedrooms: "",
	maxLivingArea: "",
	maxPlotArea: "",
	maxRooms: "",
	maxYearBuilt: "",
	minBathrooms: "",
	minBedrooms: "",
	minLivingArea: "",
	minPlotArea: "",
	minRooms: "",
	minYearBuilt: "",
	postalCode: "",
	primaryContact: "",
	propertySource: "ALL",
};

export type AdminPropertyAction = "archive" | "delete" | "restore";

const numericValue = (value: string) => (value ? Number(value) : undefined);

function matchesRange(value: number | null, minimum: string, maximum: string) {
	const min = numericValue(minimum);
	const max = numericValue(maximum);
	if (value === null) return min === undefined && max === undefined;
	return (
		(min === undefined || value >= min) && (max === undefined || value <= max)
	);
}

export function useAdminPropertiesPage() {
	const { language } = useLanguage();
	const copy = adminPropertiesCopy[language];
	const [properties, setProperties] = useState(getDemoProperties);
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [archiveStatus, setArchiveStatus] =
		useState<AdminPropertyArchiveFilter>("active");
	const [propertyType, setPropertyType] =
		useState<AdminPropertyTypeFilter>("ALL");
	const [sort, setSort] = useState<AdminPropertySort>("newest");
	const [view, setViewState] = useState<AdminPropertyView>("table");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [draftFilters, setDraftFilters] = useState(initialAdminPropertyFilters);
	const [appliedFilters, setAppliedFilters] = useState(
		initialAdminPropertyFilters,
	);
	const [filterError, setFilterError] = useState("");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [pendingAction, setPendingAction] = useState<{
		action: AdminPropertyAction;
		ids: string[];
	} | null>(null);

	useEffect(() => {
		const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
		if (storedView === "grid" || storedView === "table")
			setViewState(storedView);
		const timer = window.setTimeout(() => setIsInitialLoading(false), 500);
		return () => window.clearTimeout(timer);
	}, []);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setSearch(searchInput.trim());
			setPage(1);
			setSelectedIds([]);
		}, 300);
		return () => window.clearTimeout(timer);
	}, [searchInput]);

	const setView = (nextView: AdminPropertyView) => {
		setViewState(nextView);
		window.localStorage.setItem(VIEW_STORAGE_KEY, nextView);
	};

	const clearCollectionState = () => {
		setPage(1);
		setSelectedIds([]);
	};

	const updateArchiveStatus = (value: AdminPropertyArchiveFilter) => {
		setArchiveStatus(value);
		clearCollectionState();
	};

	const updatePropertyType = (value: AdminPropertyTypeFilter) => {
		setPropertyType(value);
		clearCollectionState();
	};

	const updateSort = (value: AdminPropertySort) => {
		setSort(value);
		clearCollectionState();
	};

	const updatePageSize = (value: number) => {
		setPageSize(value);
		clearCollectionState();
	};

	const updateDraftFilter = <Key extends keyof AdminPropertyAdvancedFilters>(
		key: Key,
		value: AdminPropertyAdvancedFilters[Key],
	) => {
		setDraftFilters((current) => ({ ...current, [key]: value }));
		setFilterError("");
	};

	const rangePairs = [
		["minLivingArea", "maxLivingArea"],
		["minPlotArea", "maxPlotArea"],
		["minRooms", "maxRooms"],
		["minBedrooms", "maxBedrooms"],
		["minBathrooms", "maxBathrooms"],
		["minYearBuilt", "maxYearBuilt"],
	] as const;

	const applyAdvancedFilters = () => {
		if (draftFilters.postalCode && !/^\d{5}$/.test(draftFilters.postalCode)) {
			setFilterError(
				language === "de"
					? "Die Postleitzahl muss fünfstellig sein."
					: "Postal code must contain five digits.",
			);
			return false;
		}

		for (const [minimumKey, maximumKey] of rangePairs) {
			const minimum = numericValue(draftFilters[minimumKey]);
			const maximum = numericValue(draftFilters[maximumKey]);
			if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
				setFilterError(
					language === "de"
						? "Ein Mindestwert darf nicht größer als der Höchstwert sein."
						: "A minimum value cannot be greater than its maximum.",
				);
				return false;
			}
		}

		setAppliedFilters({ ...draftFilters });
		setFilterError("");
		clearCollectionState();
		return true;
	};

	const resetAdvancedFilters = () => {
		setDraftFilters(initialAdminPropertyFilters);
		setAppliedFilters(initialAdminPropertyFilters);
		setFilterError("");
		clearCollectionState();
	};

	const resetAllFilters = () => {
		setSearchInput("");
		setSearch("");
		setArchiveStatus("active");
		setPropertyType("ALL");
		setDraftFilters(initialAdminPropertyFilters);
		setAppliedFilters(initialAdminPropertyFilters);
		setFilterError("");
		clearCollectionState();
	};

	const filteredProperties = useMemo(() => {
		const normalizedSearch = search.toLocaleLowerCase();
		const contactSearch = appliedFilters.primaryContact.toLocaleLowerCase();
		return properties.filter((property) => {
			const statusMatches =
				archiveStatus === "all" ||
				(archiveStatus === "active" && property.archivedAt === null) ||
				(archiveStatus === "archived" && property.archivedAt !== null);
			if (!statusMatches) return false;
			if (propertyType !== "ALL" && property.propertyType !== propertyType)
				return false;
			if (
				normalizedSearch &&
				![
					property.referenceNumber,
					property.streetName,
					property.houseNumber,
					property.city,
					property.postalCode,
					property.contactName ?? "",
					property.contactCompany ?? "",
				].some((value) => value.toLocaleLowerCase().includes(normalizedSearch))
			)
				return false;
			if (
				appliedFilters.propertySource !== "ALL" &&
				property.propertySource !== appliedFilters.propertySource
			)
				return false;
			if (
				appliedFilters.city &&
				property.city.toLocaleLowerCase() !==
					appliedFilters.city.toLocaleLowerCase()
			)
				return false;
			if (
				appliedFilters.postalCode &&
				property.postalCode !== appliedFilters.postalCode
			)
				return false;
			if (
				contactSearch &&
				!`${property.contactName ?? ""} ${property.contactCompany ?? ""}`
					.toLocaleLowerCase()
					.includes(contactSearch)
			)
				return false;
			if (
				!matchesRange(
					property.livingArea,
					appliedFilters.minLivingArea,
					appliedFilters.maxLivingArea,
				)
			)
				return false;
			if (
				!matchesRange(
					property.plotArea,
					appliedFilters.minPlotArea,
					appliedFilters.maxPlotArea,
				)
			)
				return false;
			if (
				!matchesRange(
					property.rooms,
					appliedFilters.minRooms,
					appliedFilters.maxRooms,
				)
			)
				return false;
			if (
				!matchesRange(
					property.bedrooms,
					appliedFilters.minBedrooms,
					appliedFilters.maxBedrooms,
				)
			)
				return false;
			if (
				!matchesRange(
					property.bathrooms,
					appliedFilters.minBathrooms,
					appliedFilters.maxBathrooms,
				)
			)
				return false;
			return matchesRange(
				property.yearBuilt,
				appliedFilters.minYearBuilt,
				appliedFilters.maxYearBuilt,
			);
		});
	}, [appliedFilters, archiveStatus, properties, propertyType, search]);

	const sortedProperties = useMemo(() => {
		const items = [...filteredProperties];
		const compareText = (a: string, b: string) => a.localeCompare(b, language);
		items.sort((a, b) => {
			switch (sort) {
				case "oldest":
					return compareText(a.referenceNumber, b.referenceNumber);
				case "recently_updated":
					return b.updatedAt.localeCompare(a.updatedAt);
				case "reference_asc":
					return compareText(a.referenceNumber, b.referenceNumber);
				case "reference_desc":
					return compareText(b.referenceNumber, a.referenceNumber);
				case "living_area_asc":
					return a.livingArea - b.livingArea;
				case "living_area_desc":
					return b.livingArea - a.livingArea;
				case "rooms_asc":
					return a.rooms - b.rooms;
				case "rooms_desc":
					return b.rooms - a.rooms;
				case "year_built_asc":
					return (a.yearBuilt ?? 0) - (b.yearBuilt ?? 0);
				case "year_built_desc":
					return (b.yearBuilt ?? 0) - (a.yearBuilt ?? 0);
				case "city_asc":
					return compareText(a.city, b.city);
				case "city_desc":
					return compareText(b.city, a.city);
				default:
					return compareText(b.referenceNumber, a.referenceNumber);
			}
		});
		return items;
	}, [filteredProperties, language, sort]);

	const totalPages = Math.max(1, Math.ceil(sortedProperties.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const visibleProperties = sortedProperties.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);
	const selectableIds = visibleProperties.map((property) => property.id);
	const allVisibleSelected =
		selectableIds.length > 0 &&
		selectableIds.every((id) => selectedIds.includes(id));

	const toggleSelection = (id: string) => {
		setSelectedIds((current) =>
			current.includes(id)
				? current.filter((item) => item !== id)
				: [...current, id],
		);
	};

	const toggleSelectAll = () => {
		setSelectedIds(allVisibleSelected ? [] : selectableIds);
	};

	const requestAction = (action: AdminPropertyAction, ids: string[]) =>
		setPendingAction({ action, ids });
	const confirmAction = () => {
		if (!pendingAction) return;
		setProperties((current) => {
			if (pendingAction.action === "delete")
				return current.filter(
					(property) => !pendingAction.ids.includes(property.id),
				);
			return current.map((property) =>
				pendingAction.ids.includes(property.id)
					? {
							...property,
							archivedAt:
								pendingAction.action === "archive"
									? new Date().toISOString()
									: null,
						}
					: property,
			);
		});
		setSelectedIds([]);
		setPendingAction(null);
	};

	const activeAdvancedFilterCount = Object.values(appliedFilters).filter(
		(value) => value !== "" && value !== "ALL",
	).length;

	return {
		activeAdvancedFilterCount,
		allVisibleSelected,
		applyAdvancedFilters,
		archiveStatus,
		confirmAction,
		copy,
		currentPage,
		draftFilters,
		filterError,
		isInitialLoading,
		pageSize,
		pendingAction,
		propertyType,
		requestAction,
		resetAdvancedFilters,
		resetAllFilters,
		searchInput,
		selectedIds,
		setPage: (nextPage: number) => {
			setPage(Math.min(Math.max(nextPage, 1), totalPages));
			setSelectedIds([]);
		},
		setPendingAction,
		setSearchInput,
		setView,
		sort,
		toggleSelectAll,
		toggleSelection,
		totalItems: sortedProperties.length,
		totalPages,
		updateArchiveStatus,
		updateDraftFilter,
		updatePageSize,
		updatePropertyType,
		updateSort,
		view,
		visibleProperties,
	};
}
