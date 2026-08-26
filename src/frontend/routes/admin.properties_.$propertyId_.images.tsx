import { createFileRoute } from "@tanstack/react-router";

import { PropertyImagesSetupPage } from "@/frontend/pages/admin/properties/images/PropertyImagesSetupPage";

export const Route = createFileRoute("/admin/properties_/$propertyId_/images")({
	component: PropertyImagesSetupPage,
});
