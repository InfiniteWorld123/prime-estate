import { createFileRoute } from "@tanstack/react-router";

import { AdminPropertyDetailsPage } from "@/frontend/pages/admin/properties/details/AdminPropertyDetailsPage";

export const Route = createFileRoute("/admin/properties_/$propertyId")({
	component: AdminPropertyDetailsPage,
	validateSearch: (search: Record<string, unknown>): { edit?: boolean } =>
		search.edit === true || search.edit === "true" ? { edit: true } : {},
});
