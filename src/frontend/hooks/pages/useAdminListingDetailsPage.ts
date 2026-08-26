import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useBlocker, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

import type {
	AdminListingArchiveOutcome,
	AdminListingDetailRecord,
} from "@/frontend/features/listings/admin-listing.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import {
	updateDemoListing,
	updateDemoProperty,
} from "@/frontend/pages/admin/demo/admin-demo-workspace";
import { adminListingDetailsCopy } from "@/frontend/pages/admin/listings/details/admin-listing-details.copy";
import {
	createFallbackSlug,
	getAdminListingDetailMock,
	getArchiveOutcomes,
	getPublishBlockers,
} from "@/frontend/pages/admin/listings/details/admin-listing-details.model";

const wait = (milliseconds: number) =>
	new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function useAdminListingDetailsPage() {
	const { language } = useLanguage();
	const { listingId } = useParams({ strict: false }) as { listingId: string };
	const navigate = useNavigate();
	const initialListing = useMemo(
		() => getAdminListingDetailMock(listingId),
		[listingId],
	);
	const formListing = initialListing;

	const [listing, setListing] = useState<AdminListingDetailRecord | null>(
		initialListing,
	);
	const [isDirty, setIsDirty] = useState(false);
	const [feedback, setFeedback] = useState<string | null>(null);
	const [isLifecyclePending, setIsLifecyclePending] = useState(false);
	const [publishOpen, setPublishOpen] = useState(false);
	const [archiveOpen, setArchiveOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [archiveOutcome, setArchiveOutcome] =
		useState<AdminListingArchiveOutcome | null>(null);
	const allowNavigationRef = useRef(false);

	const blocker = useBlocker({
		enableBeforeUnload: isDirty,
		shouldBlockFn: () => isDirty && !allowNavigationRef.current,
		withResolver: true,
	});

	const form = useForm({
		defaultValues: {
			description: formListing?.description ?? "",
			price: formListing?.priceAmount?.toString() ?? "",
			seoDescription: formListing?.seoDescription ?? "",
			seoTitle: formListing?.seoTitle ?? "",
			showExactAddress: formListing?.showExactAddress ?? false,
			slug: formListing?.slug ?? "",
			title: formListing?.title ?? "",
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
			if (!listing) return;
			await wait(500);
			const price = value.price.trim() ? Number(value.price) : null;
			setListing((current) =>
				current
					? {
							...current,
							description: value.description.trim() || null,
							priceAmount: price,
							seoDescription: value.seoDescription.trim() || null,
							seoTitle: value.seoTitle.trim() || null,
							showExactAddress: value.showExactAddress,
							slug: value.slug.trim() || null,
							title: value.title.trim() || null,
							updatedAt: new Date().toISOString(),
						}
					: current,
			);
			setIsDirty(false);
			setFeedback(adminListingDetailsCopy[language].saved);
		},
	});

	const markDirty = () => {
		setIsDirty(true);
		setFeedback(null);
	};

	const publish = async () => {
		if (!listing || getPublishBlockers(listing).length > 0 || isDirty) return;
		setIsLifecyclePending(true);
		await wait(650);
		setListing((current) =>
			current
				? {
						...current,
						publishedAt: new Date().toISOString(),
						slug:
							current.slug ?? createFallbackSlug(current.title ?? "listing"),
						status: "PUBLISHED",
						updatedAt: new Date().toISOString(),
					}
				: current,
		);
		setPublishOpen(false);
		setIsLifecyclePending(false);
		setFeedback(adminListingDetailsCopy[language].published);
	};

	const archive = async () => {
		if (!listing || !archiveOutcome) return;
		setIsLifecyclePending(true);
		await wait(650);
		setListing((current) =>
			current
				? {
						...current,
						archiveOutcome,
						archivedAt: new Date().toISOString(),
						status: "ARCHIVED",
						updatedAt: new Date().toISOString(),
					}
				: current,
		);
		setArchiveOpen(false);
		setArchiveOutcome(null);
		setIsLifecyclePending(false);
		setFeedback(adminListingDetailsCopy[language].archived);
	};

	return {
		archive,
		archiveOpen,
		archiveOutcome,
		archiveOutcomes: listing ? getArchiveOutcomes(listing.listingType) : [],
		blocker,
		copy: adminListingDetailsCopy[language],
		deleteDraft: async () => {
			if (!listing || listing.status !== "DRAFT") return;
			setIsLifecyclePending(true);
			await wait(550);
			allowNavigationRef.current = true;
			void navigate({ to: "/admin/listings" });
		},
		deleteOpen,
		feedback,
		form,
		isDirty,
		isLifecyclePending,
		listing,
		markDirty,
		publish,
		publishOpen,
		setCoverImage: (cover: {
			altText: string | null;
			id: string;
			url: string;
		}) => {
			if (!listing) return;
			const imageExists = listing.images.some((image) => image.id === cover.id);
			const nextListing: AdminListingDetailRecord = {
				...listing,
				coverImage: cover.url,
				images: imageExists
					? listing.images.map((image) => ({
							...image,
							isCover: image.id === cover.id,
						}))
					: [
							...listing.images.map((image) => ({ ...image, isCover: false })),
							{ ...cover, isCover: true },
						],
				updatedAt: new Date().toISOString(),
			};
			setListing(nextListing);
			updateDemoListing(nextListing);
			updateDemoProperty(listing.property.id, {
				coverImage: cover.url,
				updatedAt: nextListing.updatedAt,
			});
			setFeedback(adminListingDetailsCopy[language].coverSaved);
		},
		setArchiveOpen,
		setArchiveOutcome,
		setDeleteOpen,
		setPublishOpen,
	};
}
