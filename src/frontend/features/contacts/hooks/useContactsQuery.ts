import { useQuery } from "@tanstack/react-query";

import { listContacts } from "@/frontend/api/contacts.api";
import { contactQueryKeys } from "./contact-query-keys";

export function useContactsQuery(search: string) {
	return useQuery({
		queryFn: () =>
			listContacts({
				page: 1,
				page_size: 100,
				search: search.trim() || undefined,
				sort: "name_asc",
			}),
		queryKey: contactQueryKeys.list(search.trim()),
		staleTime: 30_000,
	});
}
