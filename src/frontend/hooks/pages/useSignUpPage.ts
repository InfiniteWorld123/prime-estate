import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
	isValidEmail,
	isValidPassword,
	mockDelay,
	PENDING_VERIFICATION_EMAIL_KEY,
	passwordChecks,
} from "@/frontend/features/auth/auth.mock";
import { authCopy } from "@/frontend/i18n/auth.copy";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

export function useSignUpPage() {
	const { language } = useLanguage();
	const copy = authCopy[language];
	const navigate = useNavigate();
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
			await mockDelay();
			const email = value.email.trim().toLowerCase();
			if (email === "error@prime-estate.test") {
				setHasServerError(true);
				return;
			}
			window.sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email);
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
