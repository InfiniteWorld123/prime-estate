import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "#/backend/shared/auth";
import type { AuthUser } from "@/frontend/api/auth.api";

export type AuthRouteSession = {
	user: AuthUser;
};

export const getAuthRouteSession = createServerFn({ method: "GET" }).handler(
	async (): Promise<AuthRouteSession | null> => {
		const request = getRequest();
		const session = await auth.api.getSession({
			headers: request.headers,
			query: { disableCookieCache: true },
		});

		if (!session) return null;

		return {
			user: {
				email: session.user.email,
				emailVerified: session.user.emailVerified,
				id: session.user.id,
				image: session.user.image ?? null,
				name: session.user.name,
				role: session.user.role === "ADMIN" ? "ADMIN" : "USER",
			},
		};
	},
);
