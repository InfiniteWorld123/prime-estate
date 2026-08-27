import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useBlocker, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { usePropertyListingDetailsQuery } from "@/frontend/features/listings/hooks/useAdminListingQuery";
import { useCreateListingMutation } from "@/frontend/features/listings/hooks/useListingMutations";
import { useAdminPropertyQuery } from "@/frontend/features/properties/hooks/useAdminPropertyQuery";
import { usePropertyImagesQuery } from "@/frontend/features/properties/hooks/usePropertyImages";
import { toAdminPropertyRecord } from "@/frontend/features/properties/property.mapper";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { createListingCopy } from "@/frontend/pages/admin/listings/create/create-listing.copy";
import { getListingCreationPrefill } from "@/frontend/pages/admin/listings/create/create-listing.model";
import { getListingTypeAvailability } from "@/frontend/pages/admin/listings/select-listing-property.model";

const emptyValues = {
	description: "",
	listingType: "" as "" | "RENT" | "SALE",
	price: "",
	seoDescription: "",
	seoTitle: "",
	showExactAddress: false,
	slug: "",
	title: "",
};

export function useCreateListingPage() {
	const { language } = useLanguage();
	const copy = createListingCopy[language];
	const { propertyId } = useParams({ strict: false }) as { propertyId: string };
	const navigate = useNavigate();
	const allowNavigationRef = useRef(false);
	const hydratedPropertyRef = useRef<string | null>(null);
	const [isDirty, setIsDirty] = useState(false);
	const propertyQuery = useAdminPropertyQuery(propertyId);
	const imagesQuery = usePropertyImagesQuery(propertyId);
	const listingsQuery = usePropertyListingDetailsQuery(propertyId);
	const createMutation = useCreateListingMutation();
	const listingDetails = listingsQuery.data ?? [];
	const prefill = useMemo(
		() => getListingCreationPrefill(propertyId, listingDetails),
		[listingDetails, propertyId],
	);
	const availability = useMemo(
		() => getListingTypeAvailability(propertyId, listingDetails),
		[listingDetails, propertyId],
	);

	const blocker = useBlocker({
		enableBeforeUnload: isDirty,
		shouldBlockFn: () => isDirty && !allowNavigationRef.current,
		withResolver: true,
	});

	const form = useForm({
		defaultValues: emptyValues,
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmitInvalid: () =>
			window.requestAnimationFrame(() =>
				document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
			),
		onSubmit: async ({ value }) => {
			createMutation.reset();
			try {
				const listing = await createMutation.mutateAsync({
					input: {
						description: value.description.trim() || null,
						listing_type: value.listingType as "RENT" | "SALE",
						price_amount: value.price.trim() ? Number(value.price) : null,
						seo_description: value.seoDescription.trim() || null,
						seo_title: value.seoTitle.trim() || null,
						show_exact_address: value.showExactAddress,
						slug: value.slug.trim() || null,
						title: value.title.trim() || null,
					},
					propertyId,
				});
				allowNavigationRef.current = true;
				setIsDirty(false);
				void navigate({
					params: { listingId: listing.id },
					to: "/admin/listings/$listingId",
				});
			} catch {
				// The mutation error is shown next to the form actions.
			}
		},
	});

	useEffect(() => {
		if (
			!propertyQuery.data ||
			listingsQuery.data === undefined ||
			hydratedPropertyRef.current === propertyId
		)
			return;
		const source = getListingCreationPrefill(propertyId, listingsQuery.data);
		form.reset({
			...emptyValues,
			description: source?.sourceListing.description ?? "",
			listingType: source?.targetType ?? "",
			showExactAddress: source?.sourceListing.showExactAddress ?? false,
			title: source?.sourceListing.title ?? "",
		});
		hydratedPropertyRef.current = propertyId;
	}, [form, listingsQuery.data, propertyId, propertyQuery.data]);

	const property = propertyQuery.data
		? {
				...toAdminPropertyRecord(propertyQuery.data),
				coverImage:
					imagesQuery.data?.find((image) => image.is_cover)?.url ?? null,
			}
		: null;

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
		formError: createMutation.error?.message ?? null,
		isLoading:
			propertyQuery.isPending ||
			imagesQuery.isPending ||
			listingsQuery.isPending,
		loadError:
			propertyQuery.error?.message ??
			imagesQuery.error?.message ??
			listingsQuery.error?.message ??
			null,
		markDirty: () => {
			createMutation.reset();
			setIsDirty(true);
		},
		property,
		propertyId,
		prefill,
		refetch: async () => {
			await Promise.all([
				propertyQuery.refetch(),
				imagesQuery.refetch(),
				listingsQuery.refetch(),
			]);
		},
		referenceNumber: property?.referenceNumber ?? "",
	};
}
