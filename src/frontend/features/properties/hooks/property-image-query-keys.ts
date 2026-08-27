export const propertyImageQueryKeys = {
	all: ["admin", "property-images"] as const,
	list: (propertyId: string) =>
		[...propertyImageQueryKeys.all, propertyId] as const,
};
