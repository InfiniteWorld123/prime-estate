import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import {
	isValidEmail,
	isValidOtp,
	isValidPassword,
	PENDING_PASSWORD_RESET_EMAIL_KEY,
	passwordChecks,
} from "@/frontend/features/auth/auth.utils";
import { useResetPasswordMutation } from "@/frontend/features/auth/hooks/useAuthMutations";
import { authCopy } from "@/frontend/i18n/auth.copy";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

export function useResetPasswordPage() {
	const { language } = useLanguage();
	const copy = authCopy[language];
	const resetPasswordMutation = useResetPasswordMutation();
	const [hasRememberedEmail, setHasRememberedEmail] = useState(false);
	const [submissionState, setSubmissionState] = useState<
		"form" | "error" | "success"
	>("form");
	const form = useForm({
		defaultValues: { email: "", otp: "", newPassword: "", confirmPassword: "" },
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmitInvalid: () =>
			window.requestAnimationFrame(() =>
				document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
			),
		onSubmit: async ({ value }) => {
			setSubmissionState("form");
			try {
				await resetPasswordMutation.mutateAsync({
					email: value.email.trim().toLowerCase(),
					otp: value.otp,
					password: value.newPassword,
				});
			} catch {
				setSubmissionState("error");
				return;
			}
			window.sessionStorage.removeItem(PENDING_PASSWORD_RESET_EMAIL_KEY);
			setSubmissionState("success");
		},
	});

	useEffect(() => {
		const pendingEmail =
			window.sessionStorage.getItem(PENDING_PASSWORD_RESET_EMAIL_KEY) ?? "";
		if (pendingEmail) {
			form.setFieldValue("email", pendingEmail);
			setHasRememberedEmail(true);
		}
	}, [form]);

	return {
		copy,
		form,
		hasRememberedEmail,
		isValidEmail,
		isValidOtp,
		isValidPassword,
		passwordChecks,
		submissionState,
	};
}
