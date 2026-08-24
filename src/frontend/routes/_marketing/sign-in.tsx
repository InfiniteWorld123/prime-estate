import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "@/frontend/pages/auth/sign-in/SignInPage";

export const Route = createFileRoute("/_marketing/sign-in")({
	component: SignInPage,
});
