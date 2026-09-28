import { getPool } from "#/backend/db/pool";
import {
	clearDatabaseSeed,
	seedDatabase,
	validateDatabaseSeed,
} from "./seed.database";
import { buildSeedData, seedSummary } from "./seed.generator";
import { uploadSeedImageAssets } from "./seed.images";

const flags = new Set(process.argv.slice(2));
const isDryRun = flags.has("--dry-run");
const isClear = flags.has("--clear");
const isValidate = flags.has("--validate");
const shouldUploadImages = flags.has("--upload-images");

if (process.env.NODE_ENV === "production") {
	throw new Error("Seed commands are disabled when NODE_ENV=production");
}

const data = buildSeedData();

try {
	if (isDryRun) {
		console.info("Prime Estate seed dry run", seedSummary(data));
	} else if (isValidate) {
		const databaseSummary = await validateDatabaseSeed(data);
		console.info(
			"Prime Estate seed database validation passed",
			databaseSummary,
		);
	} else if (isClear) {
		await clearDatabaseSeed(data);
		console.info("Prime Estate database seed rows cleared");
		console.info("Shared Cloudinary seed assets were preserved intentionally");
	} else {
		if (shouldUploadImages) {
			console.info("Uploading the shared seed images to Cloudinary");
			await uploadSeedImageAssets();
		}
		console.info("Writing seed records to PostgreSQL");
		const databaseSummary = await seedDatabase(data);
		console.info("Prime Estate seed complete", {
			...seedSummary(data),
			database: databaseSummary,
		});
	}
} finally {
	await getPool().end();
}
