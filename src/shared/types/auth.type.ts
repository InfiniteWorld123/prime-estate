import type * as v from "valibot";
import type {
	ForgotPasswordSchema,
	ResetPasswordSchema,
	SendVerificationOtpSchema,
	SignInSchema,
	SignUpSchema,
	VerifyEmailSchema,
} from "../../shared/validation/auth.validation";

export type SignUpBodyType = v.InferInput<typeof SignUpSchema>;
export type SignInBodyType = v.InferInput<typeof SignInSchema>;
export type SendVerificationOtpBodyType = v.InferInput<
	typeof SendVerificationOtpSchema
>;
export type VerifyEmailBodyType = v.InferInput<typeof VerifyEmailSchema>;
export type ForgotPasswordBodyType = v.InferInput<typeof ForgotPasswordSchema>;
export type ResetPasswordBodyType = v.InferInput<typeof ResetPasswordSchema>;

export type SignUpServiceType = Omit<SignUpBodyType, "confirmPassword">;
export type SignInServiceType = SignInBodyType;
export type SendVerificationOtpServiceType = SendVerificationOtpBodyType;
export type VerifyEmailServiceType = VerifyEmailBodyType;
export type ForgotPasswordServiceType = ForgotPasswordBodyType;
export type ResetPasswordServiceType = Omit<
	ResetPasswordBodyType,
	"confirmPassword"
>;
