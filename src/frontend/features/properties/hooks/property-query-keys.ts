import type { ListPropertiesQueryType } from "#/shared/types/property.type";

export const propertyQueryKeys = {
	all: ["admin", "properties"] as const,
	detail: (propertyId: string) =>
		[...propertyQueryKeys.details(), propertyId] as const,
	details: () => [...propertyQueryKeys.all, "detail"] as const,
	list: (query: ListPropertiesQueryType) =>
		[...propertyQueryKeys.lists(), query] as const,
	lists: () => [...propertyQueryKeys.all, "list"] as const,
};
