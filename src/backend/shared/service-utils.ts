import {
	badRequestError,
	conflictError,
	internalError,
	notFoundError,
} from "./error";

export const requireFound = <T>(row: T | undefined, message: string): T => {
	if (row === undefined) {
		throw notFoundError(message);
	}

	return row;
};

export const requireCreated = <T>(row: T | undefined, message: string): T => {
	if (row === undefined) {
		throw internalError(message);
	}

	return row;
};

export const requireInserted = <T>(row: T | undefined, message: string): T => {
	if (row === undefined) {
		throw conflictError(message);
	}

	return row;
};

export const ensureUpdateBody = (
	body: Record<string, unknown>,
	message = "At least one field is required",
) => {
	const hasValue = Object.values(body).some((value) => value !== undefined);

	if (!hasValue) {
		throw badRequestError(message);
	}
};
