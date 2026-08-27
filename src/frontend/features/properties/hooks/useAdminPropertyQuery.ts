import { useQuery } from "@tanstack/react-query";

import { getProperty } from "@/frontend/api/properties.api";
import { propertyQueryKeys } from "./property-query-keys";

export function useAdminPropertyQuery(propertyId: string) {
	return useQuery({
		queryFn: () => getProperty(propertyId),
		queryKey: propertyQueryKeys.detail(propertyId),
		staleTime: 30_000,
	});
}
