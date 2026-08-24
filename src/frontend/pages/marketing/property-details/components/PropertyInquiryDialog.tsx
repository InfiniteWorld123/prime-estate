import { revalidateLogic, useForm } from "@tanstack/react-form";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Textarea } from "@/frontend/components/ui/textarea";
import type { PropertyDetailListing } from "@/frontend/features/listings/listing.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type PropertyInquiryDialogProps = {
	listing: PropertyDetailListing;
	onOpenChange: (open: boolean) => void;
	open: boolean;
};

type SubmissionState = "form" | "server-error" | "success";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()./-]{5,24}$/;

export function PropertyInquiryDialog({
	listing,
	onOpenChange,
	open,
}: PropertyInquiryDialogProps) {
	const { copy } = useLanguage();
	const inquiryCopy = copy.propertyDetails.inquiry;
	const [submissionState, setSubmissionState] =
		useState<SubmissionState>("form");
	const defaultMessage = inquiryCopy.messageTemplate.replace(
		"{reference}",
		listing.referenceNumber,
	);
	const form = useForm({
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			message: defaultMessage,
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
			await new Promise((resolve) => window.setTimeout(resolve, 800));
			if (
				import.meta.env.DEV &&
				value.email.trim().toLowerCase() === "error@prime-estate.test"
			) {
				setSubmissionState("server-error");
				return;
			}
			setSubmissionState("success");
		},
	});

	const handleOpenChange = (nextOpen: boolean) => {
		onOpenChange(nextOpen);
		if (!nextOpen) {
			window.setTimeout(() => {
				form.reset();
				setSubmissionState("form");
			}, 150);
		}
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogContent
				className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl"
				closeLabel={inquiryCopy.close}
			>
				{submissionState === "success" ? (
					<div className="flex flex-col items-center px-2 py-8 text-center sm:px-8">
						<span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
							<CircleCheck aria-hidden="true" className="size-7" />
						</span>
						<DialogTitle className="mt-5 text-2xl">
							{inquiryCopy.successTitle}
						</DialogTitle>
						<DialogDescription className="mt-3 max-w-md leading-6">
							{inquiryCopy.successDescription}
						</DialogDescription>
						<Button
							className="mt-7"
							onClick={() => handleOpenChange(false)}
							type="button"
						>
							{inquiryCopy.close}
						</Button>
					</div>
				) : (
					<>
						<div>
							<DialogTitle className="text-xl">{inquiryCopy.title}</DialogTitle>
							<DialogDescription className="mt-2 leading-6">
								{inquiryCopy.description}
							</DialogDescription>
						</div>

						<form
							className="space-y-5"
							onSubmit={(event) => {
								event.preventDefault();
								event.stopPropagation();
								void form.handleSubmit();
							}}
						>
							<form.Field
								name="fullName"
								validators={{
									onDynamic: ({ value }) =>
										value.trim() ? undefined : inquiryCopy.validation.fullName,
								}}
							>
								{(field) => {
									const error = field.state.meta.errors[0];
									return (
										<div className="space-y-2">
											<Label htmlFor={field.name}>{inquiryCopy.fullName}</Label>
											<Input
												aria-describedby={
													error ? `${field.name}-error` : undefined
												}
												aria-invalid={Boolean(error)}
												autoComplete="name"
												className="h-10"
												id={field.name}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												placeholder={inquiryCopy.fullNamePlaceholder}
												value={field.state.value}
											/>
											{error ? (
												<p
													className="text-sm text-destructive"
													id={`${field.name}-error`}
												>
													{String(error)}
												</p>
											) : null}
										</div>
									);
								}}
							</form.Field>

							<form.Field
								name="email"
								validators={{
									onDynamic: ({ value }) =>
										emailPattern.test(value.trim())
											? undefined
											: inquiryCopy.validation.email,
								}}
							>
								{(field) => {
									const error = field.state.meta.errors[0];
									return (
										<div className="space-y-2">
											<Label htmlFor={field.name}>{inquiryCopy.email}</Label>
											<Input
												aria-describedby={
													error ? `${field.name}-error` : undefined
												}
												aria-invalid={Boolean(error)}
												autoComplete="email"
												className="h-10"
												id={field.name}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												placeholder={inquiryCopy.emailPlaceholder}
												type="email"
												value={field.state.value}
											/>
											{error ? (
												<p
													className="text-sm text-destructive"
													id={`${field.name}-error`}
												>
													{String(error)}
												</p>
											) : null}
										</div>
									);
								}}
							</form.Field>

							<form.Field
								name="phone"
								validators={{
									onDynamic: ({ value }) =>
										!value.trim() || phonePattern.test(value.trim())
											? undefined
											: inquiryCopy.validation.phone,
								}}
							>
								{(field) => {
									const error = field.state.meta.errors[0];
									return (
										<div className="space-y-2">
											<div className="flex items-center justify-between gap-3">
												<Label htmlFor={field.name}>{inquiryCopy.phone}</Label>
												<span className="text-xs text-muted-foreground">
													{inquiryCopy.phoneOptional}
												</span>
											</div>
											<Input
												aria-describedby={
													error ? `${field.name}-error` : undefined
												}
												aria-invalid={Boolean(error)}
												autoComplete="tel"
												className="h-10"
												id={field.name}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												placeholder={inquiryCopy.phonePlaceholder}
												type="tel"
												value={field.state.value}
											/>
											{error ? (
												<p
													className="text-sm text-destructive"
													id={`${field.name}-error`}
												>
													{String(error)}
												</p>
											) : null}
										</div>
									);
								}}
							</form.Field>

							<form.Field
								name="message"
								validators={{
									onDynamic: ({ value }) => {
										if (!value.trim()) return inquiryCopy.validation.message;
										if (value.length > 2000)
											return inquiryCopy.validation.messageLength;
										return undefined;
									},
								}}
							>
								{(field) => {
									const error = field.state.meta.errors[0];
									return (
										<div className="space-y-2">
											<Label htmlFor={field.name}>{inquiryCopy.message}</Label>
											<Textarea
												aria-describedby={
													error ? `${field.name}-error` : undefined
												}
												aria-invalid={Boolean(error)}
												className="min-h-32 resize-y"
												id={field.name}
												maxLength={2000}
												onBlur={field.handleBlur}
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												value={field.state.value}
											/>
											{error ? (
												<p
													className="text-sm text-destructive"
													id={`${field.name}-error`}
												>
													{String(error)}
												</p>
											) : null}
										</div>
									);
								}}
							</form.Field>

							<form.Field
								name="privacyAccepted"
								validators={{
									onDynamic: ({ value }) =>
										value ? undefined : inquiryCopy.validation.privacy,
								}}
							>
								{(field) => {
									const error = field.state.meta.errors[0];
									return (
										<div>
											<div className="flex items-start gap-3">
												<Checkbox
													aria-describedby={
														error ? `${field.name}-error` : undefined
													}
													aria-invalid={Boolean(error)}
													checked={field.state.value}
													id={field.name}
													onBlur={field.handleBlur}
													onCheckedChange={(checked) =>
														field.handleChange(checked === true)
													}
												/>
												<Label
													className="text-sm leading-6 font-normal"
													htmlFor={field.name}
												>
													{inquiryCopy.privacyPrefix}{" "}
													<button
														className="font-medium text-primary underline underline-offset-4 disabled:cursor-not-allowed"
														disabled
														title={inquiryCopy.privacyLater}
														type="button"
													>
														{inquiryCopy.privacyLink}
													</button>{" "}
													{inquiryCopy.privacySuffix}
												</Label>
											</div>
											{error ? (
												<p
													className="mt-2 text-sm text-destructive"
													id={`${field.name}-error`}
												>
													{String(error)}
												</p>
											) : null}
										</div>
									);
								}}
							</form.Field>

							{submissionState === "server-error" ? (
								<p aria-live="polite" className="text-sm text-destructive">
									{inquiryCopy.serverError}
								</p>
							) : null}

							<form.Subscribe selector={(state) => state.isSubmitting}>
								{(isSubmitting) => (
									<Button
										className="h-10 w-full"
										disabled={isSubmitting}
										type="submit"
									>
										{isSubmitting ? (
											<LoaderCircle
												aria-hidden="true"
												className="animate-spin motion-reduce:animate-none"
											/>
										) : null}
										{isSubmitting ? inquiryCopy.submitting : inquiryCopy.submit}
									</Button>
								)}
							</form.Subscribe>
						</form>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
