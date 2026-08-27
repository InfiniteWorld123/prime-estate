import { treaty } from "@elysia/eden";

import type { App } from "#/backend/app";

export function safe_API() {
	if (typeof window === "undefined") {
		throw new Error(
			"The browser API client cannot run during server rendering",
		);
	}

	return treaty<App>(window.location.origin).api;
}
