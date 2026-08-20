import { pool } from "#/backend/db/pool";
import { conflictError, validationError } from "#/backend/shared/error";
import { requireCreated, requireFound } from "#/backend/shared/service-utils";
import type {
	CreateFeatureDataType,
	FeatureSortType,
	FeaturesPageType,
	FeatureType,
	ListFeaturesDataType,
	ReplacePropertyFeaturesDataType,
	UpdateFeatureDataType,
} from "#/shared/types/feature.type";

type FeatureCountRow = { total_count: string };
type ExistsRow = { exists: boolean };
type IdRow = { id: string };

const featureOrderBy: Record<FeatureSortType, string> = {
	name_asc: "LOWER(name) ASC, id ASC",
	name_desc: "LOWER(name) DESC, id DESC",
	code_asc: "code ASC, id ASC",
	newest: "created_at DESC, id DESC",
	oldest: "created_at ASC, id ASC",
};

const generateFeatureCode = (name: string): string => {
	const code = name
		.replace(/ß/g, "ss")
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toUpperCase()
		.replace(/[^A-Z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");

	if (!code || !/^[A-Z]/.test(code)) {
		throw validationError(
			"Feature name must generate a code beginning with a letter",
		);
	}

	return code;
};

export const createFeatureService = async (
	input: CreateFeatureDataType,
): Promise<FeatureType> => {
	const query = `
		INSERT INTO features (code, name)
		VALUES ($1, $2)
		RETURNING id, code, name, created_at, updated_at;
	`;
	const result = await pool.query<FeatureType>(query, [
		generateFeatureCode(input.name),
		input.name,
	]);
	return requireCreated(result.rows[0], "Feature could not be created");
};

export const listFeaturesService = async (
	input: ListFeaturesDataType,
): Promise<FeaturesPageType> => {
	const page = input.page ?? 1;
	const pageSize = input.page_size ?? 20;
	const offset = (page - 1) * pageSize;
	const search = input.search ? `%${input.search}%` : null;
	const sort = input.sort ?? "name_asc";
	const orderBy = featureOrderBy[sort];

	const listQuery = `
		SELECT id, code, name, created_at, updated_at
		FROM features
		WHERE (
			$1::text IS NULL
			OR name ILIKE $1
			OR code ILIKE $1
		)
		ORDER BY ${orderBy}
		LIMIT $2 OFFSET $3;
	`;
	const countQuery = `
		SELECT COUNT(*) AS total_count
		FROM features
		WHERE (
			$1::text IS NULL
			OR name ILIKE $1
			OR code ILIKE $1
		);
	`;
	const [featuresResult, countResult] = await Promise.all([
		pool.query<FeatureType>(listQuery, [search, pageSize, offset]),
		pool.query<FeatureCountRow>(countQuery, [search]),
	]);
	const totalItems = Number(countResult.rows[0]?.total_count ?? 0);
	const totalPages = Math.ceil(totalItems / pageSize);
	return {
		items: featuresResult.rows,
		page,
		page_size: pageSize,
		total_items: totalItems,
		total_pages: totalPages,
		has_previous_page: page > 1,
		has_next_page: page < totalPages,
		sort,
	};
};

export const listFeatureOptionsService = async (): Promise<FeatureType[]> => {
	const result = await pool.query<FeatureType>(`
		SELECT id, code, name, created_at, updated_at
		FROM features
		ORDER BY LOWER(name) ASC, id ASC;
	`);
	return result.rows;
};

export const getFeatureByIdService = async (
	id: string,
): Promise<FeatureType> => {
	const result = await pool.query<FeatureType>(
		`SELECT id, code, name, created_at, updated_at FROM features WHERE id = $1;`,
		[id],
	);
	return requireFound(result.rows[0], "Feature not found");
};

export const updateFeatureService = async (
	id: string,
	input: UpdateFeatureDataType,
): Promise<FeatureType> => {
	const result = await pool.query<FeatureType>(
		`UPDATE features
		 SET name = $1, updated_at = CURRENT_TIMESTAMP
		 WHERE id = $2
		 RETURNING id, code, name, created_at, updated_at;`,
		[input.name, id],
	);
	return requireFound(result.rows[0], "Feature not found");
};

export const deleteFeatureService = async (
	id: string,
): Promise<FeatureType> => {
	const usageResult = await pool.query<ExistsRow>(
		`SELECT EXISTS (
			SELECT 1 FROM property_features WHERE feature_id = $1
		 ) AS exists;`,
		[id],
	);
	if (usageResult.rows[0]?.exists) {
		throw conflictError(
			"Feature cannot be deleted while it is used by properties",
		);
	}
	const result = await pool.query<FeatureType>(
		`DELETE FROM features
		 WHERE id = $1
		 RETURNING id, code, name, created_at, updated_at;`,
		[id],
	);
	return requireFound(result.rows[0], "Feature not found");
};

export const getPropertyFeaturesService = async (
	propertyId: string,
): Promise<FeatureType[]> => {
	const propertyResult = await pool.query<IdRow>(
		"SELECT id FROM properties WHERE id = $1;",
		[propertyId],
	);
	requireFound(propertyResult.rows[0], "Property not found");
	const result = await pool.query<FeatureType>(
		`SELECT f.id, f.code, f.name, f.created_at, f.updated_at
		 FROM property_features AS pf
		 JOIN features AS f ON f.id = pf.feature_id
		 WHERE pf.property_id = $1
		 ORDER BY LOWER(f.name) ASC, f.id ASC;`,
		[propertyId],
	);
	return result.rows;
};

export const replacePropertyFeaturesService = async (
	propertyId: string,
	input: ReplacePropertyFeaturesDataType,
): Promise<FeatureType[]> => {
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		const propertyResult = await client.query<IdRow>(
			"SELECT id FROM properties WHERE id = $1 FOR UPDATE;",
			[propertyId],
		);
		requireFound(propertyResult.rows[0], "Property not found");

		if (input.feature_ids.length > 0) {
			const featuresResult = await client.query<IdRow>(
				"SELECT id FROM features WHERE id = ANY($1::uuid[]);",
				[input.feature_ids],
			);
			if (featuresResult.rowCount !== input.feature_ids.length) {
				throw validationError("One or more feature IDs do not exist");
			}
		}

		await client.query(
			"DELETE FROM property_features WHERE property_id = $1;",
			[propertyId],
		);
		if (input.feature_ids.length > 0) {
			await client.query(
				`INSERT INTO property_features (property_id, feature_id)
				 SELECT $1, feature_id
				 FROM unnest($2::uuid[]) AS feature_id;`,
				[propertyId, input.feature_ids],
			);
		}
		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
	return await getPropertyFeaturesService(propertyId);
};
