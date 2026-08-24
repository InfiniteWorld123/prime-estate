import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/frontend/pages/marketing/legal/LegalPage";

export const Route = createFileRoute("/_marketing/terms")({
	component: () => <LegalPage type="terms" />,
});
