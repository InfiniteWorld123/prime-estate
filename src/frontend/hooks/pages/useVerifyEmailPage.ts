import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import {
	isValidEmail,
	isValidOtp,
	maskEmail,
	PENDING_VERIFICATION_EMAIL_KEY,
} from "@/frontend/features/auth/auth.utils";
import {
	useSendVerificationCodeMutation,
	useVerifyEmailMutation,
} from "@/frontend/features/auth/hooks/useAuthMutations";
import { authCopy } from "@/frontend/i18n/auth.copy";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

export type VerifyEmailState = "form" | "error" | "success";

export function useVerifyEmailPage() {
	const { language } = useLanguage();
	const copy = authCopy[language];
	const verifyMutation = useVerifyEmailMutation();
	const resendMutation = useSendVerificationCodeMutation();
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
			try {
				await verifyMutation.mutateAsync({
					email: value.email.trim().toLowerCase(),
					otp: value.otp,
				});
			} catch {
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
		const email = form.getFieldValue("email").trim().toLowerCase();
		if (!isValidEmail(email)) {
			setEditEmail(true);
			setSubmissionState("error");
			return;
		}
		setIsResending(true);
		setResent(false);
		setSubmissionState("form");
		try {
			await resendMutation.mutateAsync(email);
			setResent(true);
		} catch {
			setSubmissionState("error");
		} finally {
			setIsResending(false);
		}
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
