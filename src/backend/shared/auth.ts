import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import * as v from "valibot";
import {
	NameSchema,
	PasswordSchema,
} from "#/shared/validation/auth.validation";
import { pool } from "../db/pool";
import {
	sendAuthCode,
	sendResetPasswordSuccessEmail,
	sendWelcomeEmail,
} from "./mailer";

const throwValidationError = (message: string): never => {
	throw APIError.fromStatus("UNPROCESSABLE_ENTITY", {
		code: "VALIDATION_ERROR",
		message,
	});
};

const validatePassword = (value: unknown) => {
	const result = v.safeParse(PasswordSchema, value);

	if (!result.success) {
		throwValidationError(result.issues[0]?.message ?? "Invalid password");
	}
};

const validateSignUpName = (body: Record<string, unknown>) => {
	const result = v.safeParse(NameSchema, body.name);

	if (!result.success) {
		throwValidationError(result.issues[0]?.message ?? "Invalid name");
	}

	body.name = result.output;
};

const passwordFieldByPath = new Map<string, string>([
	["/sign-up/email", "password"],
	["/email-otp/reset-password", "password"],
	["/reset-password", "newPassword"],
	["/change-password", "newPassword"],
	["/set-password", "newPassword"],
]);

const logInformationalEmailError = (type: string, error: unknown) => {
	console.error(`Unable to send ${type} email`, error);
};

export const auth = betterAuth({
	database: pool,
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		minPasswordLength: 12,
		async onPasswordReset({ user }) {
			try {
				await sendResetPasswordSuccessEmail({ email: user.email });
			} catch (error) {
				logInformationalEmailError("password reset confirmation", error);
			}
		},
	},
	emailVerification: {
		async afterEmailVerification(user) {
			try {
				await sendWelcomeEmail({
					email: user.email,
					name: user.name,
				});
			} catch (error) {
				logInformationalEmailError("welcome", error);
			}
		},
	},
	hooks: {
		before: createAuthMiddleware(async (context) => {
			if (!context.body || typeof context.body !== "object") {
				return;
			}

			const body = context.body as Record<string, unknown>;

			if (context.path === "/sign-up/email") {
				validateSignUpName(body);
			}

			const passwordField = passwordFieldByPath.get(context.path);

			if (passwordField) {
				validatePassword(body[passwordField]);
			}
		}),
	},
	plugins: [
		emailOTP({
			otpLength: 6,
			expiresIn: 5 * 60,
			allowedAttempts: 3,
			sendVerificationOnSignUp: false,
			overrideDefaultEmailVerification: true,
			async sendVerificationOTP({ email, otp, type }) {
				await sendAuthCode({ email, otp, type });
			},
		}),
		tanstackStartCookies(),
	],
});
