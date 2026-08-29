import { status } from "elysia";
import * as v from "valibot";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	ForgotPasswordBodyType,
	ResetPasswordBodyType,
	SignInBodyType,
} from "../../../shared/types/auth.type";
import {
	ForgotPasswordSchema,
	ResetPasswordSchema,
	SignInSchema,
} from "../../../shared/validation/auth.validation";
import {
	forgotPasswordService,
	resetPasswordService,
	signInService,
	signOutService,
} from "./auth.service";

export const signIn = async ({ body }: { body: SignInBodyType }) => {
	const parsedBody = v.parse(SignInSchema, body);
	const result = await signInService({
		body: parsedBody,
	});

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: {
				redirect: result.redirect,
				url: result.url,
				user: result.user,
			},
			message: "sign in success",
		}),
	);
};

export const signOut = async ({ request }: { request: Request }) => {
	const result = await signOutService({ headers: request.headers });

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "sign out success",
		}),
	);
};

export const forgotPassword = async ({
	body,
}: {
	body: ForgotPasswordBodyType;
}) => {
	const parsedBody = v.parse(ForgotPasswordSchema, body);
	const result = await forgotPasswordService({ body: parsedBody });

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "password reset code sent",
		}),
	);
};

export const resetPassword = async ({
	body,
}: {
	body: ResetPasswordBodyType;
}) => {
	const parsedBody = v.parse(ResetPasswordSchema, body);
	const result = await resetPasswordService({
		body: {
			email: parsedBody.email,
			otp: parsedBody.otp,
			newPassword: parsedBody.newPassword,
		},
	});

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "password reset success",
		}),
	);
};
