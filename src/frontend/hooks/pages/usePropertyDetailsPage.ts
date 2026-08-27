import { useMemo, useState } from "react";
import { ApiRequestError } from "@/frontend/api/utils";
import { usePublicListingQuery } from "@/frontend/features/listings/hooks/usePublicListingQuery";
import type {
	PropertyDetailListing,
	PropertyDetailsPreviewState,
} from "@/frontend/features/listings/listing.types";
import { toPropertyDetailListing } from "@/frontend/features/listings/public-listing.mapper";

const brokenImageSource = "/images/properties/unavailable-property-image.jpg";

function applyPreview(
	listing: PropertyDetailListing,
	state: PropertyDetailsPreviewState,
) {
	if (state === "sold")
		return { ...listing, archiveOutcome: "SOLD" as const, isAvailable: false };
	if (state === "rented")
		return {
			...listing,
			listingType: "RENT" as const,
			archiveOutcome: "RENTED" as const,
			isAvailable: false,
		};
	if (state === "missing-image")
		return {
			...listing,
			images: listing.images.map((image, index) =>
				index === 0 ? { ...image, src: brokenImageSource } : image,
			),
		};
	if (state === "all-images-missing") return { ...listing, images: [] };
	return listing;
}

export function usePropertyDetailsPage(slug: string) {
	const query = usePublicListingQuery(slug);
	const [previewState, setPreviewState] =
		useState<PropertyDetailsPreviewState>("ready");
	const isPreviewLoading = previewState === "loading";
	const isPreviewError = previewState === "error";
	const isPreviewNotFound = previewState === "not-found";
	const isNotFound =
		isPreviewNotFound ||
		(query.error instanceof ApiRequestError && query.error.status === 404);
	const isLoading = query.isPending || isPreviewLoading;
	const isError =
		isPreviewError || (query.isError && !isNotFound && !query.data);
	const listing = useMemo(() => {
		if (!query.data || isLoading || isError || isNotFound) return null;
		return applyPreview(toPropertyDetailListing(query.data), previewState);
	}, [isError, isLoading, isNotFound, previewState, query.data]);

	return {
		hasBackgroundError:
			previewState === "background-error" ||
			(query.isError && Boolean(query.data)),
		isError,
		isInitialLoading: query.isPending,
		isLoading,
		isNotFound,
		listing,
		previewState,
		retry: query.refetch,
		setPreviewState,
	};
}
