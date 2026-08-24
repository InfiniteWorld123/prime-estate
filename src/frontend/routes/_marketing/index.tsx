import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/frontend/pages/marketing/home/HomePage";

export const Route = createFileRoute("/_marketing/")({
	component: HomePage,
});
