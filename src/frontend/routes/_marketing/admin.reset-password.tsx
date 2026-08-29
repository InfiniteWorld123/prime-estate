import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/frontend/pages/auth/reset-password/ResetPasswordPage";

export const Route = createFileRoute("/_marketing/admin/reset-password")({
	component: ResetPasswordPage,
});
