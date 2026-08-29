import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins";

export type AuthUser = {
	email: string;
	emailVerified: boolean;
	id: string;
	image: string | null;
	name: string;
	role: "ADMIN" | "USER";
};

export type AuthSession = {
	session: {
		expiresAt: Date;
		id: string;
	};
	user: AuthUser;
};

type BetterAuthError = {
	code?: string;
	message?: string;
	status?: number;
	statusText?: string;
};

export class AuthRequestError extends Error {
	readonly code: string | null;
	readonly status: number | null;

	constructor(error: BetterAuthError | null, fallback: string) {
		super(error?.message || fallback);
		this.name = "AuthRequestError";
		this.code = error?.code ?? null;
		this.status = error?.status ?? null;
	}
}

const authClient = createAuthClient({
	plugins: [emailOTPClient()],
});

const throwIfError = (error: BetterAuthError | null, fallback: string) => {
	if (error) throw new AuthRequestError(error, fallback);
};

export async function getAuthSession(): Promise<AuthSession | null> {
	const { data, error } = await authClient.getSession();
	throwIfError(error, "Unable to load the current session");

	if (!data) return null;

	const user = data.user as typeof data.user & {
		role?: "ADMIN" | "USER";
	};

	return {
		session: {
			expiresAt: data.session.expiresAt,
			id: data.session.id,
		},
		user: {
			email: user.email,
			emailVerified: user.emailVerified,
			id: user.id,
			image: user.image ?? null,
			name: user.name,
			role: user.role === "ADMIN" ? "ADMIN" : "USER",
		},
	};
}

export async function signInWithEmail(input: {
	email: string;
	password: string;
	rememberMe: boolean;
}) {
	const { data, error } = await authClient.signIn.email(input);
	throwIfError(error, "Unable to sign in");
	return data;
}

export async function requestPasswordReset(email: string) {
	const { data, error } = await authClient.emailOtp.requestPasswordReset({
		email,
	});
	throwIfError(error, "Unable to request a password reset code");
	return data;
}

export async function resetPasswordWithCode(input: {
	email: string;
	otp: string;
	password: string;
}) {
	const { data, error } = await authClient.emailOtp.resetPassword(input);
	throwIfError(error, "Unable to reset the password");
	return data;
}

export async function signOutCurrentSession() {
	const { data, error } = await authClient.signOut();
	throwIfError(error, "Unable to sign out");
	return data;
}
