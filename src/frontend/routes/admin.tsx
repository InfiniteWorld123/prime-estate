import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminShell } from "@/frontend/components/layout/admin/AdminShell";
import { getAuthRouteSession } from "@/frontend/features/auth/server/getAuthRouteSession";

export const Route = createFileRoute("/admin")({
	beforeLoad: async ({ location }) => {
		const authSession = await getAuthRouteSession();

		if (!authSession) {
			throw redirect({
				search: { redirect: location.href },
				to: "/sign-in",
			});
		}

		if (!authSession.user.emailVerified) {
			throw redirect({ to: "/verify-email" });
		}

		if (authSession.user.role !== "ADMIN") {
			throw redirect({ to: "/" });
		}

		return { authSession };
	},
	component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
	return (
		<AdminShell>
			<Outlet />
		</AdminShell>
	);
}
