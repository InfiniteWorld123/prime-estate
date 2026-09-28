import { Elysia } from "elysia";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	listListings: vi.fn(),
	getListingBySlug: vi.fn(),
	listFeatures: vi.fn(),
}));

vi.mock("./public-listing.service", () => ({
	listPublicListingsService: mocks.listListings,
	getPublicListingBySlugService: mocks.getListingBySlug,
	listPublicFeaturesService: mocks.listFeatures,
}));

import { AppError } from "#/backend/shared/error";
import { handleError } from "#/backend/shared/error-handler";
import { publicListingRoutes } from "./public-listing.route";

// Cloudflare Workers run Elysia without AOT compilation (see `app.ts`), so
// validated params and query must also reach handlers in dynamic mode.
const testApp = new Elysia({ prefix: "/api", aot: false })
	.error({ AppError })
	.onError(handleError)
	.use(publicListingRoutes);

const request = (path: string) =>
	testApp.fetch(new Request(`http://localhost${path}`));

describe("public listing HTTP routes without AOT", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.listListings.mockResolvedValue({ items: [] });
		mocks.getListingBySlug.mockResolvedValue({ slug: "helle-wohnung" });
	});

	it("passes parsed filters to the listing search", async () => {
		const response = await request(
			"/api/listings?city=%20Jena%20&listing_type=RENT&page=2&min_rooms=2.5",
		);

		expect(response.status).toBe(200);
		expect(mocks.listListings).toHaveBeenCalledWith({
			city: "Jena",
			listing_type: "RENT",
			page: 2,
			min_rooms: 2.5,
		});
	});

	it("passes the slug to the listing detail lookup", async () => {
		const response = await request("/api/listings/helle-wohnung");

		expect(response.status).toBe(200);
		expect(mocks.getListingBySlug).toHaveBeenCalledWith("helle-wohnung");
	});
});
