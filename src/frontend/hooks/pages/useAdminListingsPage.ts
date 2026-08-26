import { useMemo, useState } from "react";

import type {
	AdminListingFilters,
	AdminListingSort,
} from "@/frontend/features/listings/admin-listing.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import {
	getDemoListings,
	getDemoProperties,
} from "@/frontend/pages/admin/demo/admin-demo-workspace";
import { adminListingsCopy } from "@/frontend/pages/admin/listings/admin-listings.copy";
import {
	defaultAdminListingFilters,
	filterAdminListings,
	paginateAdminListings,
	sortAdminListings,
} from "@/frontend/pages/admin/listings/admin-listings.model";

export function useAdminListingsPage() {
	const { language } = useLanguage();
	const [filters, setFilters] = useState<AdminListingFilters>(
		defaultAdminListingFilters,
	);
	const [sort, setSortState] = useState<AdminListingSort>("newest");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(20);

	const result = useMemo(() => {
		const filtered = filterAdminListings(getDemoListings(), filters);
		const sorted = sortAdminListings(filtered, sort);
		return paginateAdminListings(sorted, page, pageSize);
	}, [filters, page, pageSize, sort]);

	const updateFilter = <Key extends keyof AdminListingFilters>(
		key: Key,
		value: AdminListingFilters[Key],
	) => {
		setFilters((current) => ({ ...current, [key]: value }));
		setPage(1);
	};

	return {
		copy: adminListingsCopy[language],
		filters,
		hasAnyListings: getDemoListings().length > 0,
		hasAnyProperties: getDemoProperties().length > 0,
		listings: result.items,
		page: result.currentPage,
		pageSize,
		resetFilters: () => {
			setFilters(defaultAdminListingFilters);
			setPage(1);
		},
		setPage,
		setPageSize: (value: number) => {
			setPageSizeState(value);
			setPage(1);
		},
		setSort: (value: AdminListingSort) => {
			setSortState(value);
			setPage(1);
		},
		sort,
		totalItems: result.totalItems,
		totalPages: result.totalPages,
		updateFilter,
	};
}
