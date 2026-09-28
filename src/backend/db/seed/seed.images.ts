import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { env } from "#/shared/env";
import { type SeedImageAsset, seedImageAssets } from "./seed.assets";

const configureCloudinary = () => {
	if (
		!env.CLOUDINARY_CLOUD_NAME ||
		!env.CLOUDINARY_API_KEY ||
		!env.CLOUDINARY_API_SECRET
	) {
		throw new Error("Cloudinary is required to upload the seed images");
	}
	cloudinary.config({
		cloud_name: env.CLOUDINARY_CLOUD_NAME,
		api_key: env.CLOUDINARY_API_KEY,
		api_secret: env.CLOUDINARY_API_SECRET,
		secure: true,
	});
};

const uploadAsset = async ({ sourceFile, publicId }: SeedImageAsset) => {
	const buffer = await readFile(
		resolve(process.cwd(), "public/images/properties", sourceFile),
	);
	await new Promise<void>((resolveUpload, rejectUpload) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				public_id: publicId,
				resource_type: "image",
				overwrite: false,
				unique_filename: false,
				use_filename: false,
			},
			(error, result) => {
				if (error || !result) {
					rejectUpload(error ?? new Error("Cloudinary seed upload failed"));
					return;
				}
				resolveUpload();
			},
		);
		stream.end(buffer);
	});
};

/** Uploads the shared seed assets; only needed for a new Cloudinary account. */
export const uploadSeedImageAssets = async () => {
	configureCloudinary();
	for (const asset of Object.values(seedImageAssets)) {
		await uploadAsset(asset);
	}
};
