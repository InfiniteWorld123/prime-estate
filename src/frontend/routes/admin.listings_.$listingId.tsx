import { createFileRoute } from "@tanstack/react-router";

import { AdminListingDetailsPage } from "@/frontend/pages/admin/listings/details/AdminListingDetailsPage";

export const Route = createFileRoute("/admin/listings_/$listingId")({
	component: AdminListingDetailsPage,
});
