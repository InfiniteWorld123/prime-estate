import { describe, expect, it } from "vitest";
import {
	isValidEmail,
	isValidOtp,
	isValidPassword,
	maskEmail,
} from "./auth.utils";

describe("authentication utilities", () => {
	it("matches the current password contract", () => {
		expect(isValidPassword("SecurePass1!")).toBe(true);
		expect(isValidPassword("short1!A")).toBe(false);
	});

	it("accepts only six digit OTP values", () => {
		expect(isValidOtp("123456")).toBe(true);
		expect(isValidOtp("12345a")).toBe(false);
	});

	it("validates and masks an email for the handoff screen", () => {
		expect(isValidEmail("user@example.com")).toBe(true);
		expect(maskEmail("yaman@example.com")).toBe("ya•••@example.com");
	});
});
