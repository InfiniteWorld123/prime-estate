import { pool } from "#/backend/db/pool";
import { getPropertyFeaturesService } from "#/backend/modules/features/feature.service";
import { listPropertyImagesService } from "#/backend/modules/property-images/property-image.service";
import {
	conflictError,
	notFoundError,
	validationError,
} from "#/backend/shared/error";
import { getStoredImageUrl } from "#/backend/shared/image-storage";
import { requireCreated, requireFound } from "#/backend/shared/service-utils";
import type {
	AdminListingDetailType,
	AdminListingSummaryType,
	AdminListingType,
	ArchiveListingDataType,
	CreateListingDataType,
	ListingArchiveOutcomeValue,
	ListingSortType,
	ListingStatusValue,
	ListingsPageType,
	ListingTypeValue,
	ListListingsDataType,
	UpdateListingDataType,
} from "#/shared/types/listing.type";

type ListingRow = {
	id: string;
	property_id: string;
	property_reference_number: string;
	property_type: "APARTMENT" | "HOUSE";
	street_name: string;
	house_number: string;
	unit_number: string | null;
	postal_code: string;
	city: string;
	living_area_m2: string;
	rooms: string;
	listing_type: ListingTypeValue;
	status: ListingStatusValue;
	archive_outcome: ListingArchiveOutcomeValue | null;
	price_amount: string | null;
	currency_code: "EUR";
	title: string | null;
	description: string | null;
	slug: string | null;
	seo_title: string | null;
	seo_description: string | null;
	show_exact_address: boolean;
	cover_image_id: string | null;
	cover_storage_key: string | null;
	cover_alt_text: string | null;
	published_at: Date | null;
	archived_at: Date | null;
	created_at: Date;
	updated_at: Date;
};

type ListingStateRow = ListingRow & {
	property_archived_at: Date | null;
};

type ListingCopySource = Pick<
	ListingRow,
	"property_type" | "city" | "living_area_m2" | "rooms" | "listing_type"
>;

type ListingPropertyRow = {
	id: string;
	archived_at: Date | null;
	property_type: "APARTMENT" | "HOUSE";
	city: string;
	living_area_m2: string;
	rooms: string;
};

type IdRow = { id: string };
type CountRow = { total_count: string };

const listingOrderBy: Record<ListingSortType, string> = {
	newest: "listing.created_at DESC, listing.id DESC",
	oldest: "listing.created_at ASC, listing.id ASC",
	recently_updated: "listing.updated_at DESC, listing.id DESC",
	price_asc: "listing.price_amount ASC NULLS LAST, listing.id ASC",
	price_desc: "listing.price_amount DESC NULLS LAST, listing.id DESC",
	published_newest: "listing.published_at DESC NULLS LAST, listing.id DESC",
	title_asc: "LOWER(listing.title) ASC NULLS LAST, listing.id ASC",
	title_desc: "LOWER(listing.title) DESC NULLS LAST, listing.id DESC",
};

const listingSelect = `
	SELECT
		listing.id,
		listing.property_id,
		property.reference_number AS property_reference_number,
		property.property_type,
		property.street_name,
		property.house_number,
		property.unit_number,
		property.postal_code,
		property.city,
		property.living_area_m2,
		property.rooms,
		listing.listing_type,
		listing.status,
		listing.archive_outcome,
		listing.price_amount,
		listing.currency_code,
		listing.title,
		listing.description,
		listing.slug,
		listing.seo_title,
		listing.seo_description,
		listing.show_exact_address,
		cover.id AS cover_image_id,
		cover.storage_key AS cover_storage_key,
		cover.alt_text AS cover_alt_text,
		listing.published_at,
		listing.archived_at,
		listing.created_at,
		listing.updated_at
	FROM listings AS listing
	JOIN properties AS property ON property.id = listing.property_id
	LEFT JOIN LATERAL (
		SELECT image.id, image.storage_key, image.alt_text
		FROM property_images AS image
		WHERE image.property_id = property.id AND image.is_cover = TRUE
		LIMIT 1
	) AS cover ON TRUE
`;

const mapListingRow = (row: ListingRow): AdminListingType => ({
	id: row.id,
	property: {
		id: row.property_id,
		reference_number: row.property_reference_number,
		property_type: row.property_type,
		street_name: row.street_name,
		house_number: row.house_number,
		unit_number: row.unit_number,
		postal_code: row.postal_code,
		city: row.city,
		living_area_m2: Number(row.living_area_m2),
		rooms: Number(row.rooms),
	},
	listing_type: row.listing_type,
	status: row.status,
	archive_outcome: row.archive_outcome,
	price_amount: row.price_amount === null ? null : Number(row.price_amount),
	currency_code: row.currency_code,
	title: row.title,
	description: row.description,
	slug: row.slug,
	seo_title: row.seo_title,
	seo_description: row.seo_description,
	show_exact_address: row.show_exact_address,
	cover_image:
		row.cover_image_id && row.cover_storage_key
			? {
					id: row.cover_image_id,
					url: getStoredImageUrl(row.cover_storage_key),
					alt_text: row.cover_alt_text,
				}
			: null,
	published_at: row.published_at,
	archived_at: row.archived_at,
	created_at: row.created_at,
	updated_at: row.updated_at,
});

const mapListingSummaryRow = (row: ListingRow): AdminListingSummaryType => {
	const {
		description: _description,
		seo_title: _seoTitle,
		seo_description: _seoDescription,
		show_exact_address: _showExactAddress,
		...summary
	} = mapListingRow(row);

	return summary;
};

const normalizeSlug = (value: string): string => {
	const slug = value
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	if (!slug) {
		throw validationError("Slug must contain letters or numbers");
	}

	return slug;
};

const getAvailableSlug = async (
	value: string,
	client: { query: typeof pool.query },
): Promise<string> => {
	const baseSlug = normalizeSlug(value);
	const result = await client.query<{ slug: string }>(
		`SELECT slug
		 FROM listings
		 WHERE slug = $1 OR slug LIKE $1 || '-%';`,
		[baseSlug],
	);
	const existingSlugs = new Set(result.rows.map((row) => row.slug));
	if (!existingSlugs.has(baseSlug)) {
		return baseSlug;
	}

	let suffix = 2;
	while (existingSlugs.has(`${baseSlug}-${suffix}`)) {
		suffix += 1;
	}
	return `${baseSlug}-${suffix}`;
};

const buildGeneratedTitle = (listing: ListingCopySource): string => {
	const propertyType =
		listing.property_type === "APARTMENT" ? "Apartment" : "House";
	const purpose = listing.listing_type === "SALE" ? "for sale" : "for rent";
	return `${propertyType} ${purpose} in ${listing.city}`;
};

const buildGeneratedDescription = (listing: ListingCopySource): string => {
	const propertyType =
		listing.property_type === "APARTMENT" ? "apartment" : "house";
	const purpose = listing.listing_type === "SALE" ? "for sale" : "for rent";
	return `Discover this ${propertyType} ${purpose} in ${listing.city}, offering ${Number(listing.rooms)} rooms and ${Number(listing.living_area_m2)} m² of living space.`;
};

const getListingState = async (
	id: string,
	client: { query: typeof pool.query },
	lock = false,
): Promise<ListingStateRow> => {
	const result = await client.query<ListingStateRow>(
		`${listingSelect.replace(
			"property.rooms,",
			"property.rooms,\n\t\tproperty.archived_at AS property_archived_at,",
		)}
		 WHERE listing.id = $1
		 ${lock ? "FOR UPDATE OF listing, property" : ""};`,
		[id],
	);
	return requireFound(result.rows[0], "Listing not found");
};

export const getAdminListingByIdService = async (
	id: string,
): Promise<AdminListingDetailType> => {
	const row = await getListingState(id, pool);
	const [images, features] = await Promise.all([
		listPropertyImagesService(row.property_id),
		getPropertyFeaturesService(row.property_id),
	]);
	return { ...mapListingRow(row), images, features };
};

export const createListingService = async (
	propertyId: string,
	input: CreateListingDataType,
): Promise<AdminListingDetailType> => {
	const propertyResult = await pool.query<ListingPropertyRow>(
		`SELECT id, archived_at, property_type, city, living_area_m2, rooms
		 FROM properties
		 WHERE id = $1;`,
		[propertyId],
	);
	const property = requireFound(propertyResult.rows[0], "Property not found");
	if (property.archived_at !== null) {
		throw conflictError("Cannot create a listing for an archived property");
	}
	const copySource: ListingCopySource = {
		...property,
		listing_type: input.listing_type,
	};
	const title = input.title ?? buildGeneratedTitle(copySource);
	const description =
		input.description ?? buildGeneratedDescription(copySource);
	const slug = input.slug
		? normalizeSlug(input.slug)
		: await getAvailableSlug(title, pool);

	const result = await pool.query<IdRow>(
		`INSERT INTO listings (
			property_id, listing_type, price_amount, title, description, slug,
			seo_title, seo_description, show_exact_address
		 )
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		 RETURNING id;`,
		[
			propertyId,
			input.listing_type,
			input.price_amount ?? null,
			title,
			description,
			slug,
			input.seo_title ?? null,
			input.seo_description ?? null,
			input.show_exact_address ?? false,
		],
	);
	const created = requireCreated(
		result.rows[0],
		"Listing could not be created",
	);
	return await getAdminListingByIdService(created.id);
};

export const listAdminListingsService = async (
	input: ListListingsDataType,
): Promise<ListingsPageType> => {
	if (
		input.min_price !== undefined &&
		input.max_price !== undefined &&
		input.min_price > input.max_price
	) {
		throw validationError("Minimum price cannot exceed maximum price");
	}

	const page = input.page ?? 1;
	const pageSize = input.page_size ?? 20;
	const offset = (page - 1) * pageSize;
	const sort = input.sort ?? "newest";
	const values: unknown[] = [];
	const conditions: string[] = [];
	const addValue = (value: unknown) => {
		values.push(value);
		return `$${values.length}`;
	};

	if (input.search) {
		const value = addValue(`%${input.search}%`);
		conditions.push(`(
			listing.title ILIKE ${value}
			OR listing.slug ILIKE ${value}
			OR property.reference_number ILIKE ${value}
			OR property.city ILIKE ${value}
			OR property.street_name ILIKE ${value}
		)`);
	}
	if (input.listing_type) {
		conditions.push(`listing.listing_type = ${addValue(input.listing_type)}`);
	}
	if (input.status) {
		conditions.push(`listing.status = ${addValue(input.status)}`);
	}
	if (input.archive_outcome) {
		conditions.push(
			`listing.archive_outcome = ${addValue(input.archive_outcome)}`,
		);
	}
	if (input.property_id) {
		conditions.push(`listing.property_id = ${addValue(input.property_id)}`);
	}
	if (input.city) {
		conditions.push(`LOWER(property.city) = LOWER(${addValue(input.city)})`);
	}
	if (input.min_price !== undefined) {
		conditions.push(`listing.price_amount >= ${addValue(input.min_price)}`);
	}
	if (input.max_price !== undefined) {
		conditions.push(`listing.price_amount <= ${addValue(input.max_price)}`);
	}

	const whereClause = conditions.length
		? `WHERE ${conditions.join(" AND ")}`
		: "";
	const countValues = [...values];
	const limit = addValue(pageSize);
	const skip = addValue(offset);
	const [rowsResult, countResult] = await Promise.all([
		pool.query<ListingRow>(
			`${listingSelect}
			 ${whereClause}
			 ORDER BY ${listingOrderBy[sort]}
			 LIMIT ${limit} OFFSET ${skip};`,
			values,
		),
		pool.query<CountRow>(
			`SELECT COUNT(*) AS total_count
			 FROM listings AS listing
			 JOIN properties AS property ON property.id = listing.property_id
			 ${whereClause};`,
			countValues,
		),
	]);
	const totalItems = Number(countResult.rows[0]?.total_count ?? 0);
	const totalPages = Math.ceil(totalItems / pageSize);
	const { page: _page, page_size: _pageSize, sort: _sort, ...filters } = input;

	return {
		items: rowsResult.rows.map(mapListingSummaryRow),
		page,
		page_size: pageSize,
		total_items: totalItems,
		total_pages: totalPages,
		has_previous_page: page > 1,
		has_next_page: page < totalPages,
		sort,
		filters,
	};
};

export const updateListingService = async (
	id: string,
	input: UpdateListingDataType,
): Promise<AdminListingDetailType> => {
	const listing = await getListingState(id, pool);
	if (listing.status === "ARCHIVED") {
		throw conflictError("Archived listings cannot be edited");
	}
	if (
		listing.status === "PUBLISHED" &&
		input.slug !== undefined &&
		(input.slug === null || normalizeSlug(input.slug) !== listing.slug)
	) {
		throw conflictError("A published listing slug cannot be changed");
	}
	if (listing.status === "PUBLISHED") {
		if (
			input.price_amount === null ||
			input.title === null ||
			input.description === null
		) {
			throw validationError(
				"Published listing price, title, and description cannot be cleared",
			);
		}
	}

	const updates: Array<{ column: string; value: unknown }> = [];
	for (const field of [
		"price_amount",
		"title",
		"description",
		"slug",
		"seo_title",
		"seo_description",
		"show_exact_address",
	] as const) {
		if (input[field] !== undefined) {
			updates.push({
				column: field,
				value:
					field === "slug" && input[field]
						? normalizeSlug(input[field] as string)
						: input[field],
			});
		}
	}
	const assignments = updates.map(
		(update, index) => `${update.column} = $${index + 1}`,
	);
	const values = updates.map((update) => update.value);
	values.push(id);
	await pool.query(
		`UPDATE listings
		 SET ${assignments.join(", ")}, updated_at = CURRENT_TIMESTAMP
		 WHERE id = $${values.length};`,
		values,
	);
	return await getAdminListingByIdService(id);
};

export const publishListingService = async (
	id: string,
): Promise<AdminListingDetailType> => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		const listing = await getListingState(id, client, true);
		if (listing.status !== "DRAFT") {
			throw conflictError("Only draft listings can be published");
		}
		if (listing.property_archived_at !== null) {
			throw conflictError("Cannot publish a listing for an archived property");
		}
		if (listing.price_amount === null) {
			throw validationError("A price is required before publishing");
		}
		if (listing.title === null) {
			throw validationError("A title is required before publishing");
		}
		if (listing.description === null) {
			throw validationError("A description is required before publishing");
		}
		const coverResult = await client.query<IdRow>(
			"SELECT id FROM property_images WHERE property_id = $1 AND is_cover = TRUE;",
			[listing.property_id],
		);
		if (!coverResult.rows[0]) {
			throw validationError("A cover image is required before publishing");
		}

		const slug =
			listing.slug ?? (await getAvailableSlug(listing.title, client));

		await client.query(
			`UPDATE listings
			 SET status = 'PUBLISHED',
			     slug = $1,
			     published_at = CURRENT_TIMESTAMP,
			     updated_at = CURRENT_TIMESTAMP
			 WHERE id = $2;`,
			[slug, id],
		);
		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
	return await getAdminListingByIdService(id);
};

export const archiveListingService = async (
	id: string,
	input: ArchiveListingDataType,
): Promise<AdminListingDetailType> => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		const listing = await getListingState(id, client, true);
		if (listing.status !== "PUBLISHED") {
			throw conflictError("Only published listings can be archived");
		}
		const validOutcome =
			input.archive_outcome === "WITHDRAWN" ||
			(listing.listing_type === "SALE" && input.archive_outcome === "SOLD") ||
			(listing.listing_type === "RENT" && input.archive_outcome === "RENTED");
		if (!validOutcome) {
			throw validationError("Archive outcome does not match the listing type");
		}

		await client.query(
			`UPDATE listings
			 SET status = 'ARCHIVED', archive_outcome = $1,
			     archived_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
			 WHERE id = $2;`,
			[input.archive_outcome, id],
		);

		if (listing.listing_type === "SALE" && input.archive_outcome === "SOLD") {
			await client.query(
				`UPDATE listings
				 SET status = 'ARCHIVED', archive_outcome = 'WITHDRAWN',
				     archived_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
				 WHERE property_id = $1 AND listing_type = 'RENT'
				   AND status = 'PUBLISHED';`,
				[listing.property_id],
			);
			await client.query(
				`DELETE FROM listings
				 WHERE property_id = $1 AND listing_type = 'RENT' AND status = 'DRAFT';`,
				[listing.property_id],
			);
		}

		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
	return await getAdminListingByIdService(id);
};

export const deleteDraftListingService = async (
	id: string,
): Promise<AdminListingType> => {
	const listing = await getListingState(id, pool);
	if (listing.status !== "DRAFT") {
		throw conflictError("Only draft listings can be deleted");
	}
	const result = await pool.query<IdRow>(
		"DELETE FROM listings WHERE id = $1 AND status = 'DRAFT' RETURNING id;",
		[id],
	);
	if (!result.rows[0]) {
		throw notFoundError("Listing not found");
	}
	return mapListingRow(listing);
};
