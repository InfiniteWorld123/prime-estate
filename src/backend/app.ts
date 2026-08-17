import { Elysia } from "elysia";
import { env } from "#/shared/env";
import { authRoutes } from "./modules/auth/auth.route";
import { AppError } from "./shared/error";
import { handleError } from "./shared/error-handler";
import { HttpStatusCode } from "./shared/http";
import { responseError } from "./shared/response";

export const app = new Elysia({ prefix: "/api" })
	.error({ AppError })
	.onError(handleError)
	.use(authRoutes)
	.get("/", `Hello from api ${env.BASE_URL}!`);

export type App = typeof app;

export const handleApiRequest = async (request: Request) => {
	const response = await app.fetch(request);

	if (response.status !== HttpStatusCode.NOT_FOUND) {
		return response;
	}

	const body = await response.clone().text();

	if (body.trim() !== "") {
		return response;
	}

	return Response.json(
		responseError({
			message: "Route not found",
			code: "NOT_FOUND",
		}),
		{ status: HttpStatusCode.NOT_FOUND },
	);
};
