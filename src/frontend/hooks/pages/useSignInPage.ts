import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AuthRequestError } from "@/frontend/api/auth.api";
import { isValidEmail } from "@/frontend/features/auth/auth.utils";
import {
	defaultDestinationForUser,
	safeInternalRedirect,
} from "@/frontend/features/auth/auth-navigation";
import { useSignInMutation } from "@/frontend/features/auth/hooks/useAuthMutations";
import { authCopy } from "@/frontend/i18n/auth.copy";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

export type SignInState = "form" | "error" | "unverified";

export function useSignInPage() {
	const { language } = useLanguage();
	const copy = authCopy[language];
	const navigate = useNavigate();
	const search = useSearch({ from: "/_marketing/admin/login" });
	const signInMutation = useSignInMutation();
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
			const email = value.email.trim().toLowerCase();
			try {
				const session = await signInMutation.mutateAsync({
					email,
					password: value.password,
					rememberMe: value.rememberMe,
				});

				if (!session) {
					setSubmissionState("error");
					return;
				}

				const requestedDestination = safeInternalRedirect(search.redirect);
				if (requestedDestination) {
					window.location.assign(requestedDestination);
					return;
				}

				await navigate({ to: defaultDestinationForUser(session.user) });
			} catch (error) {
				const isUnverified =
					error instanceof AuthRequestError &&
					(error.code === "EMAIL_NOT_VERIFIED" ||
						error.message.toLowerCase().includes("verif"));

				if (isUnverified) {
					setSubmissionState("unverified");
					return;
				}

				setSubmissionState("error");
			}
		},
	});

	return { copy, form, isValidEmail, submissionState };
}

function focusFirstInvalid() {
	window.requestAnimationFrame(() =>
		document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
	);
}
