import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
	isValidEmail,
	isValidPassword,
	PENDING_VERIFICATION_EMAIL_KEY,
	passwordChecks,
} from "@/frontend/features/auth/auth.utils";
import {
	useSendVerificationCodeMutation,
	useSignUpMutation,
} from "@/frontend/features/auth/hooks/useAuthMutations";
import { authCopy } from "@/frontend/i18n/auth.copy";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

export function useSignUpPage() {
	const { language } = useLanguage();
	const copy = authCopy[language];
	const navigate = useNavigate();
	const signUpMutation = useSignUpMutation();
	const sendVerificationMutation = useSendVerificationCodeMutation();
	const [hasServerError, setHasServerError] = useState(false);
	const form = useForm({
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
			termsAccepted: false,
		},
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmitInvalid: () =>
			window.requestAnimationFrame(() =>
				document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
			),
		onSubmit: async ({ value }) => {
			setHasServerError(false);
			const email = value.email.trim().toLowerCase();
			try {
				await signUpMutation.mutateAsync({
					email,
					name: value.fullName.trim(),
					password: value.password,
				});
			} catch {
				setHasServerError(true);
				return;
			}

			window.sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email);
			try {
				await sendVerificationMutation.mutateAsync(email);
			} catch {
				// The account already exists. Continue so the verification page can retry.
			}
			await navigate({ to: "/verify-email" });
		},
	});

	return {
		copy,
		form,
		hasServerError,
		isValidEmail,
		isValidPassword,
		passwordChecks,
	};
}
