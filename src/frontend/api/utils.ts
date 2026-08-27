export const getErrorMessage = (error: unknown, fallback: string): string => {
	if (typeof error !== "object" || error === null) {
		return fallback;
	}

	if ("value" in error) {
		return getErrorMessage(error.value, fallback);
	}

	if ("message" in error && typeof error.message === "string") {
		return error.message;
	}

	return fallback;
};

type ApiResult<T> = {
	data: T | null;
	error: unknown;
};

export class ApiRequestError extends Error {
	readonly status: number | null;

	constructor(message: string, status: number | null) {
		super(message);
		this.name = "ApiRequestError";
		this.status = status;
	}
}

const getErrorStatus = (error: unknown): number | null => {
	if (typeof error !== "object" || error === null) return null;
	if ("status" in error && typeof error.status === "number")
		return error.status;
	if ("value" in error) return getErrorStatus(error.value);
	return null;
};

export const unwrapApiResult = <T>(
	result: ApiResult<T>,
	fallback: string,
): T => {
	if (result.error) {
		throw new ApiRequestError(
			getErrorMessage(result.error, fallback),
			getErrorStatus(result.error),
		);
	}

	if (result.data === null) {
		throw new Error(fallback);
	}

	return result.data;
};
