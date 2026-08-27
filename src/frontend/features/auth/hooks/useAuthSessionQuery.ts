import { useQuery } from "@tanstack/react-query";
import { getAuthSession } from "@/frontend/api/auth.api";
import { authQueryKeys } from "./auth-query-keys";

export function useAuthSessionQuery() {
	return useQuery({
		queryFn: getAuthSession,
		queryKey: authQueryKeys.session(),
		retry: false,
		staleTime: 30_000,
	});
}
