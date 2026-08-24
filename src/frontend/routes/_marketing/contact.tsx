import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/frontend/pages/marketing/contact/ContactPage";

export const Route = createFileRoute("/_marketing/contact")({
	component: ContactPage,
});
