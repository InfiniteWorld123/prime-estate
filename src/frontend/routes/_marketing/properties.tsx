import { createFileRoute } from "@tanstack/react-router";

import { PropertiesPage } from "@/frontend/pages/marketing/properties/PropertiesPage";

export const Route = createFileRoute("/_marketing/properties")({
	component: PropertiesPage,
});
