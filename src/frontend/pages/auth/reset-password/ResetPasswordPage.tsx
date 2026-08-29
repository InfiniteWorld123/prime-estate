import { Link } from "@tanstack/react-router";
import { CircleCheck } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
	AuthSubmitButton,
	AuthTextField,
	PasswordField,
	PasswordRequirements,
} from "@/frontend/features/auth/components/AuthFields";
import { AuthShell } from "@/frontend/features/auth/components/AuthShell";
import { useResetPasswordPage } from "@/frontend/hooks/pages/useResetPasswordPage";

export function ResetPasswordPage() {
	const {
		copy,
		form,
		hasRememberedEmail,
		isValidEmail,
		isValidOtp,
		isValidPassword,
		passwordChecks,
		submissionState,
	} = useResetPasswordPage();
	if (submissionState === "success")
		return (
			<AuthShell variant="card">
				<div className="text-center">
					<span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
						<CircleCheck aria-hidden="true" className="size-7" />
					</span>
					<h1 className="mt-6 text-3xl font-semibold tracking-[-0.035em]">
						{copy.reset.successTitle}
					</h1>
					<p className="mt-4 text-sm leading-6 text-muted-foreground">
						{copy.reset.successDescription}
					</p>
					<Button asChild className="mt-8 h-11 w-full">
						<Link to="/admin/login">{copy.reset.signIn}</Link>
					</Button>
				</div>
			</AuthShell>
		);
	return (
		<AuthShell variant="card">
			<div>
				<h1 className="text-3xl font-semibold tracking-[-0.035em]">
					{copy.reset.title}
				</h1>
				<p className="mt-3 text-sm leading-6 text-muted-foreground">
					{copy.reset.description}
				</p>
				<form
					className="mt-8 space-y-5"
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						void form.handleSubmit();
					}}
				>
					{!hasRememberedEmail ? (
						<form.Field
							name="email"
							validators={{
								onDynamic: ({ value }) =>
									isValidEmail(value)
										? undefined
										: copy.common.validation.email,
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
					) : null}
					<form.Field
						name="otp"
						validators={{
							onDynamic: ({ value }) =>
								isValidOtp(value) ? undefined : copy.common.validation.otp,
						}}
					>
						{(field) => (
							<AuthTextField
								autoComplete="one-time-code"
								error={field.state.meta.errors[0]}
								id={field.name}
								inputMode="numeric"
								label={copy.reset.code}
								maxLength={6}
								onBlur={field.handleBlur}
								onChange={(value) =>
									field.handleChange(value.replace(/\D/g, "").slice(0, 6))
								}
								placeholder="000000"
								value={field.state.value}
							/>
						)}
					</form.Field>
					<form.Field
						name="newPassword"
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
									label={copy.reset.newPassword}
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
								value === fieldApi.form.getFieldValue("newPassword")
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
								label={copy.reset.confirmPassword}
								onBlur={field.handleBlur}
								onChange={field.handleChange}
								showLabel={copy.common.showPassword}
								value={field.state.value}
							/>
						)}
					</form.Field>
					{submissionState === "error" ? (
						<div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
							<p>{copy.reset.error}</p>
							<Link
								className="mt-2 inline-block font-medium underline underline-offset-4"
								to="/admin/forgot-password"
							>
								{copy.reset.newCode}
							</Link>
						</div>
					) : null}
					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<AuthSubmitButton
								idleLabel={copy.reset.submit}
								isSubmitting={isSubmitting}
								pendingLabel={copy.common.submitting}
							/>
						)}
					</form.Subscribe>
				</form>
			</div>
		</AuthShell>
	);
}
