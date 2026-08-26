import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AdminShell } from "@/frontend/components/layout/admin/AdminShell";

export const Route = createFileRoute("/admin")({
	component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
	return (
		<AdminShell>
			<Outlet />
		</AdminShell>
	);
}
