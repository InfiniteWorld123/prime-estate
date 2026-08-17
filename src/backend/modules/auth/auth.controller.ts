import { status } from "elysia";
import * as v from "valibot";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	ForgotPasswordBodyType,
	ResetPasswordBodyType,
	SendVerificationOtpBodyType,
	SignInBodyType,
	SignUpBodyType,
	VerifyEmailBodyType,
} from "../../../shared/types/auth.type";
import {
	ForgotPasswordSchema,
	ResetPasswordSchema,
	SendVerificationOtpSchema,
	SignInSchema,
	SignUpSchema,
	VerifyEmailSchema,
} from "../../../shared/validation/auth.validation";
import {
	forgotPasswordService,
	resetPasswordService,
	sendVerificationOtpService,
	signInService,
	signOutService,
	signUpService,
	verifyEmailService,
} from "./auth.service";

export const signUp = async ({ body }: { body: SignUpBodyType }) => {
	const parsedBody = v.parse(SignUpSchema, body);
	const result = await signUpService({
		body: {
			name: parsedBody.name,
			email: parsedBody.email,
			password: parsedBody.password,
			image: parsedBody.image,
			callbackURL: parsedBody.callbackURL,
		},
	});

	return status(
		HttpStatusCode.CREATED,
		responseOk({
			data: result,
			message: "Sign up successful",
		}),
	);
};

export const signIn = async ({ body }: { body: SignInBodyType }) => {
	const parsedBody = v.parse(SignInSchema, body);
	const result = await signInService({ body: parsedBody });

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
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

export const sendVerificationOtp = async ({
	body,
}: {
	body: SendVerificationOtpBodyType;
}) => {
	const parsedBody = v.parse(SendVerificationOtpSchema, body);
	const result = await sendVerificationOtpService({ body: parsedBody });

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "verification code sent",
		}),
	);
};

export const verifyEmail = async ({ body }: { body: VerifyEmailBodyType }) => {
	const parsedBody = v.parse(VerifyEmailSchema, body);
	const result = await verifyEmailService({ body: parsedBody });

	return status(
		HttpStatusCode.OK,
		responseOk({
			data: result,
			message: "email verified",
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
