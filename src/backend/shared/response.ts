export type ResponseOk<T> = {
	success: true;
	message: string;
	data: T;
};

export type ResponseError = {
	success: false;
	message: string;
	code?: string;
	details?: unknown;
};

export const responseOk = <T>({
	data,
	message,
}: {
	data: T;
	message?: string;
}): ResponseOk<T> => {
	return {
		success: true,
		message: message ?? "Success",
		data,
	};
};

export const responseError = ({
	message,
	code,
	details,
}: {
	message: string;
	code?: string;
	details?: unknown;
}): ResponseError => {
	return {
		success: false,
		message,
		code,
		details,
	};
};
