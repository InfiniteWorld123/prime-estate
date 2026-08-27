import { pool } from "#/backend/db/pool";
import {
	clearDatabaseSeed,
	seedDatabase,
	validateDatabaseSeed,
} from "./seed.database";
import { buildSeedData, seedSummary } from "./seed.generator";
import { uploadSeedImages } from "./seed.images";

const flags = new Set(process.argv.slice(2));
const isDryRun = flags.has("--dry-run");
const isClear = flags.has("--clear");
const isValidate = flags.has("--validate");

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
		console.info("Cloudinary seed assets were preserved intentionally");
	} else {
		console.info("Uploading deterministic property images to Cloudinary");
		await uploadSeedImages(data.images, (completed, total) => {
			console.info(`Seed image upload ${completed}/${total}`);
		});
		console.info("Writing seed records to PostgreSQL");
		const databaseSummary = await seedDatabase(data);
		console.info("Prime Estate seed complete", {
			...seedSummary(data),
			database: databaseSummary,
		});
	}
} finally {
	await pool.end();
}
