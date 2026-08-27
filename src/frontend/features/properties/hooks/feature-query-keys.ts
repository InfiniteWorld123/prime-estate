export const featureQueryKeys = {
	all: ["admin", "features"] as const,
	options: () => [...featureQueryKeys.all, "options"] as const,
	property: (propertyId: string) =>
		[...featureQueryKeys.all, "property", propertyId] as const,
};
