import { createFileRoute } from "@tanstack/react-router";

import { AdminListingsPage } from "@/frontend/pages/admin/listings/AdminListingsPage";

export const Route = createFileRoute("/admin/listings")({
	component: AdminListingsPage,
});
