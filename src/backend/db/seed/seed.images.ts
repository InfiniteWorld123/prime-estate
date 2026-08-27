import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { env } from "#/shared/env";
import type { SeedImage } from "./seed.generator";

const configureCloudinary = () => {
	if (
		!env.CLOUDINARY_CLOUD_NAME ||
		!env.CLOUDINARY_API_KEY ||
		!env.CLOUDINARY_API_SECRET
	) {
		throw new Error("Cloudinary is required to seed property images");
	}
	cloudinary.config({
		cloud_name: env.CLOUDINARY_CLOUD_NAME,
		api_key: env.CLOUDINARY_API_KEY,
		api_secret: env.CLOUDINARY_API_SECRET,
		secure: true,
	});
};

const sourcePath = (image: SeedImage) =>
	resolve(process.cwd(), "public/images/properties", image.sourceFile);

const uploadImage = async (image: SeedImage) => {
	const buffer = await readFile(sourcePath(image));
	await new Promise<void>((resolveUpload, rejectUpload) => {
		const stream = cloudinary.uploader.upload_stream(
			{
				public_id: image.storageKey,
				resource_type: "image",
				overwrite: true,
				invalidate: false,
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

export const uploadSeedImages = async (
	images: SeedImage[],
	onProgress?: (completed: number, total: number) => void,
) => {
	configureCloudinary();
	for (const image of images) {
		try {
			await access(sourcePath(image));
		} catch {
			throw new Error(`Seed source image is missing: ${image.sourceFile}`);
		}
	}

	let cursor = 0;
	let completed = 0;
	const workers = Array.from({ length: 8 }, async () => {
		while (cursor < images.length) {
			const image = images[cursor];
			cursor += 1;
			if (!image) return;
			await uploadImage(image);
			completed += 1;
			if (completed % 25 === 0 || completed === images.length) {
				onProgress?.(completed, images.length);
			}
		}
	});

	await Promise.all(workers);
};
