import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import { Label } from "@/frontend/components/ui/label";
import {
	AuthSubmitButton,
	AuthTextField,
	PasswordField,
} from "@/frontend/features/auth/components/AuthFields";
import { AuthShell } from "@/frontend/features/auth/components/AuthShell";
import { useSignInPage } from "@/frontend/hooks/pages/useSignInPage";

export function SignInPage() {
	const { copy, form, isValidEmail, submissionState } = useSignInPage();
	return (
		<AuthShell>
			<div>
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
					Prime Estate
				</p>
				<h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
					{copy.signIn.title}
				</h1>
				<p className="mt-3 text-sm leading-6 text-muted-foreground">
					{copy.signIn.description}
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
					<form.Field
						name="password"
						validators={{
							onDynamic: ({ value }) =>
								value ? undefined : copy.common.validation.passwordRequired,
						}}
					>
						{(field) => (
							<PasswordField
								autoComplete="current-password"
								error={field.state.meta.errors[0]}
								hideLabel={copy.common.hidePassword}
								id={field.name}
								label={copy.common.password}
								onBlur={field.handleBlur}
								onChange={field.handleChange}
								showLabel={copy.common.showPassword}
								value={field.state.value}
							/>
						)}
					</form.Field>
					<div className="flex items-center justify-between gap-4">
						<form.Field name="rememberMe">
							{(field) => (
								<div className="flex items-center gap-2">
									<Checkbox
										checked={field.state.value}
										id={field.name}
										onCheckedChange={(checked) =>
											field.handleChange(checked === true)
										}
									/>
									<Label className="font-normal" htmlFor={field.name}>
										{copy.signIn.remember}
									</Label>
								</div>
							)}
						</form.Field>
						<a
							className="text-sm font-medium text-primary hover:underline"
							href="/admin/forgot-password"
						>
							{copy.signIn.forgot}
						</a>
					</div>
					{submissionState !== "form" ? (
						<div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
							<p className="flex items-start gap-2">
								<AlertCircle
									aria-hidden="true"
									className="mt-0.5 size-4 shrink-0"
								/>
								{submissionState === "unverified"
									? copy.signIn.unverified
									: copy.signIn.error}
							</p>
						</div>
					) : null}
					<form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<AuthSubmitButton
								idleLabel={copy.signIn.submit}
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
