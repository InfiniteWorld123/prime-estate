import { getAuth } from "#/backend/shared/auth";
import type {
	ForgotPasswordServiceType,
	ResetPasswordServiceType,
	SignInServiceType,
} from "../../../shared/types/auth.type";

export const signInService = async ({ body }: { body: SignInServiceType }) =>
	await getAuth().api.signInEmail({ body });

export const signOutService = async ({ headers }: { headers: Headers }) =>
	await getAuth().api.signOut({ headers });

export const forgotPasswordService = async ({
	body,
}: {
	body: ForgotPasswordServiceType;
}) => await getAuth().api.requestPasswordResetEmailOTP({ body });

export const resetPasswordService = async ({
	body,
}: {
	body: ResetPasswordServiceType;
}) => {
	return await getAuth().api.resetPasswordEmailOTP({
		body: {
			email: body.email,
			otp: body.otp,
			password: body.newPassword,
		},
	});
};
