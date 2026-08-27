import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getAuthSession,
	requestPasswordReset,
	resetPasswordWithCode,
	sendVerificationCode,
	signInWithEmail,
	signOutCurrentSession,
	signUpWithEmail,
	verifyEmailWithCode,
} from "@/frontend/api/auth.api";
import { authQueryKeys } from "./auth-query-keys";

export function useSignUpMutation() {
	return useMutation({ mutationFn: signUpWithEmail });
}

export function useSignInMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: Parameters<typeof signInWithEmail>[0]) => {
			await signInWithEmail(input);
			return await getAuthSession();
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
		},
	});
}

export function useSendVerificationCodeMutation() {
	return useMutation({ mutationFn: sendVerificationCode });
}

export function useVerifyEmailMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: verifyEmailWithCode,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
		},
	});
}

export function useForgotPasswordMutation() {
	return useMutation({ mutationFn: requestPasswordReset });
}

export function useResetPasswordMutation() {
	return useMutation({ mutationFn: resetPasswordWithCode });
}

export function useSignOutMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: signOutCurrentSession,
		onSuccess: () => {
			queryClient.setQueryData(authQueryKeys.session(), null);
			queryClient.removeQueries({
				predicate: (query) => query.queryKey[0] !== "auth",
			});
		},
	});
}
