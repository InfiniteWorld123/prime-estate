import { createFileRoute, redirect } from "@tanstack/react-router";
import { defaultDestinationForUser } from "@/frontend/features/auth/auth-navigation";
import { getAuthRouteSession } from "@/frontend/features/auth/server/getAuthRouteSession";
import { SignInPage } from "@/frontend/pages/auth/sign-in/SignInPage";

export const Route = createFileRoute("/_marketing/sign-in")({
	beforeLoad: async () => {
		const authSession = await getAuthRouteSession();
		if (authSession) {
			throw redirect({ to: defaultDestinationForUser(authSession.user) });
		}
	},
	component: SignInPage,
	validateSearch: (search): { redirect?: string } => ({
		redirect: typeof search.redirect === "string" ? search.redirect : undefined,
	}),
});
