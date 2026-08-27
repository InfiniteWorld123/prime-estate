import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useBlocker, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { ApiRequestError } from "@/frontend/api/utils";
import type { AdminListingArchiveOutcome } from "@/frontend/features/listings/admin-listing.types";
import { useAdminListingQuery } from "@/frontend/features/listings/hooks/useAdminListingQuery";
import {
	useArchiveListingMutation,
	useDeleteDraftListingMutation,
	usePublishListingMutation,
	useUpdateListingMutation,
} from "@/frontend/features/listings/hooks/useListingMutations";
import { toAdminListingDetailRecord } from "@/frontend/features/listings/listing.mapper";
import {
	useCreateFeatureMutation,
	useFeatureOptionsQuery,
	useReplacePropertyFeaturesMutation,
} from "@/frontend/features/properties/hooks/usePropertyFeatures";
import {
	type PropertyImageDraft,
	useSavePropertyImagesMutation,
} from "@/frontend/features/properties/hooks/usePropertyImages";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { adminListingDetailsCopy } from "@/frontend/pages/admin/listings/details/admin-listing-details.copy";
import { getArchiveOutcomes } from "@/frontend/pages/admin/listings/details/admin-listing-details.model";

const emptyValues = {
	description: "",
	price: "",
	seoDescription: "",
	seoTitle: "",
	showExactAddress: false,
	slug: "",
	title: "",
};

export function useAdminListingDetailsPage() {
	const { language } = useLanguage();
	const copy = adminListingDetailsCopy[language];
	const { listingId } = useParams({ strict: false }) as { listingId: string };
	const navigate = useNavigate();
	const listingQuery = useAdminListingQuery(listingId);
	const featureOptionsQuery = useFeatureOptionsQuery();
	const updateMutation = useUpdateListingMutation();
	const publishMutation = usePublishListingMutation();
	const archiveMutation = useArchiveListingMutation();
	const deleteMutation = useDeleteDraftListingMutation();
	const createFeatureMutation = useCreateFeatureMutation();
	const replaceFeaturesMutation = useReplacePropertyFeaturesMutation();
	const saveImagesMutation = useSavePropertyImagesMutation();
	const [isDirty, setIsDirty] = useState(false);
	const [feedback, setFeedback] = useState<string | null>(null);
	const [publishOpen, setPublishOpen] = useState(false);
	const [archiveOpen, setArchiveOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [archiveOutcome, setArchiveOutcome] =
		useState<AdminListingArchiveOutcome | null>(null);
	const allowNavigationRef = useRef(false);
	const hydratedListingRef = useRef<string | null>(null);

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
			if (!listingQuery.data) return;
			updateMutation.reset();
			try {
				await updateMutation.mutateAsync({
					input: {
						description: value.description.trim() || null,
						price_amount: value.price.trim() ? Number(value.price) : null,
						seo_description: value.seoDescription.trim() || null,
						seo_title: value.seoTitle.trim() || null,
						show_exact_address: value.showExactAddress,
						slug: value.slug.trim() || null,
						title: value.title.trim() || null,
					},
					listingId,
				});
				setIsDirty(false);
				setFeedback(copy.saved);
			} catch {
				// The mutation error is displayed below the content form.
			}
		},
	});

	useEffect(() => {
		if (!listingQuery.data || hydratedListingRef.current === listingId) return;
		const listing = toAdminListingDetailRecord(listingQuery.data);
		form.reset({
			description: listing.description ?? "",
			price: listing.priceAmount?.toString() ?? "",
			seoDescription: listing.seoDescription ?? "",
			seoTitle: listing.seoTitle ?? "",
			showExactAddress: listing.showExactAddress,
			slug: listing.slug ?? "",
			title: listing.title ?? "",
		});
		hydratedListingRef.current = listingId;
	}, [form, listingId, listingQuery.data]);

	const listing = listingQuery.data
		? toAdminListingDetailRecord(listingQuery.data)
		: null;
	const resetOperationErrors = () => {
		publishMutation.reset();
		archiveMutation.reset();
		deleteMutation.reset();
	};

	const publish = async () => {
		if (!listing || isDirty) return;
		resetOperationErrors();
		try {
			await publishMutation.mutateAsync(listingId);
			setPublishOpen(false);
			setFeedback(copy.published);
		} catch {
			// Keep the confirmation dialog open and expose the server message.
		}
	};

	const archive = async () => {
		if (!listing || !archiveOutcome) return;
		resetOperationErrors();
		try {
			await archiveMutation.mutateAsync({
				input: { archive_outcome: archiveOutcome },
				listingId,
			});
			setArchiveOpen(false);
			setArchiveOutcome(null);
			setFeedback(copy.archived);
		} catch {
			// Keep the confirmation dialog open and expose the server message.
		}
	};

	return {
		archive,
		archiveOpen,
		archiveOutcome,
		archiveOutcomes: listing ? getArchiveOutcomes(listing.listingType) : [],
		availableFeatures:
			featureOptionsQuery.data?.map(({ code, id, name }) => ({
				code,
				id,
				name,
			})) ?? [],
		blocker,
		copy,
		createPropertyFeature: async (name: string) => {
			const feature = await createFeatureMutation.mutateAsync(name);
			return { code: feature.code, id: feature.id, name: feature.name };
		},
		deleteDraft: async () => {
			if (!listing || listing.status !== "DRAFT") return;
			resetOperationErrors();
			try {
				await deleteMutation.mutateAsync(listingId);
				allowNavigationRef.current = true;
				void navigate({ to: "/admin/listings" });
			} catch {
				// Keep the confirmation dialog open and expose the server message.
			}
		},
		deleteOpen,
		feedback,
		form,
		formError: updateMutation.error?.message ?? null,
		isDirty,
		isLifecyclePending:
			publishMutation.isPending ||
			archiveMutation.isPending ||
			deleteMutation.isPending,
		isLoading: listingQuery.isPending || featureOptionsQuery.isPending,
		isNotFound:
			listingQuery.error instanceof ApiRequestError &&
			listingQuery.error.status === 404,
		listing,
		loadError:
			listingQuery.error?.message ?? featureOptionsQuery.error?.message ?? null,
		markDirty: () => {
			updateMutation.reset();
			setFeedback(null);
			setIsDirty(true);
		},
		mediaError:
			saveImagesMutation.error?.message ??
			replaceFeaturesMutation.error?.message ??
			createFeatureMutation.error?.message ??
			null,
		operationError:
			publishMutation.error?.message ??
			archiveMutation.error?.message ??
			deleteMutation.error?.message ??
			null,
		publish,
		publishOpen,
		refetch: async () => {
			await Promise.all([
				listingQuery.refetch(),
				featureOptionsQuery.refetch(),
			]);
		},
		setPropertyFeatures: async (
			features: Array<{ id: string; name: string }>,
		) => {
			if (!listing) return;
			replaceFeaturesMutation.reset();
			await replaceFeaturesMutation.mutateAsync({
				featureIds: features.map((feature) => feature.id),
				propertyId: listing.property.id,
			});
			await listingQuery.refetch();
			setFeedback(copy.featuresSaved);
		},
		setPropertyImages: async (images: PropertyImageDraft[]) => {
			if (!listing) return;
			saveImagesMutation.reset();
			await saveImagesMutation.mutateAsync({
				currentImages: listing.images,
				nextImages: images,
				propertyId: listing.property.id,
			});
			await listingQuery.refetch();
			setFeedback(copy.imagesSaved);
		},
		setArchiveOpen: (open: boolean) => {
			if (open) resetOperationErrors();
			setArchiveOpen(open);
		},
		setArchiveOutcome,
		setDeleteOpen: (open: boolean) => {
			if (open) resetOperationErrors();
			setDeleteOpen(open);
		},
		setPublishOpen: (open: boolean) => {
			if (open) resetOperationErrors();
			setPublishOpen(open);
		},
	};
}
