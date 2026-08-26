import { useMemo, useState } from "react";

import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import {
	getDemoListings,
	getDemoProperties,
} from "@/frontend/pages/admin/demo/admin-demo-workspace";
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
	const properties = useMemo(
		() => filterSelectableProperties(getDemoProperties(), search),
		[search],
	);

	return {
		copy: selectListingPropertyCopy[language],
		getAvailability: (propertyId: string) =>
			getListingTypeAvailability(propertyId, getDemoListings()),
		properties,
		search,
		selectedPropertyId,
		setSearch,
		setSelectedPropertyId,
	};
}
