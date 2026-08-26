import { describe, expect, it } from "vitest";

import type { AdminPropertyImage } from "@/frontend/features/listings/admin-listing.types";
import {
	createFeatureCode,
	hasFeatureName,
	movePropertyImage,
	removePropertyImage,
} from "./admin-listing-media.model";

const images: AdminPropertyImage[] = [
	{ altText: null, id: "cover", isCover: true, url: "/cover.jpg" },
	{ altText: null, id: "kitchen", isCover: false, url: "/kitchen.jpg" },
	{ altText: null, id: "garden", isCover: false, url: "/garden.jpg" },
];

describe("admin listing property media model", () => {
	it("reorders images without changing the cover", () => {
		expect(
			movePropertyImage(images, "garden", -1).map((image) => image.id),
		).toEqual(["cover", "garden", "kitchen"]);
		expect(movePropertyImage(images, "garden", -1)[0]?.isCover).toBe(true);
	});

	it("promotes the first remaining image after removing the cover", () => {
		expect(removePropertyImage(images, "cover")).toEqual([
			{ altText: null, id: "kitchen", isCover: true, url: "/kitchen.jpg" },
			{ altText: null, id: "garden", isCover: false, url: "/garden.jpg" },
		]);
	});

	it("normalizes feature codes and detects duplicate names", () => {
		expect(createFeatureCode("  Große Terrasse  ")).toBe("GROSSE_TERRASSE");
		expect(hasFeatureName([{ name: "Garden" }], " garden ")).toBe(true);
	});
});
