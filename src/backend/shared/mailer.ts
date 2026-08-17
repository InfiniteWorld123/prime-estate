import { Resend } from "resend";
import { env } from "../../shared/env";

const resend = new Resend(env.RESEND);

type SendEmailInput = {
	to: string;
	subject: string;
	html: string;
	text?: string;
};

type AuthCodeType =
	| "sign-in"
	| "email-verification"
	| "forget-password"
	| "change-email";

const appName = env.APP_NAME;

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");

export const sendEmail = async ({
	to,
	subject,
	html,
	text,
}: SendEmailInput) => {
	const result = await resend.emails.send({
		from: env.EMAIL_FROM,
		to,
		subject,
		html,
		text,
	});

	if (result.error) {
		console.error("Email delivery failed", {
			name: result.error.name,
			statusCode: result.error.statusCode,
		});
		throw new Error("Email delivery failed");
	}

	return result.data;
};

const baseEmail = ({
	title,
	preview,
	body,
}: {
	title: string;
	preview: string;
	body: string;
}) => {
	const safeTitle = escapeHtml(title);
	const safePreview = escapeHtml(preview);

	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>${safeTitle}</title>
	</head>
	<body style="margin:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
		<div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">${safePreview}</div>
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:32px 16px;">
			<tr>
				<td align="center">
					<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
						<tr>
							<td style="padding:32px;">
								<p style="margin:0 0 20px;font-size:13px;line-height:20px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;">${appName}</p>
								<h1 style="margin:0 0 16px;font-size:24px;line-height:32px;color:#111827;">${safeTitle}</h1>
								${body}
								<p style="margin:32px 0 0;font-size:13px;line-height:20px;color:#6b7280;">
									If you did not request this email, you can safely ignore it.
								</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>`;
};

export const welcomeEmailTemplate = ({ name }: { name?: string }) => {
	const displayName = escapeHtml(name?.trim() || "there");

	return baseEmail({
		title: `Welcome to ${appName}`,
		preview: `Your ${appName} account is ready.`,
		body: `
			<p style="margin:0 0 16px;font-size:16px;line-height:24px;color:#111827;">
				Hi ${displayName},
			</p>
			<p style="margin:0;font-size:16px;line-height:24px;color:#374151;">
				Your email is verified and your account is ready. You can now sign in and start using ${appName}.
			</p>
		`,
	});
};

export const otpEmailTemplate = ({ otp }: { otp: string }) =>
	baseEmail({
		title: "Verify your email",
		preview: "Use this code to verify your email address.",
		body: `
			<p style="margin:0 0 16px;font-size:16px;line-height:24px;color:#374151;">
				Use this verification code to finish setting up your ${appName} account.
			</p>
			<div style="margin:24px 0;padding:16px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;text-align:center;font-size:32px;line-height:40px;letter-spacing:6px;font-weight:700;color:#111827;">
				${escapeHtml(otp)}
			</div>
			<p style="margin:0;font-size:14px;line-height:22px;color:#6b7280;">
				This code expires in 5 minutes.
			</p>
		`,
	});

export const forgotPasswordEmailTemplate = ({ otp }: { otp: string }) =>
	baseEmail({
		title: "Reset your password",
		preview: "Use this code to reset your password.",
		body: `
			<p style="margin:0 0 16px;font-size:16px;line-height:24px;color:#374151;">
				Use this code to reset your ${appName} password.
			</p>
			<div style="margin:24px 0;padding:16px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;text-align:center;font-size:32px;line-height:40px;letter-spacing:6px;font-weight:700;color:#111827;">
				${escapeHtml(otp)}
			</div>
			<p style="margin:0;font-size:14px;line-height:22px;color:#6b7280;">
				This code expires in 5 minutes.
			</p>
		`,
	});

export const resetPasswordEmailTemplate = () =>
	baseEmail({
		title: "Your password was reset",
		preview: `Your ${appName} password was changed.`,
		body: `
			<p style="margin:0;font-size:16px;line-height:24px;color:#374151;">
				Your password was reset successfully. If this was not you, request a new reset code immediately.
			</p>
		`,
	});

export const sendAuthCode = async ({
	email,
	otp,
	type,
}: {
	email: string;
	otp: string;
	type: AuthCodeType;
}) => {
	if (type === "forget-password") {
		return sendEmail({
			to: email,
			subject: `Reset your ${appName} password`,
			html: forgotPasswordEmailTemplate({ otp }),
			text: `Use this code to reset your ${appName} password: ${otp}`,
		});
	}

	return sendEmail({
		to: email,
		subject:
			type === "sign-in"
				? `Your ${appName} sign-in code`
				: `Verify your ${appName} email`,
		html: otpEmailTemplate({ otp }),
		text: `Use this code for ${appName}: ${otp}`,
	});
};

export const sendWelcomeEmail = async ({
	email,
	name,
}: {
	email: string;
	name?: string;
}) => {
	return sendEmail({
		to: email,
		subject: `Welcome to ${appName}`,
		html: welcomeEmailTemplate({ name }),
		text: `Welcome to ${appName}${name ? `, ${name}` : ""}.`,
	});
};

export const sendResetPasswordSuccessEmail = async ({
	email,
}: {
	email: string;
}) => {
	return sendEmail({
		to: email,
		subject: `Your ${appName} password was reset`,
		html: resetPasswordEmailTemplate(),
		text: `Your ${appName} password was reset successfully.`,
	});
};
