import { useMutation } from "@tanstack/react-query";
import { safe_API } from "#/frontend/routes/api.$";
import type {
	ForgotPasswordBodyType,
	ResetPasswordBodyType,
	SendVerificationOtpBodyType,
	SignInBodyType,
	SignUpBodyType,
	VerifyEmailBodyType,
} from "#/shared/types/auth.type";
import { getErrorMessage } from "../utils";

export const signUpMutation = () => {
	return useMutation({
		mutationFn: async (body: SignUpBodyType) => {
			const result = await safe_API().auth["sign-up"].post(body);

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to sign up"));
			}

			return result.data;
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const signInMutation = () => {
	return useMutation({
		mutationFn: async (body: SignInBodyType) => {
			const result = await safe_API().auth["sign-in"].post(body);

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to sign in"));
			}

			return result.data;
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const verifyEmailMutation = () => {
	return useMutation({
		mutationFn: async (body: VerifyEmailBodyType) => {
			const result = await safe_API().auth["verify-email"].post(body);

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to verify email"),
				);
			}

			return result.data;
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const sendEmailOtpMutation = () => {
	return useMutation({
		mutationFn: async (body: SendVerificationOtpBodyType) => {
			const result = await safe_API().auth["send-verification-otp"].post(body);

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to send OTP"));
			}

			return result.data;
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const forgotPasswordMutation = () => {
	return useMutation({
		mutationFn: async (body: ForgotPasswordBodyType) => {
			const result = await safe_API().auth["forgot-password"].post(body);

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to send a reset password link"),
				);
			}

			return result.data;
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const resetPasswordMutation = () => {
	return useMutation({
		mutationFn: async (body: ResetPasswordBodyType) => {
			const result = await safe_API().auth["reset-password"].post(body);

			if (result.error) {
				throw new Error(
					getErrorMessage(result.error, "Unable to reset the password"),
				);
			}

			return result.data;
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};

export const signOutMutation = () => {
	return useMutation({
		mutationFn: async () => {
			const result = await safe_API().auth["sign-out"].post();

			if (result.error) {
				throw new Error(getErrorMessage(result.error, "Unable to sign out"));
			}

			return result.data;
		},
		onError: (error) => {
			console.log(error.message);
		},
	});
};
