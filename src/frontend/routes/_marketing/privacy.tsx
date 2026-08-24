import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/frontend/pages/marketing/legal/LegalPage";

export const Route = createFileRoute("/_marketing/privacy")({
	component: () => <LegalPage type="privacy" />,
});
