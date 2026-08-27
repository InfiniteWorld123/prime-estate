import type { PoolClient } from "pg";
import { pool } from "#/backend/db/pool";
import type { SeedData } from "./seed.generator";

type SeedDatabaseSummary = {
	contacts: number;
	properties: number;
	features: number;
	propertyFeatures: number;
	images: number;
	listings: number;
};

const asJson = (value: unknown) => JSON.stringify(value);

const clearSeedRows = async (client: PoolClient, data: SeedData) => {
	const propertyIds = data.properties.map((item) => item.id);
	const listingIds = data.listings.map((item) => item.id);
	const imageIds = data.images.map((item) => item.id);
	const contactIds = data.contacts.map((item) => item.id);
	const featureIds = data.features.map((item) => item.id);

	await client.query("DELETE FROM listings WHERE id = ANY($1::uuid[])", [
		listingIds,
	]);
	await client.query("DELETE FROM property_images WHERE id = ANY($1::uuid[])", [
		imageIds,
	]);
	await client.query(
		"DELETE FROM property_features WHERE property_id = ANY($1::uuid[])",
		[propertyIds],
	);
	await client.query("DELETE FROM properties WHERE id = ANY($1::uuid[])", [
		propertyIds,
	]);
	await client.query("DELETE FROM contacts WHERE id = ANY($1::uuid[])", [
		contactIds,
	]);
	await client.query(
		`DELETE FROM features AS feature
		 WHERE feature.id = ANY($1::uuid[])
		   AND NOT EXISTS (
			SELECT 1
			FROM property_features
			WHERE feature_id = feature.id
		   )`,
		[featureIds],
	);
};

const insertContacts = async (client: PoolClient, data: SeedData) => {
	const rows = data.contacts.map((contact) => ({
		id: contact.id,
		full_name: contact.fullName,
		company_name: contact.companyName,
		email: contact.email,
		phone: contact.phone,
	}));
	await client.query(
		`INSERT INTO contacts (id, full_name, company_name, email, phone)
		 SELECT id, full_name, company_name, email, phone
		 FROM jsonb_to_recordset($1::jsonb) AS seed_contact(
			id uuid,
			full_name text,
			company_name text,
			email text,
			phone text
		 )`,
		[asJson(rows)],
	);
};

const insertProperties = async (client: PoolClient, data: SeedData) => {
	const rows = data.properties.map((property) => ({
		id: property.id,
		reference_number: property.referenceNumber,
		primary_contact_id: property.primaryContactId,
		property_type: property.propertyType,
		property_source: property.propertySource,
		street_name: property.streetName,
		house_number: property.houseNumber,
		unit_number: property.unitNumber,
		postal_code: property.postalCode,
		city: property.city,
		living_area_m2: property.livingAreaM2,
		plot_area_m2: property.plotAreaM2,
		rooms: property.rooms,
		bedrooms: property.bedrooms,
		bathrooms: property.bathrooms,
		year_built: property.yearBuilt,
		floor_number: property.floorNumber,
		total_floors: property.totalFloors,
		archived_at: property.archivedAt?.toISOString() ?? null,
	}));
	await client.query(
		`INSERT INTO properties (
			id, reference_number, primary_contact_id, property_type,
			property_source, street_name, house_number, unit_number,
			postal_code, city, living_area_m2, plot_area_m2, rooms,
			bedrooms, bathrooms, year_built, floor_number, total_floors,
			archived_at
		)
		SELECT
			id, reference_number, primary_contact_id, property_type,
			property_source, street_name, house_number, unit_number,
			postal_code, city, living_area_m2, plot_area_m2, rooms,
			bedrooms, bathrooms, year_built, floor_number, total_floors,
			archived_at
		FROM jsonb_to_recordset($1::jsonb) AS seed_property(
			id uuid,
			reference_number text,
			primary_contact_id uuid,
			property_type text,
			property_source text,
			street_name text,
			house_number text,
			unit_number text,
			postal_code text,
			city text,
			living_area_m2 numeric,
			plot_area_m2 numeric,
			rooms numeric,
			bedrooms smallint,
			bathrooms smallint,
			year_built smallint,
			floor_number smallint,
			total_floors smallint,
			archived_at timestamptz
		)`,
		[asJson(rows)],
	);
};

const upsertFeatures = async (client: PoolClient, data: SeedData) => {
	for (const feature of data.features) {
		await client.query(
			`INSERT INTO features (id, code, name)
			 VALUES ($1, $2, $3)
			 ON CONFLICT (code) DO NOTHING`,
			[feature.id, feature.code, feature.name],
		);
	}

	const result = await client.query<{ code: string; id: string }>(
		"SELECT id, code FROM features WHERE code = ANY($1::text[])",
		[data.features.map((feature) => feature.code)],
	);
	return new Map(result.rows.map((feature) => [feature.code, feature.id]));
};

const insertPropertyFeatures = async (
	client: PoolClient,
	data: SeedData,
	featureIds: Map<string, string>,
) => {
	const rows = data.propertyFeatures.map((item) => {
		const featureId = featureIds.get(item.featureCode);
		if (!featureId) {
			throw new Error(
				`Feature ${item.featureCode} was not available after seeding`,
			);
		}
		return { property_id: item.propertyId, feature_id: featureId };
	});
	await client.query(
		`INSERT INTO property_features (property_id, feature_id)
		 SELECT property_id, feature_id
		 FROM jsonb_to_recordset($1::jsonb) AS seed_property_feature(
			property_id uuid,
			feature_id uuid
		 )
		 ON CONFLICT DO NOTHING`,
		[asJson(rows)],
	);
};

const insertImages = async (client: PoolClient, data: SeedData) => {
	const rows = data.images.map((image) => ({
		id: image.id,
		property_id: image.propertyId,
		storage_key: image.storageKey,
		alt_text: image.altText,
		sort_order: image.sortOrder,
		is_cover: image.isCover,
	}));
	await client.query(
		`INSERT INTO property_images (
			id, property_id, storage_key, alt_text, sort_order, is_cover
		)
		SELECT id, property_id, storage_key, alt_text, sort_order, is_cover
		FROM jsonb_to_recordset($1::jsonb) AS seed_image(
			id uuid,
			property_id uuid,
			storage_key text,
			alt_text text,
			sort_order integer,
			is_cover boolean
		)`,
		[asJson(rows)],
	);
};

const insertListings = async (client: PoolClient, data: SeedData) => {
	const rows = data.listings.map((listing) => ({
		id: listing.id,
		property_id: listing.propertyId,
		listing_type: listing.listingType,
		status: listing.status,
		archive_outcome: listing.archiveOutcome,
		price_amount: listing.priceAmount,
		title: listing.title,
		description: listing.description,
		slug: listing.slug,
		seo_title: listing.seoTitle,
		seo_description: listing.seoDescription,
		show_exact_address: listing.showExactAddress,
		published_at: listing.publishedAt?.toISOString() ?? null,
		archived_at: listing.archivedAt?.toISOString() ?? null,
	}));
	await client.query(
		`INSERT INTO listings (
			id, property_id, listing_type, status, archive_outcome,
			price_amount, title, description, slug, seo_title,
			seo_description, show_exact_address, published_at, archived_at
		)
		SELECT
			id, property_id, listing_type, status, archive_outcome,
			price_amount, title, description, slug, seo_title,
			seo_description, show_exact_address, published_at, archived_at
		FROM jsonb_to_recordset($1::jsonb) AS seed_listing(
			id uuid,
			property_id uuid,
			listing_type text,
			status text,
			archive_outcome text,
			price_amount numeric,
			title text,
			description text,
			slug text,
			seo_title text,
			seo_description text,
			show_exact_address boolean,
			published_at timestamptz,
			archived_at timestamptz
		)`,
		[asJson(rows)],
	);
};

const readSeedCounts = async (
	client: PoolClient,
	data: SeedData,
): Promise<SeedDatabaseSummary> => {
	const propertyIds = data.properties.map((property) => property.id);
	const contactIds = data.contacts.map((contact) => contact.id);
	const listingIds = data.listings.map((listing) => listing.id);
	const imageIds = data.images.map((image) => image.id);
	const result = await client.query<SeedDatabaseSummary>(
		`SELECT
			(SELECT COUNT(*)::int FROM contacts WHERE id = ANY($1::uuid[])) AS contacts,
			(SELECT COUNT(*)::int FROM properties WHERE id = ANY($2::uuid[])) AS properties,
			(SELECT COUNT(DISTINCT feature_id)::int FROM property_features WHERE property_id = ANY($2::uuid[])) AS features,
			(SELECT COUNT(*)::int FROM property_features WHERE property_id = ANY($2::uuid[])) AS "propertyFeatures",
			(SELECT COUNT(*)::int FROM property_images WHERE id = ANY($3::uuid[])) AS images,
			(SELECT COUNT(*)::int FROM listings WHERE id = ANY($4::uuid[])) AS listings`,
		[contactIds, propertyIds, imageIds, listingIds],
	);
	const summary = result.rows[0];
	if (!summary) throw new Error("Unable to verify seeded database rows");
	return summary;
};

const writeSeedRows = async (client: PoolClient, data: SeedData) => {
	await clearSeedRows(client, data);
	await insertContacts(client, data);
	await insertProperties(client, data);
	const featureIds = await upsertFeatures(client, data);
	await insertPropertyFeatures(client, data, featureIds);
	await insertImages(client, data);
	await insertListings(client, data);
	return await readSeedCounts(client, data);
};

export const seedDatabase = async (
	data: SeedData,
): Promise<SeedDatabaseSummary> => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		const summary = await writeSeedRows(client, data);
		await client.query("COMMIT");
		return summary;
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const validateDatabaseSeed = async (
	data: SeedData,
): Promise<SeedDatabaseSummary> => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		const summary = await writeSeedRows(client, data);
		await client.query("ROLLBACK");
		return summary;
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const clearDatabaseSeed = async (data: SeedData) => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		await clearSeedRows(client, data);
		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};
