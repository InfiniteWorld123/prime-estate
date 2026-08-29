import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useState } from "react";
import type { InquiryInterestType } from "#/shared/types/inquiry.type";
import {
	INQUIRY_EMAIL_PATTERN,
	INQUIRY_FIELD_LIMITS,
	INQUIRY_PHONE_PATTERN,
} from "#/shared/validation/inquiry.validation";
import { useCreateInquiryMutation } from "@/frontend/features/inquiries/hooks/useCreateInquiryMutation";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { marketingPagesCopy } from "@/frontend/i18n/marketing-pages.copy";

export type ContactSubmissionState = "form" | "server-error" | "success";

export function useContactPage() {
	const { language } = useLanguage();
	const copy = marketingPagesCopy[language].contact;
	const [submissionState, setSubmissionState] =
		useState<ContactSubmissionState>("form");
	const createInquiryMutation = useCreateInquiryMutation();
	const form = useForm({
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			interest: "",
			message: "",
			privacyAccepted: false,
			website: "",
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
			createInquiryMutation.reset();
			try {
				await createInquiryMutation.mutateAsync({
					inquiry_type: "GENERAL",
					interest: value.interest.toUpperCase() as InquiryInterestType,
					full_name: value.fullName,
					email: value.email,
					phone: value.phone || undefined,
					message: value.message,
					privacy_accepted: true,
					website: value.website,
				});
				setSubmissionState("success");
			} catch {
				setSubmissionState("server-error");
			}
		},
	});

	return {
		copy,
		fieldLimits: INQUIRY_FIELD_LIMITS,
		form,
		phonePattern: INQUIRY_PHONE_PATTERN,
		emailPattern: INQUIRY_EMAIL_PATTERN,
		resetForm: () => {
			form.reset();
			createInquiryMutation.reset();
			setSubmissionState("form");
		},
		submissionState,
	};
}
