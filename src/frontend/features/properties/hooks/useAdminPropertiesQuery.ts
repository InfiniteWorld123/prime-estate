import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListPropertiesQueryType } from "#/shared/types/property.type";
import { listProperties } from "@/frontend/api/properties.api";
import { propertyQueryKeys } from "./property-query-keys";

export function useAdminPropertiesQuery(query: ListPropertiesQueryType) {
	return useQuery({
		placeholderData: keepPreviousData,
		queryFn: () => listProperties(query),
		queryKey: propertyQueryKeys.list(query),
		staleTime: 30_000,
	});
}
