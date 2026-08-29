import { auth } from "#/backend/shared/auth";
import type {
	ForgotPasswordServiceType,
	ResetPasswordServiceType,
	SignInServiceType,
} from "../../../shared/types/auth.type";

export const signInService = async ({ body }: { body: SignInServiceType }) =>
	await auth.api.signInEmail({ body });

export const signOutService = async ({ headers }: { headers: Headers }) =>
	await auth.api.signOut({ headers });

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
