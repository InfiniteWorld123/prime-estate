import { createFileRoute } from "@tanstack/react-router";

import { CreatePropertyPage } from "@/frontend/pages/admin/properties/create/CreatePropertyPage";

export const Route = createFileRoute("/admin/properties_/new")({
	component: CreatePropertyPage,
});
