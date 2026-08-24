import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import {
	isValidEmail,
	isValidOtp,
	maskEmail,
	mockDelay,
	PENDING_VERIFICATION_EMAIL_KEY,
} from "@/frontend/features/auth/auth.mock";
import { authCopy } from "@/frontend/i18n/auth.copy";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

export type VerifyEmailState = "form" | "error" | "success";

export function useVerifyEmailPage() {
	const { language } = useLanguage();
	const copy = authCopy[language];
	const [rememberedEmail, setRememberedEmail] = useState("");
	const [editEmail, setEditEmail] = useState(false);
	const [submissionState, setSubmissionState] =
		useState<VerifyEmailState>("form");
	const [isResending, setIsResending] = useState(false);
	const [resent, setResent] = useState(false);
	const form = useForm({
		defaultValues: { email: "", otp: "" },
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
			if (value.otp === "000000") {
				setSubmissionState("error");
				return;
			}
			window.sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
			setSubmissionState("success");
		},
	});

	useEffect(() => {
		const pendingEmail =
			window.sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY) ?? "";
		setRememberedEmail(pendingEmail);
		if (pendingEmail) form.setFieldValue("email", pendingEmail);
		else setEditEmail(true);
	}, [form]);

	const resendCode = async () => {
		setIsResending(true);
		setResent(false);
		await mockDelay(650);
		setIsResending(false);
		setResent(true);
	};

	return {
		copy,
		editEmail,
		form,
		isResending,
		isValidEmail,
		isValidOtp,
		maskedEmail: maskEmail(rememberedEmail),
		rememberedEmail,
		resendCode,
		resent,
		setEditEmail,
		submissionState,
	};
}
