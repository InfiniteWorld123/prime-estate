import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { marketingPagesCopy } from "@/frontend/i18n/marketing-pages.copy";

export type ContactSubmissionState = "form" | "server-error" | "success";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()./-]{5,24}$/;

export function useContactPage() {
	const { language } = useLanguage();
	const copy = marketingPagesCopy[language].contact;
	const [submissionState, setSubmissionState] =
		useState<ContactSubmissionState>("form");
	const form = useForm({
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			interest: "",
			message: "",
			privacyAccepted: false,
		},
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmitInvalid: () => {
			window.requestAnimationFrame(() => {
				document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
			});
		},
		onSubmit: async ({ value }) => {
			setSubmissionState("form");
			await new Promise((resolve) => window.setTimeout(resolve, 900));
			if (value.email.trim().toLowerCase() === "error@prime-estate.test") {
				setSubmissionState("server-error");
				return;
			}
			setSubmissionState("success");
		},
	});

	return {
		copy,
		form,
		phonePattern,
		emailPattern,
		resetForm: () => {
			form.reset();
			setSubmissionState("form");
		},
		submissionState,
	};
}
