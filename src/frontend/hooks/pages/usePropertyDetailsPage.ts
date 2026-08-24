import { useEffect, useMemo, useState } from "react";
import type {
	PropertyDetailListing,
	PropertyDetailsPreviewState,
} from "@/frontend/features/listings/listing.types";
import { mockPropertyDetail } from "@/frontend/pages/marketing/property-details/property-details.mock";

const brokenImageSource = "/images/properties/unavailable-property-image.jpg";

function createPreviewListing(
	previewState: PropertyDetailsPreviewState,
	slug: string,
): PropertyDetailListing {
	const listing = { ...mockPropertyDetail, slug };

	if (previewState === "sold") {
		return {
			...listing,
			archiveOutcome: "SOLD",
			isAvailable: false,
			archivedAt: "2026-08-23T10:00:00.000Z",
		};
	}

	if (previewState === "rented") {
		return {
			...listing,
			listingType: "RENT",
			price: 1450,
			archiveOutcome: "RENTED",
			isAvailable: false,
			archivedAt: "2026-08-23T10:00:00.000Z",
		};
	}

	if (previewState === "missing-image") {
		return {
			...listing,
			images: mockPropertyDetail.images.map((image, index) =>
				index === 0
					? {
							...image,
							src: brokenImageSource,
						}
					: image,
			),
		};
	}

	if (previewState === "all-images-missing") {
		return {
			...listing,
			images: [],
		};
	}

	return listing;
}

export function usePropertyDetailsPage(slug: string) {
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [previewState, setPreviewState] =
		useState<PropertyDetailsPreviewState>("ready");

	useEffect(() => {
		const loadingTimer = window.setTimeout(() => {
			setIsInitialLoading(false);
		}, 650);

		return () => window.clearTimeout(loadingTimer);
	}, []);

	const isLoading = isInitialLoading || previewState === "loading";
	const isError = previewState === "error";
	const isNotFound = previewState === "not-found";
	const listing = useMemo(() => {
		if (isLoading || isError || isNotFound) {
			return null;
		}

		return createPreviewListing(previewState, slug);
	}, [isError, isLoading, isNotFound, previewState, slug]);

	return {
		hasBackgroundError: previewState === "background-error",
		isError,
		isInitialLoading,
		isLoading,
		isNotFound,
		listing,
		previewState,
		retry: () => setPreviewState("ready"),
		setPreviewState,
	};
}
