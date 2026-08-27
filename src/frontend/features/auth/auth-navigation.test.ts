import { describe, expect, it } from "vitest";
import { safeInternalRedirect } from "./auth-navigation";

describe("safeInternalRedirect", () => {
	it("keeps local application destinations", () => {
		expect(safeInternalRedirect("/admin/listings?page=2#results")).toBe(
			"/admin/listings?page=2#results",
		);
	});

	it.each([
		"https://example.com/admin",
		"//example.com/admin",
		"javascript:alert(1)",
		"admin/listings",
	])("rejects unsafe destination %s", (destination) => {
		expect(safeInternalRedirect(destination)).toBeNull();
	});
});
