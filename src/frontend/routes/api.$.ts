import { treaty } from "@elysia/eden";
import { createFileRoute } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { type App, app, handleApiRequest } from "#/backend/app";
import { env } from "#/shared/env";

const handle = ({ request }: { request: Request }) => handleApiRequest(request);

export const Route = createFileRoute("/api/$")({
	server: {
		handlers: {
			GET: handle,
			POST: handle,
			PUT: handle,
			DELETE: handle,
			PATCH: handle,
		},
	},
});

export const safe_API = createIsomorphicFn()
	.server(() => treaty(app).api)
	.client(() => treaty<App>(env.BASE_URL).api);
