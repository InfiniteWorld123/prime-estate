import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ListListingsQueryType } from "#/shared/types/listing.type";
import type {
	AdminListingFilters,
	AdminListingSort,
	AdminListingsSearch,
} from "@/frontend/features/listings/admin-listing.types";
import { useAdminListingsQuery } from "@/frontend/features/listings/hooks/useAdminListingsQuery";
import { toAdminListingRecord } from "@/frontend/features/listings/listing.mapper";
import { useAdminPropertiesQuery } from "@/frontend/features/properties/hooks/useAdminPropertiesQuery";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { adminListingsCopy } from "@/frontend/pages/admin/listings/admin-listings.copy";

const filtersFromSearch = (
	search: AdminListingsSearch,
): AdminListingFilters => ({
	archiveOutcome: search.archiveOutcome ?? "ALL",
	city: search.city ?? "",
	listingType: search.listingType ?? "ALL",
	maxPrice: search.maxPrice ?? "",
	minPrice: search.minPrice ?? "",
	search: search.search ?? "",
	status: search.status ?? "ALL",
});

const toApiQuery = (search: AdminListingsSearch): ListListingsQueryType => ({
	archive_outcome: search.archiveOutcome,
	city: search.city,
	listing_type: search.listingType,
	max_price: search.maxPrice ? Number(search.maxPrice) : undefined,
	min_price: search.minPrice ? Number(search.minPrice) : undefined,
	page: search.page ?? 1,
	page_size: search.pageSize ?? 20,
	search: search.search,
	sort: search.sort ?? "newest",
	status: search.status,
});

const searchValue = (value: string) => value.trim() || undefined;

export function useAdminListingsPage() {
	const { language } = useLanguage();
	const search = useSearch({ from: "/admin/listings" });
	const navigate = useNavigate({ from: "/admin/listings" });
	const [searchInput, setSearchInput] = useState(search.search ?? "");
	const query = useMemo(() => toApiQuery(search), [search]);
	const listingsQuery = useAdminListingsQuery(query);
	const allListingsQuery = useAdminListingsQuery({
		page: 1,
		page_size: 1,
		sort: "newest",
	});
	const propertiesQuery = useAdminPropertiesQuery({
		archive_status: "active",
		page: 1,
		page_size: 1,
		sort: "newest",
	});

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
		}, 300);
		return () => window.clearTimeout(timer);
	}, [navigate, search.search, searchInput]);

	useEffect(() => {
		const totalPages = listingsQuery.data?.total_pages;
		if (!totalPages || !search.page || search.page <= totalPages) return;
		void navigate({
			replace: true,
			search: (current) => ({ ...current, page: totalPages }),
		});
	}, [listingsQuery.data?.total_pages, navigate, search.page]);

	const setUrlSearch = (patch: Partial<AdminListingsSearch>) => {
		void navigate({
			search: (current) => ({ ...current, ...patch, page: undefined }),
		});
	};

	const updateFilter = <Key extends keyof AdminListingFilters>(
		key: Key,
		value: AdminListingFilters[Key],
	) => {
		if (key === "search") {
			setSearchInput(value);
			return;
		}
		setUrlSearch({
			[key]: value === "" || value === "ALL" ? undefined : value,
		});
	};

	return {
		copy: adminListingsCopy[language],
		filters: {
			...filtersFromSearch(search),
			search: searchInput,
		},
		hasAnyListings: (allListingsQuery.data?.total_items ?? 0) > 0,
		hasAnyProperties: (propertiesQuery.data?.total_items ?? 0) > 0,
		isInitialLoading:
			listingsQuery.isPending ||
			allListingsQuery.isPending ||
			propertiesQuery.isPending,
		isUpdating: listingsQuery.isFetching && !listingsQuery.isPending,
		listings: listingsQuery.data?.items.map(toAdminListingRecord) ?? [],
		loadError:
			listingsQuery.error?.message ??
			allListingsQuery.error?.message ??
			propertiesQuery.error?.message ??
			null,
		page: listingsQuery.data?.page ?? search.page ?? 1,
		pageSize: search.pageSize ?? 20,
		refetch: async () => {
			await Promise.all([
				listingsQuery.refetch(),
				allListingsQuery.refetch(),
				propertiesQuery.refetch(),
			]);
		},
		resetFilters: () => {
			setSearchInput("");
			void navigate({ search: {} });
		},
		setPage: (page: number) =>
			setUrlSearch({ page: page <= 1 ? undefined : page }),
		setPageSize: (pageSize: number) =>
			setUrlSearch({
				pageSize: pageSize === 20 ? undefined : (pageSize as 50 | 100),
			}),
		setSort: (sort: AdminListingSort) =>
			setUrlSearch({ sort: sort === "newest" ? undefined : sort }),
		sort: search.sort ?? "newest",
		totalItems: listingsQuery.data?.total_items ?? 0,
		totalPages: Math.max(1, listingsQuery.data?.total_pages ?? 1),
		updateFilter,
	};
}
