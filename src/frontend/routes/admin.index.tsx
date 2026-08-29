import { createFileRoute } from "@tanstack/react-router";
import { AdminOverviewPage } from "@/frontend/pages/admin/overview/AdminOverviewPage";

export const Route = createFileRoute("/admin/")({
	component: AdminOverviewPage,
});
