import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useState } from "react";
import {
	isValidEmail,
	mockDelay,
	PENDING_PASSWORD_RESET_EMAIL_KEY,
} from "@/frontend/features/auth/auth.mock";
import { authCopy } from "@/frontend/i18n/auth.copy";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

export function useForgotPasswordPage() {
	const { language } = useLanguage();
	const copy = authCopy[language];
	const [submissionState, setSubmissionState] = useState<
		"form" | "error" | "success"
	>("form");
	const form = useForm({
		defaultValues: { email: "" },
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
			await mockDelay();
			if (value.email.trim().toLowerCase() === "error@prime-estate.test") {
				setSubmissionState("error");
				return;
			}
			window.sessionStorage.setItem(
				PENDING_PASSWORD_RESET_EMAIL_KEY,
				value.email.trim().toLowerCase(),
			);
			setSubmissionState("success");
		},
	});

	return { copy, form, isValidEmail, submissionState };
}
