import { useNavigate } from "@tanstack/react-router";
import { useSignOutMutation } from "./useAuthMutations";
import { useAuthSessionQuery } from "./useAuthSessionQuery";

export function useAuthNavigation() {
	const navigate = useNavigate();
	const sessionQuery = useAuthSessionQuery();
	const signOutMutation = useSignOutMutation();

	return {
		isLoading: sessionQuery.isPending,
		isSigningOut: signOutMutation.isPending,
		signOut: async () => {
			try {
				await signOutMutation.mutateAsync();
				await navigate({ to: "/" });
			} catch {
				// Keep the visible session intact and expose the mutation error for retry.
			}
		},
		signOutError: signOutMutation.error?.message ?? null,
		user: sessionQuery.data?.user ?? null,
	};
}
