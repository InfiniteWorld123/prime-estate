import { useEffect, useMemo, useState } from "react";
import type {
	PropertyDetailListing,
	PropertyDetailsPreviewState,
} from "@/frontend/features/listings/listing.types";
import { mockPropertyDetail } from "@/frontend/pages/marketing/property-details/property-details.mock";

const brokenImageSource = "/images/properties/unavailable-property-image.jpg";

function createPreviewListing(
	previewState: PropertyDetailsPreviewState,
): PropertyDetailListing {
	if (previewState === "sold") {
		return {
			...mockPropertyDetail,
			archiveOutcome: "SOLD",
			isAvailable: false,
			archivedAt: "2026-08-23T10:00:00.000Z",
		};
	}

	if (previewState === "rented") {
		return {
			...mockPropertyDetail,
			listingType: "RENT",
			price: 1450,
			archiveOutcome: "RENTED",
			isAvailable: false,
			archivedAt: "2026-08-23T10:00:00.000Z",
		};
	}

	if (previewState === "missing-image") {
		return {
			...mockPropertyDetail,
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
			...mockPropertyDetail,
			images: mockPropertyDetail.images.map((image) => ({
				...image,
				src: brokenImageSource,
			})),
		};
	}

	return mockPropertyDetail;
}

export function usePropertyDetailsPage() {
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [previewState, setPreviewState] =
		useState<PropertyDetailsPreviewState>("ready");

	useEffect(() => {
		const loadingTimer = window.setTimeout(() => {
			setIsInitialLoading(false);
		}, 650);

		return () => window.clearTimeout(loadingTimer);
	}, []);

	const listing = useMemo(() => {
		if (
			isInitialLoading ||
			previewState === "loading" ||
			previewState === "error" ||
			previewState === "not-found"
		) {
			return null;
		}

		return createPreviewListing(previewState);
	}, [isInitialLoading, previewState]);

	return {
		isInitialLoading,
		listing,
		previewState,
		retry: () => setPreviewState("ready"),
		setPreviewState,
	};
}
