import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { Label } from "@/frontend/components/ui/label";
import {
	AuthFieldError,
	AuthSubmitButton,
	AuthTextField,
	PasswordField,
	PasswordRequirements,
} from "@/frontend/features/auth/components/AuthFields";
import { AuthShell } from "@/frontend/features/auth/components/AuthShell";
import { useSignUpPage } from "@/frontend/hooks/pages/useSignUpPage";

export function SignUpPage() {
	const {
		copy,
		form,
		hasServerError,
		isValidEmail,
		isValidPassword,
		passwordChecks,
	} = useSignUpPage();
	return (
		<AuthShell>
			<div>
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
					Prime Estate
				</p>
				<h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
					{copy.signUp.title}
				</h1>
				<p className="mt-3 text-sm leading-6 text-muted-foreground">
					{copy.signUp.description}
				</p>
				<form
					className="mt-8 space-y-5"
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
								value.trim().length >= 3
									? undefined
									: copy.common.validation.name,
						}}
					>
						{(field) => (
							<AuthTextField
								autoComplete="name"
								error={field.state.meta.errors[0]}
								id={field.name}
								label={copy.signUp.fullName}
								onBlur={field.handleBlur}
								onChange={field.handleChange}
								placeholder={copy.signUp.fullNamePlaceholder}
								value={field.state.value}
							/>
						)}
					</form.Field>
					<form.Field
						name="email"
						validators={{
							onDynamic: ({ value }) =>
								isValidEmail(value) ? undefined : copy.common.validation.email,
						}}
					>
						{(field) => (
							<AuthTextField
								autoComplete="email"
								error={field.state.meta.errors[0]}
								id={field.name}
								label={copy.common.email}
								onBlur={field.handleBlur}
								onChange={field.handleChange}
								placeholder={copy.common.emailPlaceholder}
								type="email"
								value={field.state.value}
							/>
						)}
					</form.Field>
					<form.Field
						name="password"
						validators={{
							onDynamic: ({ value }) =>
								isValidPassword(value)
									? undefined
									: copy.common.passwordRules.join(" · "),
						}}
					>
						{(field) => (
							<div className="space-y-3">
								<PasswordField
									autoComplete="new-password"
									error={field.state.meta.errors[0]}
									hideLabel={copy.common.hidePassword}
									id={field.name}
									label={copy.common.password}
									onBlur={field.handleBlur}
									onChange={field.handleChange}
									showLabel={copy.common.showPassword}
									value={field.state.value}
								/>
								<PasswordRequirements
									checks={passwordChecks(field.state.value)}
									labels={copy.common.passwordRules}
								/>
							</div>
						)}
					</form.Field>
					<form.Field
						name="confirmPassword"
						validators={{
							onDynamic: ({ value, fieldApi }) =>
								value === fieldApi.form.getFieldValue("password")
									? undefined
									: copy.common.validation.confirmPassword,
						}}
					>
						{(field) => (
							<PasswordField
								autoComplete="new-password"
								error={field.state.meta.errors[0]}
								hideLabel={copy.common.hidePassword}
								id={field.name}
								label={copy.signUp.confirmPassword}
								onBlur={field.handleBlur}
								onChange={field.handleChange}
								showLabel={copy.common.showPassword}
								value={field.state.value}
							/>
						)}
					</form.Field>
					<form.Field
						name="termsAccepted"
						validators={{
							onDynamic: ({ value }) =>
								value ? undefined : copy.common.validation.terms,
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
											onCheckedChange={(checked) =>
												field.handleChange(checked === true)
											}
										/>
										<Label
											className="text-sm leading-6 font-normal"
											htmlFor={field.name}
										>
											{copy.signUp.termsPrefix}{" "}
											<Link
												className="font-medium text-primary underline underline-offset-4"
												to="/terms"
											>
												{copy.signUp.terms}
											</Link>{" "}
											{copy.signUp.and}{" "}
											<Link
												className="font-medium text-primary underline underline-offset-4"
												to="/privacy"
											>
												{copy.signUp.privacy}
											</Link>
											.
										</Label>
									</div>
									{error ? (
										<AuthFieldError
											id={`${field.name}-error`}
											message={String(error)}
										/>
									) : null}
								</div>
							);
						}}
					</form.Field>
					{hasServerError ? (
						<p className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
							<AlertCircle aria-hidden="true" className="mt-0.5 size-4" />
							{copy.signUp.error}
						</p>
					) : null}
					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<AuthSubmitButton
								idleLabel={copy.signUp.submit}
								isSubmitting={isSubmitting}
								pendingLabel={copy.common.submitting}
							/>
						)}
					</form.Subscribe>
				</form>
				<p className="mt-6 text-center text-sm text-muted-foreground">
					{copy.signUp.hasAccount}{" "}
					<Link
						className="font-semibold text-primary hover:underline"
						to="/sign-in"
					>
						{copy.signUp.signIn}
					</Link>
				</p>
			</div>
		</AuthShell>
	);
}
