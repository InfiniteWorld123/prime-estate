import { useMemo, useState } from "react";

import { useAdminListingsQuery } from "@/frontend/features/listings/hooks/useAdminListingsQuery";
import { toAdminListingRecord } from "@/frontend/features/listings/listing.mapper";
import { useAdminPropertiesQuery } from "@/frontend/features/properties/hooks/useAdminPropertiesQuery";
import { toAdminPropertyRecord } from "@/frontend/features/properties/property.mapper";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { selectListingPropertyCopy } from "@/frontend/pages/admin/listings/create/select-listing-property.copy";
import {
	filterSelectableProperties,
	getListingTypeAvailability,
} from "@/frontend/pages/admin/listings/select-listing-property.model";

export function useSelectListingPropertyPage() {
	const { language } = useLanguage();
	const [search, setSearch] = useState("");
	const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
		null,
	);
	const propertiesQuery = useAdminPropertiesQuery({
		archive_status: "active",
		page: 1,
		page_size: 100,
		sort: "newest",
	});
	const listingsQuery = useAdminListingsQuery({
		page: 1,
		page_size: 100,
		sort: "newest",
	});
	const properties = useMemo(
		() =>
			filterSelectableProperties(
				propertiesQuery.data?.items.map(toAdminPropertyRecord) ?? [],
				search,
			),
		[propertiesQuery.data?.items, search],
	);
	const listings = useMemo(
		() => listingsQuery.data?.items.map(toAdminListingRecord) ?? [],
		[listingsQuery.data?.items],
	);

	return {
		copy: selectListingPropertyCopy[language],
		getAvailability: (propertyId: string) =>
			getListingTypeAvailability(propertyId, listings),
		isLoading: propertiesQuery.isPending || listingsQuery.isPending,
		loadError:
			propertiesQuery.error?.message ?? listingsQuery.error?.message ?? null,
		properties,
		refetch: async () => {
			await Promise.all([propertiesQuery.refetch(), listingsQuery.refetch()]);
		},
		search,
		selectedPropertyId,
		setSearch,
		setSelectedPropertyId,
	};
}
