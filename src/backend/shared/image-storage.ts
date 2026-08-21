import { v2 as cloudinary } from "cloudinary";
import { env } from "#/shared/env";
import { internalError } from "./error";

type UploadedImage = {
	storage_key: string;
	url: string;
};

const configureCloudinary = () => {
	if (
		!env.CLOUDINARY_CLOUD_NAME ||
		!env.CLOUDINARY_API_KEY ||
		!env.CLOUDINARY_API_SECRET
	) {
		throw internalError("Image storage is not configured");
	}

	cloudinary.config({
		cloud_name: env.CLOUDINARY_CLOUD_NAME,
		api_key: env.CLOUDINARY_API_KEY,
		api_secret: env.CLOUDINARY_API_SECRET,
		secure: true,
	});
};

export const uploadPropertyImage = async (
	propertyId: string,
	file: File,
): Promise<UploadedImage> => {
	configureCloudinary();
	const buffer = Buffer.from(await file.arrayBuffer());

	return await new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				folder: `prime-estate/properties/${propertyId}`,
				resource_type: "image",
				use_filename: false,
				unique_filename: true,
			},
			(error, result) => {
				if (error || !result) {
					reject(error ?? internalError("Image upload failed"));
					return;
				}
				resolve({
					storage_key: result.public_id,
					url: result.secure_url,
				});
			},
		);

		stream.end(buffer);
	});
};

export const deleteStoredImage = async (storageKey: string): Promise<void> => {
	configureCloudinary();
	const result = await cloudinary.uploader.destroy(storageKey, {
		resource_type: "image",
		invalidate: true,
	});

	if (result.result !== "ok" && result.result !== "not found") {
		throw internalError("Image deletion from storage failed");
	}
};

export const getStoredImageUrl = (storageKey: string): string => {
	configureCloudinary();
	return cloudinary.url(storageKey, {
		secure: true,
		fetch_format: "auto",
		quality: "auto",
	});
};
