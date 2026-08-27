import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	deletePropertyImage,
	listPropertyImages,
	reorderPropertyImages,
	setPropertyCoverImage,
	updatePropertyImage,
	uploadPropertyImage,
} from "@/frontend/api/property-images.api";
import type { AdminPropertyImage } from "@/frontend/features/listings/admin-listing.types";
import { listingQueryKeys } from "@/frontend/features/listings/hooks/listing-query-keys";
import { propertyImageQueryKeys } from "./property-image-query-keys";

export type PropertyImageDraft = AdminPropertyImage & { file?: File };

export function usePropertyImagesQuery(propertyId: string) {
	return useQuery({
		queryFn: () => listPropertyImages(propertyId),
		queryKey: propertyImageQueryKeys.list(propertyId),
	});
}

export function useUploadPropertyImageMutation() {
	return useMutation({ mutationFn: uploadPropertyImage });
}

export function useUpdatePropertyImageMutation() {
	return useMutation({ mutationFn: updatePropertyImage });
}

export function useDeletePropertyImageMutation() {
	return useMutation({ mutationFn: deletePropertyImage });
}

export function useReorderPropertyImagesMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: reorderPropertyImages,
		onSuccess: (images, variables) => {
			queryClient.setQueryData(
				propertyImageQueryKeys.list(variables.propertyId),
				images,
			);
		},
	});
}

export function useSetPropertyCoverImageMutation() {
	return useMutation({ mutationFn: setPropertyCoverImage });
}

export function useSavePropertyImagesMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: savePropertyImages,
		onSuccess: async (images, variables) => {
			queryClient.setQueryData(
				propertyImageQueryKeys.list(variables.propertyId),
				images,
			);
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: listingQueryKeys.details() }),
				queryClient.invalidateQueries({ queryKey: listingQueryKeys.lists() }),
			]);
		},
	});
}

async function savePropertyImages({
	currentImages,
	nextImages,
	propertyId,
}: {
	currentImages: AdminPropertyImage[];
	nextImages: PropertyImageDraft[];
	propertyId: string;
}) {
	const nextExistingIds = new Set(
		nextImages.filter((image) => !image.file).map((image) => image.id),
	);
	await Promise.all(
		currentImages
			.filter((image) => !nextExistingIds.has(image.id))
			.map((image) => deletePropertyImage({ imageId: image.id, propertyId })),
	);

	const persistedIds: string[] = [];
	for (const image of nextImages) {
		if (image.file) {
			const uploaded = await uploadPropertyImage({
				altText: image.altText?.trim() || null,
				file: image.file,
				propertyId,
			});
			persistedIds.push(uploaded.id);
			continue;
		}

		const current = currentImages.find((item) => item.id === image.id);
		if ((current?.altText ?? null) !== (image.altText?.trim() || null)) {
			await updatePropertyImage({
				imageId: image.id,
				input: { alt_text: image.altText?.trim() || null },
				propertyId,
			});
		}
		if (current) persistedIds.push(current.id);
	}

	const desiredCoverIndex = nextImages.findIndex((image) => image.isCover);
	const desiredCoverId = persistedIds[desiredCoverIndex];
	if (desiredCoverId)
		await setPropertyCoverImage({ imageId: desiredCoverId, propertyId });

	if (persistedIds.length === 0) return [];
	return reorderPropertyImages({
		input: { image_ids: persistedIds },
		propertyId,
	});
}
