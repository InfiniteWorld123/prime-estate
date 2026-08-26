import { describe, expect, it } from "vitest";

import {
	createFallbackSlug,
	getArchiveOutcomes,
	getPublishBlockers,
} from "./admin-listing-details.model";

describe("admin listing details lifecycle model", () => {
	it("reports only real publication blockers", () => {
		expect(
			getPublishBlockers({
				coverImage: "/cover.jpg",
				description: "Complete description",
				priceAmount: null,
				title: "Complete title",
			}),
		).toEqual(["price"]);
	});

	it("requires a cover image but not features or custom SEO", () => {
		expect(
			getPublishBlockers({
				coverImage: null,
				description: "Complete description",
				priceAmount: 350_000,
				title: "Complete title",
			}),
		).toEqual(["coverImage"]);
	});

	it("limits archive outcomes by listing type", () => {
		expect(getArchiveOutcomes("SALE")).toEqual(["SOLD", "WITHDRAWN"]);
		expect(getArchiveOutcomes("RENT")).toEqual(["RENTED", "WITHDRAWN"]);
	});

	it("creates a backend-compatible fallback slug", () => {
		expect(createFallbackSlug("Helle Wohnung in Erfurt!")).toBe(
			"helle-wohnung-in-erfurt",
		);
	});
});
