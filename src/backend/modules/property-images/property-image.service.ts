import { pool } from "#/backend/db/pool";
import {
	badRequestError,
	conflictError,
	validationError,
} from "#/backend/shared/error";
import {
	deleteStoredImage,
	getStoredImageUrl,
	uploadPropertyImage,
} from "#/backend/shared/image-storage";
import { requireFound } from "#/backend/shared/service-utils";
import type {
	PropertyImageType,
	ReorderPropertyImagesDataType,
	UpdatePropertyImageDataType,
} from "#/shared/types/property-image.type";

const MAX_IMAGES_PER_PROPERTY = 30;
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type PropertyImageRow = Omit<PropertyImageType, "url">;
type IdRow = { id: string };
type ImageCountRow = { image_count: string; next_sort_order: number };

const withUrl = (image: PropertyImageRow): PropertyImageType => ({
	...image,
	url: getStoredImageUrl(image.storage_key),
});

const validateImageFile = (file: File) => {
	if (!(file instanceof File) || file.size === 0) {
		throw badRequestError("An image file is required");
	}
	if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
		throw validationError("Only JPEG, PNG, and WebP images are allowed");
	}
	if (file.size > MAX_IMAGE_SIZE_BYTES) {
		throw validationError("Image size cannot exceed 10 MB");
	}
};

export const listPropertyImagesService = async (
	propertyId: string,
): Promise<PropertyImageType[]> => {
	const propertyResult = await pool.query<IdRow>(
		"SELECT id FROM properties WHERE id = $1;",
		[propertyId],
	);
	requireFound(propertyResult.rows[0], "Property not found");

	const result = await pool.query<PropertyImageRow>(
		`SELECT id, property_id, storage_key, alt_text, sort_order, is_cover,
		        created_at, updated_at
		 FROM property_images
		 WHERE property_id = $1
		 ORDER BY sort_order ASC, created_at ASC, id ASC;`,
		[propertyId],
	);
	return result.rows.map(withUrl);
};

export const uploadPropertyImageService = async (
	propertyId: string,
	file: File,
	altText: string | null,
): Promise<PropertyImageType> => {
	validateImageFile(file);
	const propertyResult = await pool.query<IdRow>(
		"SELECT id FROM properties WHERE id = $1;",
		[propertyId],
	);
	requireFound(propertyResult.rows[0], "Property not found");

	const uploaded = await uploadPropertyImage(propertyId, file);
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		await client.query("SELECT id FROM properties WHERE id = $1 FOR UPDATE;", [
			propertyId,
		]);
		const countResult = await client.query<ImageCountRow>(
			`SELECT COUNT(*) AS image_count,
			        COALESCE(MAX(sort_order) + 1, 0)::integer AS next_sort_order
			 FROM property_images
			 WHERE property_id = $1;`,
			[propertyId],
		);
		const imageCount = Number(countResult.rows[0]?.image_count ?? 0);
		if (imageCount >= MAX_IMAGES_PER_PROPERTY) {
			throw conflictError("A property cannot have more than 30 images");
		}
		const result = await client.query<PropertyImageRow>(
			`INSERT INTO property_images (
				property_id, storage_key, alt_text, sort_order, is_cover
			 )
			 VALUES ($1, $2, $3, $4, $5)
			 RETURNING id, property_id, storage_key, alt_text, sort_order, is_cover,
			           created_at, updated_at;`,
			[
				propertyId,
				uploaded.storage_key,
				altText,
				countResult.rows[0]?.next_sort_order ?? 0,
				imageCount === 0,
			],
		);
		await client.query("COMMIT");
		return withUrl(result.rows[0] as PropertyImageRow);
	} catch (error) {
		await client.query("ROLLBACK");
		await deleteStoredImage(uploaded.storage_key).catch((cleanupError) => {
			console.error("Uploaded image cleanup failed", cleanupError);
		});
		throw error;
	} finally {
		client.release();
	}
};

export const updatePropertyImageService = async (
	propertyId: string,
	imageId: string,
	input: UpdatePropertyImageDataType,
): Promise<PropertyImageType> => {
	const result = await pool.query<PropertyImageRow>(
		`UPDATE property_images
		 SET alt_text = $1, updated_at = CURRENT_TIMESTAMP
		 WHERE id = $2 AND property_id = $3
		 RETURNING id, property_id, storage_key, alt_text, sort_order, is_cover,
		           created_at, updated_at;`,
		[input.alt_text, imageId, propertyId],
	);
	return withUrl(requireFound(result.rows[0], "Property image not found"));
};

export const reorderPropertyImagesService = async (
	propertyId: string,
	input: ReorderPropertyImagesDataType,
): Promise<PropertyImageType[]> => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		const propertyResult = await client.query<IdRow>(
			"SELECT id FROM properties WHERE id = $1 FOR UPDATE;",
			[propertyId],
		);
		requireFound(propertyResult.rows[0], "Property not found");
		const imagesResult = await client.query<IdRow>(
			"SELECT id FROM property_images WHERE property_id = $1 FOR UPDATE;",
			[propertyId],
		);
		const currentIds = new Set(imagesResult.rows.map((image) => image.id));
		if (
			currentIds.size !== input.image_ids.length ||
			input.image_ids.some((id) => !currentIds.has(id))
		) {
			throw validationError(
				"Image IDs must contain every image of this property exactly once",
			);
		}
		await client.query(
			`UPDATE property_images AS image
			 SET sort_order = (ordered.position - 1)::integer,
			     updated_at = CURRENT_TIMESTAMP
			 FROM unnest($2::uuid[]) WITH ORDINALITY AS ordered(id, position)
			 WHERE image.property_id = $1 AND image.id = ordered.id;`,
			[propertyId, input.image_ids],
		);
		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
	return await listPropertyImagesService(propertyId);
};

export const setPropertyCoverImageService = async (
	propertyId: string,
	imageId: string,
): Promise<PropertyImageType> => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		await client.query("SELECT id FROM properties WHERE id = $1 FOR UPDATE;", [
			propertyId,
		]);
		const imageResult = await client.query<IdRow>(
			"SELECT id FROM property_images WHERE id = $1 AND property_id = $2;",
			[imageId, propertyId],
		);
		requireFound(imageResult.rows[0], "Property image not found");
		await client.query(
			`UPDATE property_images
			 SET is_cover = FALSE, updated_at = CURRENT_TIMESTAMP
			 WHERE property_id = $1 AND is_cover = TRUE;`,
			[propertyId],
		);
		const result = await client.query<PropertyImageRow>(
			`UPDATE property_images
			 SET is_cover = TRUE, updated_at = CURRENT_TIMESTAMP
			 WHERE id = $1 AND property_id = $2
			 RETURNING id, property_id, storage_key, alt_text, sort_order, is_cover,
			           created_at, updated_at;`,
			[imageId, propertyId],
		);
		await client.query("COMMIT");
		return withUrl(result.rows[0] as PropertyImageRow);
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const deletePropertyImageService = async (
	propertyId: string,
	imageId: string,
): Promise<PropertyImageType> => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		await client.query("SELECT id FROM properties WHERE id = $1 FOR UPDATE;", [
			propertyId,
		]);
		const imageResult = await client.query<PropertyImageRow>(
			`SELECT id, property_id, storage_key, alt_text, sort_order, is_cover,
			        created_at, updated_at
			 FROM property_images
			 WHERE id = $1 AND property_id = $2
			 FOR UPDATE;`,
			[imageId, propertyId],
		);
		const image = requireFound(imageResult.rows[0], "Property image not found");
		await deleteStoredImage(image.storage_key);
		await client.query("DELETE FROM property_images WHERE id = $1;", [imageId]);
		if (image.is_cover) {
			await client.query(
				`UPDATE property_images
				 SET is_cover = TRUE, updated_at = CURRENT_TIMESTAMP
				 WHERE id = (
					SELECT id FROM property_images
					WHERE property_id = $1
					ORDER BY sort_order ASC, created_at ASC, id ASC
					LIMIT 1
				 );`,
				[propertyId],
			);
		}
		await client.query("COMMIT");
		return withUrl(image);
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};
