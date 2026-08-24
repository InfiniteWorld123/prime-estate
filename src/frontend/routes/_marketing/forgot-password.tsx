import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/frontend/pages/auth/forgot-password/ForgotPasswordPage";

export const Route = createFileRoute("/_marketing/forgot-password")({
	component: ForgotPasswordPage,
});
