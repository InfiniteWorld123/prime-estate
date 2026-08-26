import { createFileRoute } from "@tanstack/react-router";

import { SelectListingPropertyPage } from "@/frontend/pages/admin/listings/create/SelectListingPropertyPage";

export const Route = createFileRoute("/admin/listings_/new")({
	component: SelectListingPropertyPage,
});
