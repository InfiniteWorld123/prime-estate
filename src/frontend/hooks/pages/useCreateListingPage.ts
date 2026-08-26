import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useBlocker, useNavigate, useParams } from "@tanstack/react-router";
import { useRef, useState } from "react";

import type { AdminListingDetailRecord } from "@/frontend/features/listings/admin-listing.types";
import { createListingSlug } from "@/frontend/features/listings/listing-slug";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import {
	addDemoListing,
	getDemoListings,
	getDemoProperties,
	getDemoPropertyFeatures,
	getDemoPropertyImages,
} from "@/frontend/pages/admin/demo/admin-demo-workspace";
import { createListingCopy } from "@/frontend/pages/admin/listings/create/create-listing.copy";
import { getListingCreationPrefill } from "@/frontend/pages/admin/listings/create/create-listing.model";
import { getListingTypeAvailability } from "@/frontend/pages/admin/listings/select-listing-property.model";

const wait = (milliseconds: number) =>
	new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function useCreateListingPage() {
	const { language } = useLanguage();
	const copy = createListingCopy[language];
	const { propertyId } = useParams({ strict: false }) as { propertyId: string };
	const navigate = useNavigate();
	const allowNavigationRef = useRef(false);
	const [isDirty, setIsDirty] = useState(false);
	const property = getDemoProperties().find((item) => item.id === propertyId);
	if (!property)
		throw new Error("Property is unavailable in the demo workspace");
	const referenceNumber = property.referenceNumber;
	const demoListings = getDemoListings();
	const availability = getListingTypeAvailability(property.id, demoListings);
	const prefill = getListingCreationPrefill(property.id, demoListings);

	const blocker = useBlocker({
		enableBeforeUnload: isDirty,
		shouldBlockFn: () => isDirty && !allowNavigationRef.current,
		withResolver: true,
	});

	const form = useForm({
		defaultValues: {
			description: prefill?.sourceListing.description ?? "",
			listingType: prefill?.targetType ?? ("" as "" | "RENT" | "SALE"),
			price: "",
			seoDescription: "",
			seoTitle: "",
			showExactAddress: prefill?.sourceListing.showExactAddress ?? false,
			slug: "",
			title: prefill?.sourceListing.title ?? "",
		},
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmitInvalid: () =>
			window.requestAnimationFrame(() =>
				document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
			),
		onSubmit: async ({ value }) => {
			await wait(700);
			const listingId = `listing-${crypto.randomUUID()}`;
			const now = new Date().toISOString();
			const title = value.title.trim() || null;
			const propertyImages = getDemoPropertyImages(property.id);
			const coverImage =
				propertyImages.find((image) => image.isCover)?.url ??
				property.coverImage;
			const listing: AdminListingDetailRecord = {
				archiveOutcome: null,
				archivedAt: null,
				coverImage,
				createdAt: now,
				currencyCode: "EUR",
				description: value.description.trim() || null,
				features: getDemoPropertyFeatures(property.id),
				id: listingId,
				images:
					propertyImages.length > 0
						? propertyImages
						: coverImage
							? [
									{
										altText: title,
										id: `${property.id}-cover`,
										isCover: true,
										url: coverImage,
									},
								]
							: [],
				listingType: value.listingType as "RENT" | "SALE",
				priceAmount: value.price.trim() ? Number(value.price) : null,
				property: {
					city: property.city,
					houseNumber: property.houseNumber,
					id: property.id,
					livingArea: property.livingArea,
					postalCode: property.postalCode,
					propertyType: property.propertyType,
					referenceNumber: property.referenceNumber,
					rooms: property.rooms,
					streetName: property.streetName,
				},
				publishedAt: null,
				seoDescription: value.seoDescription.trim() || null,
				seoTitle: value.seoTitle.trim() || null,
				showExactAddress: value.showExactAddress,
				slug:
					value.slug.trim() ||
					createListingSlug(value.title.trim()) ||
					"listing",
				status: "DRAFT",
				title,
				updatedAt: now,
			};
			addDemoListing(listing);
			allowNavigationRef.current = true;
			setIsDirty(false);
			void navigate({
				params: { listingId },
				to: "/admin/listings/$listingId",
			});
		},
	});

	return {
		availability,
		blocker,
		copy,
		finishLater: () => {
			allowNavigationRef.current = true;
			void navigate({
				params: { propertyId },
				search: { edit: undefined },
				to: "/admin/properties/$propertyId",
			});
		},
		form,
		markDirty: () => setIsDirty(true),
		property,
		propertyId,
		prefill,
		referenceNumber,
	};
}
