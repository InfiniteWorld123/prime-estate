import { createFileRoute } from "@tanstack/react-router";

import { AdminPropertiesPage } from "@/frontend/pages/admin/properties/AdminPropertiesPage";

export const Route = createFileRoute("/admin/properties")({
	component: AdminPropertiesRoute,
});

function AdminPropertiesRoute() {
	return <AdminPropertiesPage />;
}
