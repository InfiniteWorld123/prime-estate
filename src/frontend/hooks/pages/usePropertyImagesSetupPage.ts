import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
	useDeletePropertyImageMutation,
	usePropertyImagesQuery,
	useReorderPropertyImagesMutation,
	useSetPropertyCoverImageMutation,
	useUpdatePropertyImageMutation,
	useUploadPropertyImageMutation,
} from "@/frontend/features/properties/hooks/usePropertyImages";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { propertySetupCopy } from "@/frontend/pages/admin/properties/setup/property-setup.copy";

export type PropertyImageDraft = {
	altText: string;
	file: File | null;
	id: string;
	isCover: boolean;
	name: string;
	progress: number;
	status: "waiting" | "uploading" | "uploaded" | "failed";
	url: string;
};

type Rejection = { id: string; message: string; name: string };

const MAX_IMAGES = 30;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function usePropertyImagesSetupPage() {
	const { language } = useLanguage();
	const copy = propertySetupCopy[language];
	const { propertyId } = useParams({ strict: false }) as { propertyId: string };
	const navigate = useNavigate();
	const imagesQuery = usePropertyImagesQuery(propertyId);
	const uploadMutation = useUploadPropertyImageMutation();
	const updateMutation = useUpdatePropertyImageMutation();
	const deleteMutation = useDeletePropertyImageMutation();
	const reorderMutation = useReorderPropertyImagesMutation();
	const coverMutation = useSetPropertyCoverImageMutation();
	const [images, setImages] = useState<PropertyImageDraft[]>([]);
	const [rejections, setRejections] = useState<Rejection[]>([]);
	const [operationError, setOperationError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [altImageId, setAltImageId] = useState<string | null>(null);
	const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
	const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
	const imagesRef = useRef(images);
	const hydratedRef = useRef(false);
	const processingIdsRef = useRef(new Set<string>());
	imagesRef.current = images;

	useEffect(() => {
		if (!imagesQuery.data || hydratedRef.current) return;
		hydratedRef.current = true;
		setImages(
			imagesQuery.data.map((image) => ({
				altText: image.alt_text ?? "",
				file: null,
				id: image.id,
				isCover: image.is_cover,
				name: image.storage_key.split("/").at(-1) ?? "property-image",
				progress: 100,
				status: "uploaded",
				url: image.url,
			})),
		);
	}, [imagesQuery.data]);

	useEffect(
		() => () => {
			for (const image of imagesRef.current) {
				if (image.file) URL.revokeObjectURL(image.url);
			}
		},
		[],
	);

	useEffect(() => {
		const available = Math.max(0, 3 - processingIdsRef.current.size);
		const waiting = images
			.filter(
				(image) =>
					image.status === "waiting" &&
					image.file &&
					!processingIdsRef.current.has(image.id),
			)
			.slice(0, available);
		if (waiting.length === 0) return;

		for (const image of waiting) {
			processingIdsRef.current.add(image.id);
			setImages((current) =>
				current.map((item) =>
					item.id === image.id
						? { ...item, progress: 35, status: "uploading" }
						: item,
				),
			);
			void uploadMutation
				.mutateAsync({ file: image.file as File, propertyId })
				.then((uploaded) => {
					processingIdsRef.current.delete(image.id);
					URL.revokeObjectURL(image.url);
					setImages((current) =>
						current.map((item) =>
							item.id === image.id
								? {
										...item,
										altText: uploaded.alt_text ?? "",
										file: null,
										id: uploaded.id,
										isCover: uploaded.is_cover,
										progress: 100,
										status: "uploaded",
										url: uploaded.url,
									}
								: item,
						),
					);
					setOperationError(null);
				})
				.catch((error: unknown) => {
					processingIdsRef.current.delete(image.id);
					setImages((current) =>
						current.map((item) =>
							item.id === image.id
								? { ...item, progress: 35, status: "failed" }
								: item,
						),
					);
					setOperationError(
						error instanceof Error ? error.message : copy.images.failed,
					);
				});
		}
	}, [copy.images.failed, images, propertyId, uploadMutation]);

	const addFiles = (files: FileList | File[]) => {
		const nextFiles = Array.from(files);
		const remaining = MAX_IMAGES - images.length;
		const accepted: File[] = [];
		const rejected: Rejection[] = [];
		for (const file of nextFiles) {
			let message: string | null = null;
			if (!SUPPORTED_TYPES.has(file.type)) message = copy.images.errorType;
			else if (file.size > MAX_FILE_SIZE) message = copy.images.errorTooLarge;
			else if (accepted.length >= remaining) message = copy.images.errorTooMany;
			if (message) {
				rejected.push({ id: crypto.randomUUID(), message, name: file.name });
			} else accepted.push(file);
		}
		setRejections(rejected);
		setImages((current) => [
			...current,
			...accepted.map((file) => ({
				altText: "",
				file,
				id: crypto.randomUUID(),
				isCover: false,
				name: file.name,
				progress: 0,
				status: "waiting" as const,
				url: URL.createObjectURL(file),
			})),
		]);
	};

	const moveImage = (id: string, direction: -1 | 1) => {
		setImages((current) => {
			const index = current.findIndex((image) => image.id === id);
			const target = index + direction;
			if (index < 0 || target < 0 || target >= current.length) return current;
			const next = [...current];
			[next[index], next[target]] = [next[target], next[index]];
			return next;
		});
	};

	const moveToImage = (targetId: string) => {
		if (!draggedImageId || draggedImageId === targetId) return;
		setImages((current) => {
			const from = current.findIndex((image) => image.id === draggedImageId);
			const to = current.findIndex((image) => image.id === targetId);
			if (from < 0 || to < 0) return current;
			const next = [...current];
			const [moved] = next.splice(from, 1);
			next.splice(to, 0, moved);
			return next;
		});
		setDraggedImageId(null);
	};

	const persistOrder = async () => {
		const imageIds = imagesRef.current
			.filter((image) => image.status === "uploaded")
			.map((image) => image.id);
		if (imageIds.length === 0) return;
		await reorderMutation.mutateAsync({
			input: { image_ids: imageIds },
			propertyId,
		});
	};

	const deleteImage = async () => {
		if (!deleteImageId) return;
		const deleting = imagesRef.current.find(
			(image) => image.id === deleteImageId,
		);
		if (!deleting) return;
		try {
			if (deleting.status === "uploaded") {
				await deleteMutation.mutateAsync({ imageId: deleting.id, propertyId });
			}
			if (deleting.file) URL.revokeObjectURL(deleting.url);
			setImages((current) => {
				const next = current.filter((image) => image.id !== deleting.id);
				if (deleting.isCover && next[0])
					next[0] = { ...next[0], isCover: true };
				return next;
			});
			setDeleteImageId(null);
			setOperationError(null);
		} catch (error) {
			setOperationError(
				error instanceof Error ? error.message : copy.images.deleteDescription,
			);
		}
	};

	const navigateAfterSaving = async (
		destination: "features" | "collection",
	) => {
		if (
			imagesRef.current.some(
				(image) => image.status === "uploading" || image.status === "waiting",
			)
		)
			return;
		try {
			await persistOrder();
			setOperationError(null);
			if (destination === "features") {
				void navigate({
					params: { propertyId },
					to: "/admin/properties/$propertyId/features",
				});
			} else void navigate({ to: "/admin/properties" });
		} catch (error) {
			setOperationError(
				error instanceof Error ? error.message : copy.images.failed,
			);
		}
	};

	return {
		addFiles,
		altImage: images.find((image) => image.id === altImageId) ?? null,
		copy,
		deleteImage,
		deleteImageDraft:
			images.find((image) => image.id === deleteImageId) ?? null,
		dismissRejection: (id: string) =>
			setRejections((current) => current.filter((item) => item.id !== id)),
		finishLater: () => void navigateAfterSaving("collection"),
		images,
		isBusy:
			images.some((image) => ["waiting", "uploading"].includes(image.status)) ||
			reorderMutation.isPending,
		isDragging,
		isLoading: imagesQuery.isPending,
		loadError: imagesQuery.error?.message ?? null,
		moveImage,
		moveToImage,
		navigateToFeatures: () => void navigateAfterSaving("features"),
		operationError,
		propertyId,
		refetch: imagesQuery.refetch,
		rejections,
		retry: (id: string) =>
			setImages((current) =>
				current.map((image) =>
					image.id === id
						? { ...image, progress: 0, status: "waiting" }
						: image,
				),
			),
		saveAltText: async (value: string) => {
			if (!altImageId) return;
			try {
				const updated = await updateMutation.mutateAsync({
					imageId: altImageId,
					input: { alt_text: value.trim() || null },
					propertyId,
				});
				setImages((current) =>
					current.map((image) =>
						image.id === altImageId
							? { ...image, altText: updated.alt_text ?? "" }
							: image,
					),
				);
				setAltImageId(null);
				setOperationError(null);
			} catch (error) {
				setOperationError(
					error instanceof Error ? error.message : copy.images.failed,
				);
			}
		},
		setAltImageId,
		setCover: async (id: string) => {
			try {
				await coverMutation.mutateAsync({ imageId: id, propertyId });
				setImages((current) =>
					current.map((image) => ({ ...image, isCover: image.id === id })),
				);
				setOperationError(null);
			} catch (error) {
				setOperationError(
					error instanceof Error ? error.message : copy.images.failed,
				);
			}
		},
		setDeleteImageId,
		setDraggedImageId,
		setIsDragging,
	};
}
