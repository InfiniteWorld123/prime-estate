import { createFileRoute } from "@tanstack/react-router";

import { AdminListingPreviewPage } from "@/frontend/pages/admin/listings/details/AdminListingPreviewPage";

export const Route = createFileRoute("/admin/listings_/$listingId_/preview")({
	component: AdminListingPreviewPage,
});
