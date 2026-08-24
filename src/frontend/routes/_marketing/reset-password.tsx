import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/frontend/pages/auth/reset-password/ResetPasswordPage";

export const Route = createFileRoute("/_marketing/reset-password")({
	component: ResetPasswordPage,
});
