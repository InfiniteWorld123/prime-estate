import { createFileRoute, redirect } from "@tanstack/react-router";
import { defaultDestinationForUser } from "@/frontend/features/auth/auth-navigation";
import { getAuthRouteSession } from "@/frontend/features/auth/server/getAuthRouteSession";
import { SignUpPage } from "@/frontend/pages/auth/sign-up/SignUpPage";

export const Route = createFileRoute("/_marketing/sign-up")({
	beforeLoad: async () => {
		const authSession = await getAuthRouteSession();
		if (authSession) {
			throw redirect({ to: defaultDestinationForUser(authSession.user) });
		}
	},
	component: SignUpPage,
});
