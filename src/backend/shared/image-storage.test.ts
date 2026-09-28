import { describe, expect, it, vi } from "vitest";

vi.mock("#/shared/env", () => ({
	env: {
		CLOUDINARY_CLOUD_NAME: "demo-cloud",
		CLOUDINARY_API_KEY: "demo-key",
		CLOUDINARY_API_SECRET: "demo-secret",
	},
}));

import { getStoredImageUrl } from "./image-storage";

describe("getStoredImageUrl", () => {
	it("builds an optimized delivery URL without SDK analytics", () => {
		expect(getStoredImageUrl("v12/prime-estate/seed/cover")).toBe(
			"https://res.cloudinary.com/demo-cloud/image/upload/f_auto,q_auto/v12/prime-estate/seed/cover",
		);
	});
});
