import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ListPropertiesQueryType } from "#/shared/types/property.type";
import { useContactsQuery } from "@/frontend/features/contacts/hooks/useContactsQuery";
import type {
	AdminPropertiesSearch,
	AdminPropertyAdvancedFilters,
	AdminPropertyArchiveFilter,
	AdminPropertySort,
	AdminPropertyTypeFilter,
	AdminPropertyView,
} from "@/frontend/features/properties/admin-property.types";
import { useAdminPropertiesQuery } from "@/frontend/features/properties/hooks/useAdminPropertiesQuery";
import {
	useArchivePropertyMutation,
	useBulkArchivePropertiesMutation,
	useDeletePropertyMutation,
	useRestorePropertyMutation,
} from "@/frontend/features/properties/hooks/usePropertyActions";
import { toAdminPropertyRecord } from "@/frontend/features/properties/property.mapper";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
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
	primaryContactId: "",
	propertySource: "ALL",
};

export type AdminPropertyAction = "archive" | "delete" | "restore";

const numericValue = (value: string) => (value ? Number(value) : undefined);
const searchValue = (value: string) => value.trim() || undefined;

const filtersFromSearch = (
	search: AdminPropertiesSearch,
): AdminPropertyAdvancedFilters => ({
	city: search.city ?? "",
	maxBathrooms: search.maxBathrooms ?? "",
	maxBedrooms: search.maxBedrooms ?? "",
	maxLivingArea: search.maxLivingArea ?? "",
	maxPlotArea: search.maxPlotArea ?? "",
	maxRooms: search.maxRooms ?? "",
	maxYearBuilt: search.maxYearBuilt ?? "",
	minBathrooms: search.minBathrooms ?? "",
	minBedrooms: search.minBedrooms ?? "",
	minLivingArea: search.minLivingArea ?? "",
	minPlotArea: search.minPlotArea ?? "",
	minRooms: search.minRooms ?? "",
	minYearBuilt: search.minYearBuilt ?? "",
	postalCode: search.postalCode ?? "",
	primaryContactId: search.primaryContactId ?? "",
	propertySource: search.propertySource ?? "ALL",
});

const toApiQuery = (
	search: AdminPropertiesSearch,
): ListPropertiesQueryType => ({
	archive_status: search.archive ?? "active",
	city: search.city,
	max_bathrooms: numericValue(search.maxBathrooms ?? ""),
	max_bedrooms: numericValue(search.maxBedrooms ?? ""),
	max_living_area: numericValue(search.maxLivingArea ?? ""),
	max_plot_area: numericValue(search.maxPlotArea ?? ""),
	max_rooms: numericValue(search.maxRooms ?? ""),
	max_year_built: numericValue(search.maxYearBuilt ?? ""),
	min_bathrooms: numericValue(search.minBathrooms ?? ""),
	min_bedrooms: numericValue(search.minBedrooms ?? ""),
	min_living_area: numericValue(search.minLivingArea ?? ""),
	min_plot_area: numericValue(search.minPlotArea ?? ""),
	min_rooms: numericValue(search.minRooms ?? ""),
	min_year_built: numericValue(search.minYearBuilt ?? ""),
	page: search.page ?? 1,
	page_size: search.pageSize ?? 20,
	postal_code: search.postalCode,
	primary_contact_id: search.primaryContactId,
	property_source: search.propertySource,
	property_type: search.propertyType,
	search: search.search,
	sort: search.sort ?? "newest",
});

export function useAdminPropertiesPage() {
	const { language } = useLanguage();
	const copy = adminPropertiesCopy[language];
	const search = useSearch({ from: "/admin/properties" });
	const navigate = useNavigate({ from: "/admin/properties" });
	const [searchInput, setSearchInput] = useState(search.search ?? "");
	const [view, setViewState] = useState<AdminPropertyView>("table");
	const [draftFilters, setDraftFilters] = useState(() =>
		filtersFromSearch(search),
	);
	const [filterError, setFilterError] = useState("");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [pendingAction, setPendingAction] = useState<{
		action: AdminPropertyAction;
		ids: string[];
	} | null>(null);

	const apiQuery = useMemo(() => toApiQuery(search), [search]);
	const propertiesQuery = useAdminPropertiesQuery(apiQuery);
	const contactsQuery = useContactsQuery("");
	const archiveMutation = useArchivePropertyMutation();
	const restoreMutation = useRestorePropertyMutation();
	const deleteMutation = useDeletePropertyMutation();
	const bulkArchiveMutation = useBulkArchivePropertiesMutation();

	useEffect(() => {
		const storedView = window.localStorage.getItem(VIEW_STORAGE_KEY);
		if (storedView === "grid" || storedView === "table")
			setViewState(storedView);
	}, []);

	useEffect(() => {
		if ((search.search ?? "") !== searchInput)
			setSearchInput(search.search ?? "");
	}, [search.search, searchInput]);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			const nextSearch = searchValue(searchInput);
			if (nextSearch === search.search) return;
			void navigate({
				replace: true,
				search: (current) => ({
					...current,
					page: undefined,
					search: nextSearch,
				}),
			});
			setSelectedIds([]);
		}, 300);
		return () => window.clearTimeout(timer);
	}, [navigate, search.search, searchInput]);

	useEffect(() => {
		setDraftFilters(filtersFromSearch(search));
		setSelectedIds([]);
	}, [search]);

	useEffect(() => {
		const totalPages = propertiesQuery.data?.total_pages;
		if (!totalPages || !search.page || search.page <= totalPages) return;
		void navigate({
			replace: true,
			search: (current) => ({ ...current, page: totalPages }),
		});
	}, [navigate, propertiesQuery.data?.total_pages, search.page]);

	const setUrlSearch = (patch: Partial<AdminPropertiesSearch>) => {
		void navigate({
			search: (current) => ({ ...current, ...patch, page: undefined }),
		});
		setSelectedIds([]);
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

		setFilterError("");
		setUrlSearch({
			city: searchValue(draftFilters.city),
			maxBathrooms: searchValue(draftFilters.maxBathrooms),
			maxBedrooms: searchValue(draftFilters.maxBedrooms),
			maxLivingArea: searchValue(draftFilters.maxLivingArea),
			maxPlotArea: searchValue(draftFilters.maxPlotArea),
			maxRooms: searchValue(draftFilters.maxRooms),
			maxYearBuilt: searchValue(draftFilters.maxYearBuilt),
			minBathrooms: searchValue(draftFilters.minBathrooms),
			minBedrooms: searchValue(draftFilters.minBedrooms),
			minLivingArea: searchValue(draftFilters.minLivingArea),
			minPlotArea: searchValue(draftFilters.minPlotArea),
			minRooms: searchValue(draftFilters.minRooms),
			minYearBuilt: searchValue(draftFilters.minYearBuilt),
			postalCode: searchValue(draftFilters.postalCode),
			primaryContactId: searchValue(draftFilters.primaryContactId),
			propertySource:
				draftFilters.propertySource === "ALL"
					? undefined
					: draftFilters.propertySource,
		});
		return true;
	};

	const resetAdvancedFilters = () => {
		setDraftFilters(initialAdminPropertyFilters);
		setFilterError("");
		setUrlSearch({
			city: undefined,
			maxBathrooms: undefined,
			maxBedrooms: undefined,
			maxLivingArea: undefined,
			maxPlotArea: undefined,
			maxRooms: undefined,
			maxYearBuilt: undefined,
			minBathrooms: undefined,
			minBedrooms: undefined,
			minLivingArea: undefined,
			minPlotArea: undefined,
			minRooms: undefined,
			minYearBuilt: undefined,
			postalCode: undefined,
			primaryContactId: undefined,
			propertySource: undefined,
		});
	};

	const resetAllFilters = () => {
		setSearchInput("");
		setDraftFilters(initialAdminPropertyFilters);
		setFilterError("");
		void navigate({ search: {} });
		setSelectedIds([]);
	};

	const visibleProperties =
		propertiesQuery.data?.items.map(toAdminPropertyRecord) ?? [];
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

	const confirmAction = async () => {
		if (!pendingAction) return;
		const { action, ids } = pendingAction;
		try {
			if (action === "archive" && ids.length > 1) {
				await bulkArchiveMutation.mutateAsync({ property_ids: ids });
			} else {
				const mutation =
					action === "archive"
						? archiveMutation
						: action === "restore"
							? restoreMutation
							: deleteMutation;
				await mutation.mutateAsync(ids[0]);
			}
			setSelectedIds([]);
			setPendingAction(null);
		} catch {
			// The active mutation exposes the server message to the dialog.
		}
	};

	const actionMutation =
		pendingAction?.action === "archive" && pendingAction.ids.length > 1
			? bulkArchiveMutation
			: pendingAction?.action === "archive"
				? archiveMutation
				: pendingAction?.action === "restore"
					? restoreMutation
					: deleteMutation;

	const activeAdvancedFilterCount = Object.values(
		filtersFromSearch(search),
	).filter((value) => value !== "" && value !== "ALL").length;

	return {
		actionError: actionMutation.error?.message ?? null,
		activeAdvancedFilterCount,
		allVisibleSelected,
		applyAdvancedFilters,
		archiveStatus: search.archive ?? "active",
		confirmAction,
		contacts:
			contactsQuery.data?.items.map((contact) => ({
				id: contact.id,
				label: contact.company_name
					? `${contact.full_name} · ${contact.company_name}`
					: contact.full_name,
			})) ?? [],
		copy,
		currentPage: propertiesQuery.data?.page ?? search.page ?? 1,
		draftFilters,
		filterError,
		isActionPending: actionMutation.isPending,
		isInitialLoading: propertiesQuery.isPending,
		isUpdating: propertiesQuery.isFetching && !propertiesQuery.isPending,
		loadError: propertiesQuery.error?.message ?? null,
		pageSize: search.pageSize ?? 20,
		pendingAction,
		propertyType: (search.propertyType ?? "ALL") as AdminPropertyTypeFilter,
		refetch: propertiesQuery.refetch,
		requestAction: (action: AdminPropertyAction, ids: string[]) => {
			actionMutation.reset();
			setPendingAction({ action, ids });
		},
		resetAdvancedFilters,
		resetAllFilters,
		searchInput,
		selectedIds,
		setPage: (page: number) =>
			setUrlSearch({ page: page <= 1 ? undefined : page }),
		setPendingAction,
		setSearchInput,
		setView: (nextView: AdminPropertyView) => {
			setViewState(nextView);
			window.localStorage.setItem(VIEW_STORAGE_KEY, nextView);
		},
		sort: search.sort ?? "newest",
		toggleSelectAll: () =>
			setSelectedIds(allVisibleSelected ? [] : selectableIds),
		toggleSelection,
		totalItems: propertiesQuery.data?.total_items ?? 0,
		totalPages: Math.max(1, propertiesQuery.data?.total_pages ?? 1),
		updateArchiveStatus: (archive: AdminPropertyArchiveFilter) =>
			setUrlSearch({ archive: archive === "active" ? undefined : archive }),
		updateDraftFilter,
		updatePageSize: (pageSize: number) =>
			setUrlSearch({
				pageSize: pageSize === 20 ? undefined : (pageSize as 50 | 100),
			}),
		updatePropertyType: (propertyType: AdminPropertyTypeFilter) =>
			setUrlSearch({
				propertyType: propertyType === "ALL" ? undefined : propertyType,
			}),
		updateSort: (sort: AdminPropertySort) =>
			setUrlSearch({ sort: sort === "newest" ? undefined : sort }),
		view,
		visibleProperties,
	};
}
