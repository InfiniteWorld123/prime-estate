import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/frontend/pages/auth/verify-email/VerifyEmailPage";

export const Route = createFileRoute("/_marketing/verify-email")({
	component: VerifyEmailPage,
});
