import { describe, expect, it } from "vitest";

import { unwrapApiResult } from "./utils";

describe("unwrapApiResult", () => {
	it("returns successful response data", () => {
		expect(
			unwrapApiResult({ data: { id: "one" }, error: null }, "fallback"),
		).toEqual({ id: "one" });
	});

	it("preserves a nested backend status and message", () => {
		expect(() =>
			unwrapApiResult(
				{
					data: null,
					error: {
						status: 401,
						value: { message: "Authentication required" },
					},
				},
				"fallback",
			),
		).toThrow(
			expect.objectContaining({
				message: "Authentication required",
				status: 401,
			}),
		);
	});
});
