import { Link } from "@tanstack/react-router";
import { CircleCheck, LoaderCircle, MailCheck } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
	AuthSubmitButton,
	AuthTextField,
} from "@/frontend/features/auth/components/AuthFields";
import { AuthShell } from "@/frontend/features/auth/components/AuthShell";
import { useVerifyEmailPage } from "@/frontend/hooks/pages/useVerifyEmailPage";

export function VerifyEmailPage() {
	const {
		copy,
		editEmail,
		form,
		isResending,
		isValidEmail,
		isValidOtp,
		maskedEmail,
		rememberedEmail,
		resendCode,
		resent,
		setEditEmail,
		submissionState,
	} = useVerifyEmailPage();
	if (submissionState === "success")
		return (
			<AuthShell variant="card">
				<div className="text-center">
					<span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
						<CircleCheck aria-hidden="true" className="size-7" />
					</span>
					<h1 className="mt-6 text-3xl font-semibold tracking-[-0.035em]">
						{copy.verify.successTitle}
					</h1>
					<p className="mt-4 text-sm leading-6 text-muted-foreground">
						{copy.verify.successDescription}
					</p>
					<Button asChild className="mt-8 h-11 w-full">
						<Link to="/sign-in">{copy.verify.signIn}</Link>
					</Button>
				</div>
			</AuthShell>
		);
	const description =
		rememberedEmail && !editEmail
			? copy.verify.description.replace("{email}", maskedEmail)
			: copy.verify.directDescription;
	return (
		<AuthShell variant="card">
			<div>
				<span className="grid size-12 place-items-center rounded-md bg-primary/10 text-primary">
					<MailCheck aria-hidden="true" className="size-5" />
				</span>
				<h1 className="mt-6 text-3xl font-semibold tracking-[-0.035em]">
					{copy.verify.title}
				</h1>
				<p className="mt-3 text-sm leading-6 text-muted-foreground">
					{description}
				</p>
				<form
					className="mt-8 space-y-5"
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						void form.handleSubmit();
					}}
				>
					{editEmail ? (
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
								label={copy.verify.code}
								maxLength={6}
								onBlur={field.handleBlur}
								onChange={(value) =>
									field.handleChange(value.replace(/\D/g, "").slice(0, 6))
								}
								placeholder={copy.verify.codePlaceholder}
								value={field.state.value}
							/>
						)}
					</form.Field>
					{submissionState === "error" ? (
						<p className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
							{copy.verify.error}
						</p>
					) : null}
					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<AuthSubmitButton
								idleLabel={copy.verify.submit}
								isSubmitting={isSubmitting}
								pendingLabel={copy.common.submitting}
							/>
						)}
					</form.Subscribe>
				</form>
				<div className="mt-6 flex flex-col items-start justify-between gap-3 border-t pt-5 sm:flex-row sm:items-center">
					<Button
						className="px-0"
						disabled={isResending}
						onClick={() => void resendCode()}
						type="button"
						variant="link"
					>
						{isResending ? (
							<LoaderCircle
								aria-hidden="true"
								className="animate-spin motion-reduce:animate-none"
							/>
						) : null}
						{isResending ? copy.verify.resending : copy.verify.resend}
					</Button>
					{rememberedEmail && !editEmail ? (
						<Button
							className="px-0"
							onClick={() => setEditEmail(true)}
							type="button"
							variant="link"
						>
							{copy.verify.changeEmail}
						</Button>
					) : null}
				</div>
				{resent ? (
					<p aria-live="polite" className="mt-3 text-sm text-primary">
						{copy.verify.resent}
					</p>
				) : null}
			</div>
		</AuthShell>
	);
}
