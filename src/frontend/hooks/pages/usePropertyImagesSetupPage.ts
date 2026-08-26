import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import {
	getDemoProperties,
	updateDemoProperty,
} from "@/frontend/pages/admin/demo/admin-demo-workspace";
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
	const [images, setImages] = useState<PropertyImageDraft[]>(() => {
		const property = getDemoProperties().find((item) => item.id === propertyId);
		if (!property?.coverImage) return [];
		return [
			{
				altText: "",
				file: null,
				id: `${property.id}-existing-cover`,
				isCover: true,
				name: property.coverImage.split("/").at(-1) ?? "property-cover.jpg",
				progress: 100,
				status: "uploaded",
				url: property.coverImage,
			},
		];
	});
	const [rejections, setRejections] = useState<Rejection[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [altImageId, setAltImageId] = useState<string | null>(null);
	const [deleteImageId, setDeleteImageId] = useState<string | null>(null);
	const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
	const imagesRef = useRef(images);
	const processingIdsRef = useRef(new Set<string>());
	const uploadTimersRef = useRef<number[]>([]);
	imagesRef.current = images;

	useEffect(
		() => () => {
			for (const timer of uploadTimersRef.current) window.clearTimeout(timer);
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
					image.status === "waiting" && !processingIdsRef.current.has(image.id),
			)
			.slice(0, available);
		if (waiting.length === 0) return;

		const waitingIds = new Set(waiting.map((image) => image.id));
		for (const id of waitingIds) processingIdsRef.current.add(id);
		setImages((current) =>
			current.map((image) =>
				waitingIds.has(image.id)
					? { ...image, progress: 35, status: "uploading" }
					: image,
			),
		);

		const timers = waiting.map((image) =>
			window.setTimeout(() => {
				processingIdsRef.current.delete(image.id);
				setImages((current) => {
					const shouldFail = image.name.toLocaleLowerCase().includes("fail");
					const hasCover = current.some(
						(item) => item.isCover && item.status === "uploaded",
					);
					return current.map((item) =>
						item.id === image.id
							? {
									...item,
									isCover: shouldFail ? false : !hasCover,
									progress: shouldFail ? 35 : 100,
									status: shouldFail ? "failed" : "uploaded",
								}
							: item,
					);
				});
			}, 700),
		);
		uploadTimersRef.current.push(...timers);
	}, [images]);

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

	const deleteImage = () => {
		if (!deleteImageId) return;
		setImages((current) => {
			const deleting = current.find((image) => image.id === deleteImageId);
			if (deleting?.file) URL.revokeObjectURL(deleting.url);
			const next = current.filter((image) => image.id !== deleteImageId);
			if (deleting?.isCover) {
				const firstUploaded = next.find((image) => image.status === "uploaded");
				if (firstUploaded) firstUploaded.isCover = true;
			}
			return [...next];
		});
		setDeleteImageId(null);
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
		finishLater: () => void navigate({ to: "/admin/properties" }),
		images,
		isDragging,
		moveImage,
		moveToImage,
		navigateToFeatures: () => {
			const cover = images.find(
				(image) => image.isCover && image.status === "uploaded",
			);
			updateDemoProperty(propertyId, {
				coverImage: cover?.url ?? null,
				updatedAt: new Date().toISOString(),
			});
			void navigate({
				params: { propertyId },
				to: "/admin/properties/$propertyId/features",
			});
		},
		propertyId,
		rejections,
		retry: (id: string) =>
			setImages((current) =>
				current.map((image) =>
					image.id === id
						? { ...image, progress: 0, status: "waiting" }
						: image,
				),
			),
		saveAltText: (value: string) => {
			if (!altImageId) return;
			setImages((current) =>
				current.map((image) =>
					image.id === altImageId ? { ...image, altText: value.trim() } : image,
				),
			);
			setAltImageId(null);
		},
		setAltImageId,
		setCover: (id: string) =>
			setImages((current) =>
				current.map((image) => ({ ...image, isCover: image.id === id })),
			),
		setDeleteImageId,
		setDraggedImageId,
		setIsDragging,
	};
}
