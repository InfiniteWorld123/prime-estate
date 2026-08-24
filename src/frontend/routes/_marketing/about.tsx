import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/frontend/pages/marketing/about/AboutPage";

export const Route = createFileRoute("/_marketing/about")({
	component: AboutPage,
});
