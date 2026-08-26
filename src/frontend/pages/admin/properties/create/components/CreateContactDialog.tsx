import { revalidateLogic, useForm } from "@tanstack/react-form";
import { CheckCircle2, LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/frontend/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/frontend/components/ui/dialog";
import type { MockPropertyContact } from "@/frontend/hooks/pages/useCreatePropertyPage";
import type { CreatePropertyCopy } from "../create-property.copy";
import { PropertyFormField } from "./PropertyFormField";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CreateContactDialog({
	copy,
	onCreated,
}: {
	copy: CreatePropertyCopy;
	onCreated: (contact: MockPropertyContact) => void;
}) {
	const [open, setOpen] = useState(false);
	const [serverError, setServerError] = useState(false);
	const form = useForm({
		defaultValues: { company: "", email: "", fullName: "", phone: "" },
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmitInvalid: () =>
			window.requestAnimationFrame(() =>
				document
					.querySelector<HTMLElement>(
						'[data-contact-dialog] [aria-invalid="true"]',
					)
					?.focus(),
			),
		onSubmit: async ({ value }) => {
			setServerError(false);
			await new Promise((resolve) => window.setTimeout(resolve, 550));
			if (value.email.trim().toLowerCase() === "error@prime-estate.test") {
				setServerError(true);
				return;
			}
			onCreated({
				company: value.company.trim() || null,
				email: value.email.trim() || null,
				fullName: value.fullName.trim(),
				id: `contact-${Date.now()}`,
				phone: value.phone.trim() || null,
			});
			form.reset();
			setOpen(false);
		},
	});
	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button type="button" variant="outline">
					<Plus aria-hidden="true" />
					{copy.contact.create}
				</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-lg"
				data-contact-dialog
				closeLabel={copy.cancel}
			>
				<DialogHeader>
					<DialogTitle>{copy.contact.heading}</DialogTitle>
					<DialogDescription>{copy.contact.description}</DialogDescription>
				</DialogHeader>
				<form
					className="grid gap-4"
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
								value.trim() ? undefined : copy.validation.required,
						}}
					>
						{(field) => (
							<PropertyFormField
								autoComplete="name"
								error={field.state.meta.errors[0]}
								id="contact-full-name"
								label={copy.contact.fullName}
								onBlur={field.handleBlur}
								onChange={field.handleChange}
								value={field.state.value}
							/>
						)}
					</form.Field>
					<form.Field name="company">
						{(field) => (
							<PropertyFormField
								autoComplete="organization"
								id="contact-company"
								label={copy.contact.company}
								onBlur={field.handleBlur}
								onChange={field.handleChange}
								value={field.state.value}
							/>
						)}
					</form.Field>
					<div className="grid gap-4 sm:grid-cols-2">
						<form.Field
							name="email"
							validators={{
								onDynamic: ({ value, fieldApi }) => {
									const phone = fieldApi.form.getFieldValue("phone").trim();
									if (!value.trim() && !phone)
										return copy.validation.emailOrPhone;
									return value.trim() && !emailPattern.test(value.trim())
										? copy.contact.email
										: undefined;
								},
							}}
						>
							{(field) => (
								<PropertyFormField
									autoComplete="email"
									error={field.state.meta.errors[0]}
									id="contact-email"
									label={copy.contact.email}
									onBlur={field.handleBlur}
									onChange={field.handleChange}
									type="email"
									value={field.state.value}
								/>
							)}
						</form.Field>
						<form.Field
							name="phone"
							validators={{
								onDynamic: ({ value, fieldApi }) =>
									value.trim() || fieldApi.form.getFieldValue("email").trim()
										? undefined
										: copy.validation.emailOrPhone,
							}}
						>
							{(field) => (
								<PropertyFormField
									autoComplete="tel"
									error={field.state.meta.errors[0]}
									id="contact-phone"
									label={copy.contact.phone}
									onBlur={field.handleBlur}
									onChange={field.handleChange}
									value={field.state.value}
								/>
							)}
						</form.Field>
					</div>
					{serverError ? (
						<p className="text-sm text-destructive" role="alert">
							{copy.serverError}
						</p>
					) : null}
					<DialogFooter className="mt-2">
						<Button
							onClick={() => setOpen(false)}
							type="button"
							variant="outline"
						>
							{copy.cancel}
						</Button>
						<form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) => (
								<Button disabled={isSubmitting} type="submit">
									{isSubmitting ? (
										<LoaderCircle
											aria-hidden="true"
											className="animate-spin motion-reduce:animate-none"
										/>
									) : (
										<CheckCircle2 aria-hidden="true" />
									)}
									{isSubmitting ? copy.creating : copy.contact.create}
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
