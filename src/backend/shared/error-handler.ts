import { APIError } from "better-auth/api";
import type { ErrorHandler } from "elysia";
import { type AppError, isAppError } from "./error.ts";
import { HttpStatusCode } from "./http.ts";
import { type ResponseError, responseError } from "./response.ts";

type BetterFetchErrorShape = Error & {
	status?: number;
	error?: {
		message?: string;
		code?: string;
	};
};

type PostgresErrorShape = Error & {
	code?: string;
	constraint?: string;
	table?: string;
	detail?: string;
	cause?: unknown;
	sourceError?: unknown;
};

type NormalizedError = {
	status: number;
	body: ResponseError;
};

const findPostgresError = (
	error: unknown,
	seen = new Set<unknown>(),
): PostgresErrorShape | null => {
	if (!error || typeof error !== "object" || seen.has(error)) {
		return null;
	}

	seen.add(error);

	if (
		"code" in error &&
		typeof (error as PostgresErrorShape).code === "string"
	) {
		return error as PostgresErrorShape;
	}

	const maybeWrapped = error as PostgresErrorShape;

	return (
		findPostgresError(maybeWrapped.cause, seen) ??
		findPostgresError(maybeWrapped.sourceError, seen)
	);
};

const normalizedError = ({
	status,
	message,
	code,
	details,
}: {
	status: number;
	message: string;
	code: string;
	details?: unknown;
}): NormalizedError => ({
	status,
	body: responseError({ message, code, details }),
});

const logDatabaseError = (error: PostgresErrorShape) => {
	console.error("Database request failed", {
		code: error.code,
		constraint: error.constraint,
		table: error.table,
	});
};

const toResponseError = (error: unknown): NormalizedError => {
	if (isAppError(error)) {
		const isServerError = error.status >= HttpStatusCode.INTERNAL_SERVER_ERROR;

		if (isServerError) {
			console.error("Application error", error);
		}

		return normalizedError({
			status: error.status,
			message: isServerError ? "An unexpected error occurred" : error.message,
			code: error.code,
			details: isServerError ? undefined : error.details,
		});
	}

	if (error instanceof APIError) {
		return normalizedError({
			status: error.statusCode,
			message: error.body?.message || error.message || "Authentication error",
			code: error.body?.code || "AUTH_ERROR",
		});
	}

	if (error instanceof Error) {
		const postgresError = findPostgresError(error);

		if (postgresError) {
			logDatabaseError(postgresError);
		}

		if (postgresError?.code === "23505") {
			return normalizedError({
				status: HttpStatusCode.CONFLICT,
				message: "Resource already exists",
				code: "CONFLICT",
			});
		}

		if (postgresError?.code === "23503") {
			return normalizedError({
				status: HttpStatusCode.BAD_REQUEST,
				message: "Referenced resource was not found",
				code: "BAD_REQUEST",
			});
		}

		if (postgresError?.code === "23502" || postgresError?.code === "22P02") {
			return normalizedError({
				status: HttpStatusCode.BAD_REQUEST,
				message: "Invalid database value",
				code: "BAD_REQUEST",
			});
		}

		if ("status" in error && "error" in error) {
			const fetchError = error as BetterFetchErrorShape;
			return normalizedError({
				status: fetchError.status || HttpStatusCode.BAD_REQUEST,
				message:
					fetchError.error?.message ||
					fetchError.message ||
					"Client authentication error",
				code: fetchError.error?.code || "AUTH_FETCH_ERROR",
			});
		}

		console.error("Unhandled request error", error);

		return normalizedError({
			status: HttpStatusCode.INTERNAL_SERVER_ERROR,
			message: "An unexpected error occurred",
			code: "INTERNAL_ERROR",
		});
	}

	console.error("Unknown request error", error);

	return normalizedError({
		status: HttpStatusCode.INTERNAL_SERVER_ERROR,
		message: "An unexpected error occurred",
		code: "UNKNOWN_ERROR",
	});
};

export const handleError: ErrorHandler<{ AppError: AppError }> = ({
	code,
	error,
	status,
}) => {
	if (code === "VALIDATION") {
		const issues = error.all.map(({ message, summary }) => ({
			message: message ?? summary ?? "Invalid value",
		}));
		const message = issues[0]?.message ?? "Validation failed";

		return status(
			HttpStatusCode.UNPROCESSABLE_ENTITY,
			responseError({
				message,
				code: "VALIDATION_ERROR",
				details: issues,
			}),
		);
	}

	if (code === "NOT_FOUND") {
		return status(
			HttpStatusCode.NOT_FOUND,
			responseError({
				message: "Route not found",
				code: "NOT_FOUND",
			}),
		);
	}

	const response = toResponseError(error);

	return status(response.status, response.body);
};
