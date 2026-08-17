import { auth } from "#/backend/shared/auth";
import type {
	ForgotPasswordServiceType,
	ResetPasswordServiceType,
	SendVerificationOtpServiceType,
	SignInServiceType,
	SignUpServiceType,
	VerifyEmailServiceType,
} from "../../../shared/types/auth.type";

export const signUpService = async ({ body }: { body: SignUpServiceType }) =>
	await auth.api.signUpEmail({ body });

export const signInService = async ({ body }: { body: SignInServiceType }) =>
	await auth.api.signInEmail({ body });

export const signOutService = async ({ headers }: { headers: Headers }) =>
	await auth.api.signOut({ headers });

export const sendVerificationOtpService = async ({
	body,
}: {
	body: SendVerificationOtpServiceType;
}) =>
	await auth.api.sendVerificationOTP({
		body: {
			email: body.email,
			type: body.type ?? "email-verification",
		},
	});

export const verifyEmailService = async ({
	body,
}: {
	body: VerifyEmailServiceType;
}) => {
	return await auth.api.verifyEmailOTP({ body });
};

export const forgotPasswordService = async ({
	body,
}: {
	body: ForgotPasswordServiceType;
}) => await auth.api.requestPasswordResetEmailOTP({ body });

export const resetPasswordService = async ({
	body,
}: {
	body: ResetPasswordServiceType;
}) => {
	return await auth.api.resetPasswordEmailOTP({
		body: {
			email: body.email,
			otp: body.otp,
			password: body.newPassword,
		},
	});
};
