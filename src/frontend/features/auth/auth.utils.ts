export const PENDING_PASSWORD_RESET_EMAIL_KEY =
	"prime-estate-pending-password-reset-email";

export const isValidEmail = (value: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidOtp = (value: string) => /^\d{6}$/.test(value.trim());

export const passwordChecks = (value: string) => [
	value.length >= 12,
	/[A-Z]/.test(value),
	/[0-9]/.test(value),
	/[^A-Za-z0-9]/.test(value),
];

export const isValidPassword = (value: string) =>
	passwordChecks(value).every(Boolean);

export const maskEmail = (email: string) => {
	const [localPart, domain] = email.split("@");
	if (!localPart || !domain) return email;
	const visible = localPart.slice(0, Math.min(2, localPart.length));
	return `${visible}${"•".repeat(Math.max(3, localPart.length - visible.length))}@${domain}`;
};
