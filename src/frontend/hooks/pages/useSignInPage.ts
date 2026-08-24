import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
	AUTH_PREVIEW_USER_KEY,
	createPreviewUser,
	isValidEmail,
	mockDelay,
	PENDING_VERIFICATION_EMAIL_KEY,
} from "@/frontend/features/auth/auth.mock";
import { authCopy } from "@/frontend/i18n/auth.copy";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

export type SignInState = "form" | "error" | "unverified";

export function useSignInPage() {
	const { language } = useLanguage();
	const copy = authCopy[language];
	const navigate = useNavigate();
	const [submissionState, setSubmissionState] = useState<SignInState>("form");
	const form = useForm({
		defaultValues: { email: "", password: "", rememberMe: false },
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmitInvalid: focusFirstInvalid,
		onSubmit: async ({ value }) => {
			setSubmissionState("form");
			await mockDelay();
			const email = value.email.trim().toLowerCase();
			if (email === "unverified@prime-estate.test") {
				window.sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email);
				setSubmissionState("unverified");
				return;
			}
			if (email === "error@prime-estate.test") {
				setSubmissionState("error");
				return;
			}
			window.sessionStorage.setItem(
				AUTH_PREVIEW_USER_KEY,
				JSON.stringify(createPreviewUser(email)),
			);
			await navigate({ to: "/" });
		},
	});

	return { copy, form, isValidEmail, submissionState };
}

function focusFirstInvalid() {
	window.requestAnimationFrame(() =>
		document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
	);
}
