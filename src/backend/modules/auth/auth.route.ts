import { Elysia } from "elysia";
import { auth } from "#/backend/shared/auth";
import {
	ForgotPasswordSchema,
	ResetPasswordSchema,
	SignInSchema,
} from "../../../shared/validation/auth.validation";
import {
	forgotPassword,
	resetPassword,
	signIn,
	signOut,
} from "./auth.controller";

export const authRoutes = new Elysia({ prefix: "/auth" })
	.post("/sign-in", signIn, { body: SignInSchema })
	.post("/sign-out", signOut)
	.post("/forgot-password", forgotPassword, { body: ForgotPasswordSchema })
	.post("/reset-password", resetPassword, { body: ResetPasswordSchema })
	.all("/*", ({ request }) => auth.handler(request));
