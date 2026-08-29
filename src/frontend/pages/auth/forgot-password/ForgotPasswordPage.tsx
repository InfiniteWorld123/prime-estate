import { Link } from "@tanstack/react-router";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
	AuthSubmitButton,
	AuthTextField,
} from "@/frontend/features/auth/components/AuthFields";
import { AuthShell } from "@/frontend/features/auth/components/AuthShell";
import { useForgotPasswordPage } from "@/frontend/hooks/pages/useForgotPasswordPage";

export function ForgotPasswordPage() {
	const { copy, form, isValidEmail, submissionState } = useForgotPasswordPage();
	if (submissionState === "success")
		return (
			<AuthShell variant="card">
				<div className="text-center">
					<span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
						<MailCheck aria-hidden="true" className="size-7" />
					</span>
					<h1 className="mt-6 text-3xl font-semibold tracking-[-0.035em]">
						{copy.forgot.sentTitle}
					</h1>
					<p className="mt-4 text-sm leading-6 text-muted-foreground">
						{copy.forgot.sentDescription}
					</p>
					<Button asChild className="mt-8 h-11 w-full">
						<Link to="/admin/reset-password">{copy.forgot.continue}</Link>
					</Button>
				</div>
			</AuthShell>
		);
	return (
		<AuthShell variant="card">
			<div>
				<Link
					className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
					to="/admin/login"
				>
					<ArrowLeft aria-hidden="true" className="size-4" />
					{copy.forgot.back}
				</Link>
				<h1 className="mt-8 text-3xl font-semibold tracking-[-0.035em]">
					{copy.forgot.title}
				</h1>
				<p className="mt-3 text-sm leading-6 text-muted-foreground">
					{copy.forgot.description}
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
					{submissionState === "error" ? (
						<p className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
							{copy.forgot.error}
						</p>
					) : null}
					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<AuthSubmitButton
								idleLabel={copy.forgot.submit}
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
