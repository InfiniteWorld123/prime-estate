import { Link } from "@tanstack/react-router";
import {
	CircleCheck,
	Globe2,
	LoaderCircle,
	Mail,
	MapPin,
	MessageCircle,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import { Textarea } from "@/frontend/components/ui/textarea";
import type {
	ContactSubmissionState,
	useContactPage,
} from "@/frontend/hooks/pages/useContactPage";
import type { marketingPagesCopy } from "@/frontend/i18n/marketing-pages.copy";

type ContactCopy =
	(typeof marketingPagesCopy)[keyof typeof marketingPagesCopy]["contact"];

type ContactMainSectionProps = {
	copy: ContactCopy;
	emailPattern: RegExp;
	fieldLimits: ReturnType<typeof useContactPage>["fieldLimits"];
	form: ReturnType<typeof useContactPage>["form"];
	phonePattern: RegExp;
	resetForm: () => void;
	submissionState: ContactSubmissionState;
};

const infoIcons = [Mail, Globe2, MapPin, MessageCircle];

export function ContactMainSection({
	copy,
	emailPattern,
	fieldLimits,
	form,
	phonePattern,
	resetForm,
	submissionState,
}: ContactMainSectionProps) {
	const infoItems = [
		{
			label: copy.emailLabel,
			value: "yamanwarda06@gmail.com",
			href: "mailto:yamanwarda06@gmail.com",
		},
		{
			label: copy.websiteLabel,
			value: "yamanwarda.dev",
			href: "https://yamanwarda.dev",
		},
		{ label: copy.locationLabel, value: copy.location },
		{ label: copy.responseLabel, value: copy.response },
	];

	return (
		<section className="py-16 sm:py-24">
			<div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-16 lg:px-8">
				<div className="rounded-lg border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
					{submissionState === "success" ? (
						<div className="flex min-h-[34rem] flex-col items-start justify-center">
							<span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
								<CircleCheck aria-hidden="true" className="size-7" />
							</span>
							<h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em]">
								{copy.successTitle}
							</h2>
							<p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
								{copy.successDescription}
							</p>
							<Button
								className="mt-8 h-10 px-4"
								onClick={resetForm}
								type="button"
							>
								{copy.sendAnother}
							</Button>
						</div>
					) : (
						<>
							<h2 className="text-2xl font-semibold tracking-[-0.025em]">
								{copy.formTitle}
							</h2>
							<p className="mt-3 text-sm leading-6 text-muted-foreground">
								{copy.formDescription}
							</p>

							<form
								className="mt-8 space-y-5"
								onSubmit={(event) => {
									event.preventDefault();
									event.stopPropagation();
									void form.handleSubmit();
								}}
							>
								<form.Field name="website">
									{(field) => (
										<input
											aria-hidden="true"
											autoComplete="off"
											className="absolute -left-[10000px] h-px w-px overflow-hidden"
											name={field.name}
											onChange={(event) =>
												field.handleChange(event.target.value)
											}
											tabIndex={-1}
											value={field.state.value}
										/>
									)}
								</form.Field>
								<div className="grid gap-5 sm:grid-cols-2">
									<form.Field
										name="fullName"
										validators={{
											onDynamic: ({ value }) =>
												value.trim().length > fieldLimits.fullName
													? copy.validation.fullNameLength
													: value.trim()
														? undefined
														: copy.validation.fullName,
										}}
									>
										{(field) => (
											<TextField
												error={field.state.meta.errors[0]}
												id={field.name}
												label={copy.fullName}
												maxLength={fieldLimits.fullName}
												onBlur={field.handleBlur}
												onChange={field.handleChange}
												placeholder={copy.fullNamePlaceholder}
												value={field.state.value}
											/>
										)}
									</form.Field>
									<form.Field
										name="email"
										validators={{
											onDynamic: ({ value }) =>
												value.trim().length <= fieldLimits.email &&
												emailPattern.test(value.trim())
													? undefined
													: copy.validation.email,
										}}
									>
										{(field) => (
											<TextField
												autoComplete="email"
												error={field.state.meta.errors[0]}
												id={field.name}
												label={copy.email}
												maxLength={fieldLimits.email}
												onBlur={field.handleBlur}
												onChange={field.handleChange}
												placeholder={copy.emailPlaceholder}
												type="email"
												value={field.state.value}
											/>
										)}
									</form.Field>
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<form.Field
										name="phone"
										validators={{
											onDynamic: ({ value }) =>
												!value.trim() || phonePattern.test(value.trim())
													? undefined
													: copy.validation.phone,
										}}
									>
										{(field) => (
											<TextField
												error={field.state.meta.errors[0]}
												id={field.name}
												label={`${copy.phone} · ${copy.optional}`}
												maxLength={fieldLimits.phone}
												onBlur={field.handleBlur}
												onChange={field.handleChange}
												placeholder={copy.phonePlaceholder}
												type="tel"
												value={field.state.value}
											/>
										)}
									</form.Field>
									<form.Field
										name="interest"
										validators={{
											onDynamic: ({ value }) =>
												value ? undefined : copy.validation.interest,
										}}
									>
										{(field) => {
											const error = field.state.meta.errors[0];
											return (
												<div className="space-y-2">
													<Label htmlFor={field.name}>{copy.interest}</Label>
													<Select
														onValueChange={field.handleChange}
														value={field.state.value}
													>
														<SelectTrigger
															aria-invalid={Boolean(error)}
															className="h-11 w-full"
															id={field.name}
														>
															<SelectValue
																placeholder={copy.interestPlaceholder}
															/>
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="buying">
																{copy.buying}
															</SelectItem>
															<SelectItem value="renting">
																{copy.renting}
															</SelectItem>
															<SelectItem value="general">
																{copy.general}
															</SelectItem>
														</SelectContent>
													</Select>
													{error ? (
														<FieldError
															id={`${field.name}-error`}
															message={String(error)}
														/>
													) : null}
												</div>
											);
										}}
									</form.Field>
								</div>

								<form.Field
									name="message"
									validators={{
										onDynamic: ({ value }) =>
											!value.trim()
												? copy.validation.message
												: value.trim().length > fieldLimits.message
													? copy.validation.messageLength
													: undefined,
									}}
								>
									{(field) => {
										const error = field.state.meta.errors[0];
										return (
											<div className="space-y-2">
												<Label htmlFor={field.name}>{copy.message}</Label>
												<Textarea
													aria-describedby={
														error ? `${field.name}-error` : undefined
													}
													aria-invalid={Boolean(error)}
													className="min-h-36 resize-y"
													id={field.name}
													maxLength={fieldLimits.message}
													onBlur={field.handleBlur}
													onChange={(event) =>
														field.handleChange(event.target.value)
													}
													placeholder={copy.messagePlaceholder}
													value={field.state.value}
												/>
												{error ? (
													<FieldError
														id={`${field.name}-error`}
														message={String(error)}
													/>
												) : null}
											</div>
										);
									}}
								</form.Field>

								<form.Field
									name="privacyAccepted"
									validators={{
										onDynamic: ({ value }) =>
											value ? undefined : copy.validation.privacy,
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
														{copy.privacyPrefix}{" "}
														<Link
															className="font-medium text-primary underline underline-offset-4"
															to="/privacy"
														>
															{copy.privacyLink}
														</Link>{" "}
														{copy.privacySuffix}
													</Label>
												</div>
												{error ? (
													<FieldError
														id={`${field.name}-error`}
														message={String(error)}
													/>
												) : null}
											</div>
										);
									}}
								</form.Field>

								{submissionState === "server-error" ? (
									<p
										aria-live="polite"
										className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
									>
										{copy.serverError}
									</p>
								) : null}
								<form.Subscribe selector={(state) => state.isSubmitting}>
									{(isSubmitting) => (
										<Button
											className="h-11 w-full sm:w-auto sm:px-6"
											disabled={isSubmitting}
											type="submit"
										>
											{isSubmitting ? (
												<LoaderCircle
													aria-hidden="true"
													className="animate-spin motion-reduce:animate-none"
												/>
											) : null}
											{isSubmitting ? copy.submitting : copy.submit}
										</Button>
									)}
								</form.Subscribe>
							</form>
						</>
					)}
				</div>

				<aside className="self-start rounded-lg border bg-muted/35 p-6 sm:p-8 lg:sticky lg:top-24">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
						{copy.infoEyebrow}
					</p>
					<h2 className="mt-4 text-2xl font-semibold">{copy.infoTitle}</h2>
					<p className="mt-3 text-sm leading-6 text-muted-foreground">
						{copy.infoDescription}
					</p>
					<div className="mt-8 border-t">
						{infoItems.map((item, index) => {
							const Icon = infoIcons[index] ?? Mail;
							const value = item.href ? (
								<a
									className="break-all font-medium text-foreground hover:text-primary"
									href={item.href}
									rel={item.href.startsWith("http") ? "noreferrer" : undefined}
									target={item.href.startsWith("http") ? "_blank" : undefined}
								>
									{item.value}
								</a>
							) : (
								<p className="font-medium text-foreground">{item.value}</p>
							);
							return (
								<div
									className="grid grid-cols-[2.5rem_1fr] gap-3 border-b py-5"
									key={item.label}
								>
									<span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
										<Icon aria-hidden="true" className="size-4" />
									</span>
									<div>
										<p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
											{item.label}
										</p>
										<div className="mt-1 text-sm leading-6">{value}</div>
									</div>
								</div>
							);
						})}
					</div>
				</aside>
			</div>
		</section>
	);
}

type TextFieldProps = {
	autoComplete?: string;
	error: unknown;
	id: string;
	label: string;
	maxLength?: number;
	onBlur: () => void;
	onChange: (value: string) => void;
	placeholder: string;
	type?: string;
	value: string;
};

function TextField({
	autoComplete,
	error,
	id,
	label,
	maxLength,
	onBlur,
	onChange,
	placeholder,
	type = "text",
	value,
}: TextFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				aria-describedby={error ? `${id}-error` : undefined}
				aria-invalid={Boolean(error)}
				autoComplete={autoComplete}
				className="h-11"
				id={id}
				maxLength={maxLength}
				onBlur={onBlur}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				type={type}
				value={value}
			/>
			{error ? <FieldError id={`${id}-error`} message={String(error)} /> : null}
		</div>
	);
}

function FieldError({ id, message }: { id: string; message: string }) {
	return (
		<p className="mt-2 text-sm text-destructive" id={id}>
			{message}
		</p>
	);
}
