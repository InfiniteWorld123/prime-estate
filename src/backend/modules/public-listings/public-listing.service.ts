import { pool } from "#/backend/db/pool";
import { notFoundError, validationError } from "#/backend/shared/error";
import { getStoredImageUrl } from "#/backend/shared/image-storage";
import type {
	ListPublicListingsQueryType,
	PublicFeatureType,
	PublicImageType,
	PublicListingCardType,
	PublicListingDetailType,
	PublicListingSortType,
	PublicListingsPageType,
} from "#/shared/types/public-listing.type";

type PublicListingRow = {
	property_id: string;
	reference_number: string;
	property_type: "APARTMENT" | "HOUSE";
	street_name: string;
	house_number: string;
	unit_number: string | null;
	postal_code: string;
	city: string;
	living_area_m2: string;
	plot_area_m2: string | null;
	rooms: string;
	bedrooms: number | null;
	bathrooms: number;
	year_built: number | null;
	floor_number: number | null;
	total_floors: number | null;
	slug: string;
	title: string;
	description: string;
	seo_title: string | null;
	seo_description: string | null;
	listing_type: "SALE" | "RENT";
	status: "PUBLISHED" | "ARCHIVED";
	archive_outcome: "SOLD" | "RENTED" | "WITHDRAWN" | null;
	price_amount: string;
	currency_code: "EUR";
	show_exact_address: boolean;
	cover_image_id: string;
	cover_storage_key: string;
	cover_alt_text: string | null;
	published_at: Date;
	archived_at: Date | null;
};

type PublicImageRow = {
	id: string;
	storage_key: string;
	alt_text: string | null;
	sort_order: number;
	is_cover: boolean;
};

type CountRow = { total_count: string };

const publicOrderBy: Record<PublicListingSortType, string> = {
	newest: "listing.published_at DESC, listing.id DESC",
	price_asc: "listing.price_amount ASC, listing.id ASC",
	price_desc: "listing.price_amount DESC, listing.id DESC",
	living_area_asc: "property.living_area_m2 ASC, listing.id ASC",
	living_area_desc: "property.living_area_m2 DESC, listing.id DESC",
};

const publicListingSelect = `
	SELECT
		listing.property_id,
		property.reference_number,
		property.property_type,
		property.street_name,
		property.house_number,
		property.unit_number,
		property.postal_code,
		property.city,
		property.living_area_m2,
		property.plot_area_m2,
		property.rooms,
		property.bedrooms,
		property.bathrooms,
		property.year_built,
		property.floor_number,
		property.total_floors,
		listing.slug,
		listing.title,
		listing.description,
		listing.seo_title,
		listing.seo_description,
		listing.listing_type,
		listing.status,
		listing.archive_outcome,
		listing.price_amount,
		listing.currency_code,
		listing.show_exact_address,
		cover.id AS cover_image_id,
		cover.storage_key AS cover_storage_key,
		cover.alt_text AS cover_alt_text,
		listing.published_at,
		listing.archived_at
	FROM listings AS listing
	JOIN properties AS property ON property.id = listing.property_id
	JOIN LATERAL (
		SELECT image.id, image.storage_key, image.alt_text
		FROM property_images AS image
		WHERE image.property_id = property.id AND image.is_cover = TRUE
		LIMIT 1
	) AS cover ON TRUE
`;

const publicAddress = (row: PublicListingRow) => ({
	street_name: row.show_exact_address ? row.street_name : null,
	house_number: row.show_exact_address ? row.house_number : null,
	unit_number: row.show_exact_address ? row.unit_number : null,
	postal_code: row.postal_code,
	city: row.city,
});

const publicCover = (row: PublicListingRow): PublicImageType => ({
	id: row.cover_image_id,
	url: getStoredImageUrl(row.cover_storage_key),
	alt_text: row.cover_alt_text,
	sort_order: 0,
	is_cover: true,
});

const mapPublicCard = (row: PublicListingRow): PublicListingCardType => ({
	slug: row.slug,
	title: row.title,
	listing_type: row.listing_type,
	price_amount: Number(row.price_amount),
	currency_code: row.currency_code,
	property: {
		reference_number: row.reference_number,
		property_type: row.property_type,
		address: publicAddress(row),
		living_area_m2: Number(row.living_area_m2),
		rooms: Number(row.rooms),
		bedrooms: row.bedrooms,
	},
	cover_image: publicCover(row),
	published_at: row.published_at,
});

const validateRange = (
	label: string,
	minimum: number | undefined,
	maximum: number | undefined,
) => {
	if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
		throw validationError(`${label} minimum cannot exceed maximum`);
	}
};

export const listPublicListingsService = async (
	input: ListPublicListingsQueryType,
): Promise<PublicListingsPageType> => {
	validateRange("Price", input.min_price, input.max_price);
	validateRange("Living area", input.min_living_area, input.max_living_area);
	validateRange("Rooms", input.min_rooms, input.max_rooms);

	const page = input.page ?? 1;
	const pageSize = input.page_size ?? 20;
	const offset = (page - 1) * pageSize;
	const sort = input.sort ?? "newest";
	const values: unknown[] = [];
	const conditions = [
		"listing.status = 'PUBLISHED'",
		`EXISTS (
			SELECT 1 FROM property_images AS public_cover
			WHERE public_cover.property_id = property.id
			  AND public_cover.is_cover = TRUE
		)`,
	];
	const addValue = (value: unknown) => {
		values.push(value);
		return `$${values.length}`;
	};

	if (input.listing_type) {
		conditions.push(`listing.listing_type = ${addValue(input.listing_type)}`);
	}
	if (input.property_type) {
		conditions.push(
			`property.property_type = ${addValue(input.property_type)}`,
		);
	}
	if (input.city) {
		conditions.push(`LOWER(property.city) = LOWER(${addValue(input.city)})`);
	}
	if (input.postal_code) {
		conditions.push(`property.postal_code = ${addValue(input.postal_code)}`);
	}

	for (const filter of [
		{ value: input.min_price, column: "listing.price_amount", operator: ">=" },
		{ value: input.max_price, column: "listing.price_amount", operator: "<=" },
		{
			value: input.min_living_area,
			column: "property.living_area_m2",
			operator: ">=",
		},
		{
			value: input.max_living_area,
			column: "property.living_area_m2",
			operator: "<=",
		},
		{ value: input.min_rooms, column: "property.rooms", operator: ">=" },
		{ value: input.max_rooms, column: "property.rooms", operator: "<=" },
		{ value: input.min_bedrooms, column: "property.bedrooms", operator: ">=" },
	] as const) {
		if (filter.value !== undefined) {
			conditions.push(
				`${filter.column} ${filter.operator} ${addValue(filter.value)}`,
			);
		}
	}

	if (input.feature_ids?.length) {
		const featureIds = addValue(input.feature_ids);
		conditions.push(`EXISTS (
			SELECT 1
			FROM property_features AS selected_feature
			WHERE selected_feature.property_id = property.id
			  AND selected_feature.feature_id = ANY(${featureIds}::uuid[])
			GROUP BY selected_feature.property_id
			HAVING COUNT(DISTINCT selected_feature.feature_id) = ${input.feature_ids.length}
		)`);
	}

	const whereClause = `WHERE ${conditions.join(" AND ")}`;
	const countValues = [...values];
	const limit = addValue(pageSize);
	const skip = addValue(offset);
	const [listResult, countResult] = await Promise.all([
		pool.query<PublicListingRow>(
			`${publicListingSelect}
			 ${whereClause}
			 ORDER BY ${publicOrderBy[sort]}
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
		items: listResult.rows.map(mapPublicCard),
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

export const getPublicListingBySlugService = async (
	slug: string,
): Promise<PublicListingDetailType> => {
	const listingResult = await pool.query<PublicListingRow>(
		`${publicListingSelect}
		 WHERE listing.slug = $1
		   AND (
			listing.status = 'PUBLISHED'
			OR (
				listing.status = 'ARCHIVED'
				AND listing.archive_outcome IN ('SOLD', 'RENTED')
			)
		   );`,
		[slug],
	);
	const listing = listingResult.rows[0];
	if (!listing) {
		throw notFoundError("Listing not found");
	}

	const [imagesResult, featuresResult] = await Promise.all([
		pool.query<PublicImageRow>(
			`SELECT id, storage_key, alt_text, sort_order, is_cover
			 FROM property_images
			 WHERE property_id = $1
			 ORDER BY sort_order ASC, created_at ASC, id ASC;`,
			[listing.property_id],
		),
		pool.query<PublicFeatureType>(
			`SELECT feature.id, feature.code, feature.name
			 FROM property_features AS property_feature
			 JOIN features AS feature ON feature.id = property_feature.feature_id
			 WHERE property_feature.property_id = $1
			 ORDER BY LOWER(feature.name) ASC, feature.id ASC;`,
			[listing.property_id],
		),
	]);

	return {
		slug: listing.slug,
		title: listing.title,
		description: listing.description,
		seo_title: listing.seo_title ?? listing.title,
		seo_description:
			listing.seo_description ?? listing.description.slice(0, 160),
		listing_type: listing.listing_type,
		price_amount: Number(listing.price_amount),
		currency_code: listing.currency_code,
		archive_outcome: listing.archive_outcome,
		is_available: listing.status === "PUBLISHED",
		property: {
			reference_number: listing.reference_number,
			property_type: listing.property_type,
			address: publicAddress(listing),
			living_area_m2: Number(listing.living_area_m2),
			plot_area_m2:
				listing.plot_area_m2 === null ? null : Number(listing.plot_area_m2),
			rooms: Number(listing.rooms),
			bedrooms: listing.bedrooms,
			bathrooms: listing.bathrooms,
			year_built: listing.year_built,
			floor_number: listing.floor_number,
			total_floors: listing.total_floors,
		},
		images: imagesResult.rows.map((image) => ({
			id: image.id,
			url: getStoredImageUrl(image.storage_key),
			alt_text: image.alt_text,
			sort_order: image.sort_order,
			is_cover: image.is_cover,
		})),
		features: featuresResult.rows,
		published_at: listing.published_at,
		archived_at: listing.archived_at,
	};
};

export const listPublicFeaturesService = async (): Promise<
	PublicFeatureType[]
> => {
	const result = await pool.query<PublicFeatureType>(
		`SELECT feature.id, feature.code, feature.name
		 FROM features AS feature
		 JOIN property_features AS property_feature
		   ON property_feature.feature_id = feature.id
		 JOIN listings AS listing
		   ON listing.property_id = property_feature.property_id
		  AND listing.status = 'PUBLISHED'
		 GROUP BY feature.id, feature.code, feature.name
		 ORDER BY LOWER(feature.name) ASC, feature.id ASC;`,
	);
	return result.rows;
};
