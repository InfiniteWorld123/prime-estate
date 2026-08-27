export const contactQueryKeys = {
	all: ["admin", "contacts"] as const,
	list: (search: string) => [...contactQueryKeys.all, "list", search] as const,
};
