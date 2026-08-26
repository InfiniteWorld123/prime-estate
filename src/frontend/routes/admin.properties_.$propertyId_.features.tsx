import { createFileRoute } from "@tanstack/react-router";

import { PropertyFeaturesSetupPage } from "@/frontend/pages/admin/properties/features/PropertyFeaturesSetupPage";

export const Route = createFileRoute(
	"/admin/properties_/$propertyId_/features",
)({
	component: PropertyFeaturesSetupPage,
});
