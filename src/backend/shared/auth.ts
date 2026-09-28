import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import type { Pool } from "pg";
import * as v from "valibot";
import { PasswordSchema } from "#/shared/validation/auth.validation";
import { getPool } from "../db/pool";
import { sendAuthCode, sendResetPasswordSuccessEmail } from "./mailer";

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

const passwordFieldByPath = new Map<string, string>([
	["/email-otp/reset-password", "password"],
	["/reset-password", "newPassword"],
	["/change-password", "newPassword"],
	["/set-password", "newPassword"],
]);

const logInformationalEmailError = (type: string, error: unknown) => {
	console.error(`Unable to send ${type} email`, error);
};

const isAdminEmail = async (pool: Pool, value: unknown) => {
	if (typeof value !== "string") return false;

	const result = await pool.query<{ role: string }>(
		`SELECT role FROM "user" WHERE email = $1 LIMIT 1;`,
		[value.trim().toLowerCase()],
	);

	return result.rows[0]?.role === "ADMIN";
};

const createAuth = (pool: Pool) =>
	betterAuth({
		database: pool,
		user: {
			additionalFields: {
				role: {
					type: "string",
					required: true,
					defaultValue: "USER",
					input: false,
				},
			},
		},
		emailAndPassword: {
			enabled: true,
			disableSignUp: true,
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
		hooks: {
			before: createAuthMiddleware(async (context) => {
				if (!context.body || typeof context.body !== "object") {
					return;
				}

				const body = context.body as Record<string, unknown>;

				if (
					context.path === "/sign-in/email" ||
					context.path === "/sign-in/email-otp" ||
					context.path === "/email-otp/reset-password"
				) {
					if (!(await isAdminEmail(pool, body.email))) {
						throw APIError.fromStatus("UNAUTHORIZED", {
							code: "INVALID_EMAIL_OR_PASSWORD",
							message: "Invalid administrator credentials",
						});
					}
				}

				const passwordField = passwordFieldByPath.get(context.path);

				if (passwordField) {
					validatePassword(body[passwordField]);
				}
			}),
		},
		plugins: [
			emailOTP({
				disableSignUp: true,
				otpLength: 6,
				expiresIn: 5 * 60,
				allowedAttempts: 3,
				sendVerificationOnSignUp: false,
				overrideDefaultEmailVerification: true,
				async sendVerificationOTP({ email, otp, type }) {
					if (
						(type === "sign-in" || type === "forget-password") &&
						!(await isAdminEmail(pool, email))
					) {
						return;
					}

					await sendAuthCode({ email, otp, type });
				},
			}),
			tanstackStartCookies(),
		],
	});

type Auth = ReturnType<typeof createAuth>;

// Better Auth keeps its database adapter for the lifetime of the instance, so
// each request-scoped pool gets its own instance (see `db/pool.ts`).
const authByPool = new WeakMap<Pool, Auth>();

export const getAuth = () => {
	const pool = getPool();
	let auth = authByPool.get(pool);

	if (!auth) {
		auth = createAuth(pool);
		authByPool.set(pool, auth);
	}

	return auth;
};
