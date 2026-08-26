import { createFileRoute } from "@tanstack/react-router";

import { CreateListingPage } from "@/frontend/pages/admin/listings/create/CreateListingPage";

export const Route = createFileRoute(
	"/admin/properties_/$propertyId_/listings/new",
)({
	component: CreateListingPage,
});
