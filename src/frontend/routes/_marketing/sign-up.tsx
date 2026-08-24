import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "@/frontend/pages/auth/sign-up/SignUpPage";

export const Route = createFileRoute("/_marketing/sign-up")({
	component: SignUpPage,
});
