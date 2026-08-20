import { pool } from "#/backend/db/pool";
import { getContactByIdService } from "#/backend/modules/contacts/contact.service";
import { conflictError, validationError } from "#/backend/shared/error";
import { requireCreated, requireFound } from "#/backend/shared/service-utils";
import type {
	CreatePropertyDataType,
	ListPropertiesDataType,
	PropertiesPageType,
	PropertySortType,
	PropertyType,
	UpdatePropertyDataType,
} from "#/shared/types/property.type";

type PropertyRow = {
	id: string;
	reference_number: string;

	property_type: "APARTMENT" | "HOUSE";
	property_source: "AGENCY_OWNED" | "EXTERNAL_CLIENT";

	primary_contact_id: string | null;
	contact_full_name: string | null;
	contact_company_name: string | null;
	contact_email: string | null;
	contact_phone: string | null;

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

	archived_at: Date | null;
	created_at: Date;
	updated_at: Date;
};

type PropertyIdRow = {
	id: string;
};

type PropertyCountRow = {
	total_count: string;
};

type ExistsRow = {
	exists: boolean;
};

const propertyOrderBy: Record<PropertySortType, string> = {
	newest: "p.created_at DESC, p.id DESC",
	oldest: "p.created_at ASC, p.id ASC",

	recently_updated: "p.updated_at DESC, p.id DESC",

	reference_asc: "p.reference_number ASC",
	reference_desc: "p.reference_number DESC",

	living_area_asc: "p.living_area_m2 ASC, p.id ASC",
	living_area_desc: "p.living_area_m2 DESC, p.id DESC",

	rooms_asc: "p.rooms ASC, p.id ASC",
	rooms_desc: "p.rooms DESC, p.id DESC",

	year_built_asc: "p.year_built ASC NULLS LAST, p.id ASC",

	year_built_desc: "p.year_built DESC NULLS LAST, p.id DESC",

	city_asc: "LOWER(p.city) ASC, p.id ASC",
	city_desc: "LOWER(p.city) DESC, p.id DESC",
};

const mapPropertyRow = (row: PropertyRow): PropertyType => ({
	id: row.id,
	reference_number: row.reference_number,

	property_type: row.property_type,
	property_source: row.property_source,

	primary_contact:
		row.primary_contact_id === null
			? null
			: {
					id: row.primary_contact_id,
					full_name: row.contact_full_name ?? "",
					company_name: row.contact_company_name,
					email: row.contact_email,
					phone: row.contact_phone,
				},

	street_name: row.street_name,
	house_number: row.house_number,
	unit_number: row.unit_number,
	postal_code: row.postal_code,
	city: row.city,

	living_area_m2: Number(row.living_area_m2),

	plot_area_m2: row.plot_area_m2 === null ? null : Number(row.plot_area_m2),

	rooms: Number(row.rooms),
	bedrooms: row.bedrooms,
	bathrooms: row.bathrooms,
	year_built: row.year_built,
	floor_number: row.floor_number,
	total_floors: row.total_floors,

	archived_at: row.archived_at,
	created_at: row.created_at,
	updated_at: row.updated_at,
});

const validatePropertyState = ({
	property_type,
	property_source,
	primary_contact_id,
	plot_area_m2,
	floor_number,
}: {
	property_type: "APARTMENT" | "HOUSE";
	property_source: "AGENCY_OWNED" | "EXTERNAL_CLIENT";
	primary_contact_id: string | null;
	plot_area_m2: number | null;
	floor_number: number | null;
}) => {
	if (property_source === "EXTERNAL_CLIENT" && primary_contact_id === null) {
		throw validationError(
			"External client properties require a primary contact",
		);
	}

	if (property_source === "AGENCY_OWNED" && primary_contact_id !== null) {
		throw validationError(
			"Agency-owned properties cannot have a primary contact",
		);
	}

	if (property_type === "APARTMENT" && plot_area_m2 !== null) {
		throw validationError("Apartments cannot have a plot area");
	}

	if (property_type === "HOUSE" && floor_number !== null) {
		throw validationError("Houses cannot have an apartment floor number");
	}
};

const ensureContactExists = async (primaryContactId: string | null) => {
	if (primaryContactId !== null) {
		await getContactByIdService(primaryContactId);
	}
};

const validateFilterRange = (
	label: string,
	minimum: number | undefined,
	maximum: number | undefined,
) => {
	if (minimum !== undefined && maximum !== undefined && minimum > maximum) {
		throw validationError(`${label} minimum cannot exceed maximum`);
	}
};

export const createPropertyService = async (
	input: CreatePropertyDataType,
): Promise<PropertyType> => {
	const primaryContactId = input.primary_contact_id ?? null;

	validatePropertyState({
		property_type: input.property_type,
		property_source: input.property_source,
		primary_contact_id: primaryContactId,
		plot_area_m2: input.plot_area_m2 ?? null,
		floor_number: input.floor_number ?? null,
	});

	await ensureContactExists(primaryContactId);

	const query = `
		INSERT INTO properties (
			primary_contact_id,
			property_type,
			property_source,
			street_name,
			house_number,
			unit_number,
			postal_code,
			city,
			living_area_m2,
			plot_area_m2,
			rooms,
			bedrooms,
			bathrooms,
			year_built,
			floor_number,
			total_floors
		)
		VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8,
			$9, $10, $11, $12, $13, $14, $15, $16
		)
		RETURNING id;
	`;

	const values = [
		primaryContactId,
		input.property_type,
		input.property_source,

		input.street_name,
		input.house_number,
		input.unit_number ?? null,
		input.postal_code,
		input.city,

		input.living_area_m2,
		input.plot_area_m2 ?? null,
		input.rooms,
		input.bedrooms ?? null,
		input.bathrooms,
		input.year_built ?? null,
		input.floor_number ?? null,
		input.total_floors ?? null,
	];

	const result = await pool.query<PropertyIdRow>(query, values);

	const created = requireCreated(
		result.rows[0],
		"Property could not be created",
	);

	return await getPropertyByIdService(created.id);
};

export const listPropertiesService = async (
	input: ListPropertiesDataType,
): Promise<PropertiesPageType> => {
	validateFilterRange(
		"Living area",
		input.min_living_area,
		input.max_living_area,
	);
	validateFilterRange("Plot area", input.min_plot_area, input.max_plot_area);
	validateFilterRange("Rooms", input.min_rooms, input.max_rooms);
	validateFilterRange("Bedrooms", input.min_bedrooms, input.max_bedrooms);
	validateFilterRange("Bathrooms", input.min_bathrooms, input.max_bathrooms);
	validateFilterRange("Year built", input.min_year_built, input.max_year_built);

	const page = input.page ?? 1;
	const pageSize = input.page_size ?? 20;
	const offset = (page - 1) * pageSize;

	const sort = input.sort ?? "newest";
	const orderBy = propertyOrderBy[sort];

	const conditions: string[] = [];
	const values: unknown[] = [];

	const addValue = (value: unknown): string => {
		values.push(value);
		return `$${values.length}`;
	};

	if (input.search) {
		const placeholder = addValue(`%${input.search}%`);

		conditions.push(`
			(
				p.reference_number ILIKE ${placeholder}
				OR p.street_name ILIKE ${placeholder}
				OR p.house_number ILIKE ${placeholder}
				OR p.city ILIKE ${placeholder}
				OR p.postal_code ILIKE ${placeholder}
				OR c.full_name ILIKE ${placeholder}
				OR c.company_name ILIKE ${placeholder}
			)
		`);
	}

	if (input.property_type) {
		const placeholder = addValue(input.property_type);
		conditions.push(`p.property_type = ${placeholder}`);
	}

	if (input.property_source) {
		const placeholder = addValue(input.property_source);
		conditions.push(`p.property_source = ${placeholder}`);
	}

	if (input.city) {
		const placeholder = addValue(input.city);
		conditions.push(`LOWER(p.city) = LOWER(${placeholder})`);
	}

	if (input.postal_code) {
		const placeholder = addValue(input.postal_code);
		conditions.push(`p.postal_code = ${placeholder}`);
	}

	if (input.primary_contact_id) {
		const placeholder = addValue(input.primary_contact_id);

		conditions.push(`p.primary_contact_id = ${placeholder}`);
	}

	const archiveStatus = input.archive_status ?? "active";

	if (archiveStatus === "active") {
		conditions.push("p.archived_at IS NULL");
	}

	if (archiveStatus === "archived") {
		conditions.push("p.archived_at IS NOT NULL");
	}

	const numericFilters: Array<{
		value: number | undefined;
		column: string;
		operator: ">=" | "<=";
	}> = [
		{
			value: input.min_living_area,
			column: "p.living_area_m2",
			operator: ">=",
		},
		{
			value: input.max_living_area,
			column: "p.living_area_m2",
			operator: "<=",
		},
		{
			value: input.min_plot_area,
			column: "p.plot_area_m2",
			operator: ">=",
		},
		{
			value: input.max_plot_area,
			column: "p.plot_area_m2",
			operator: "<=",
		},
		{
			value: input.min_rooms,
			column: "p.rooms",
			operator: ">=",
		},
		{
			value: input.max_rooms,
			column: "p.rooms",
			operator: "<=",
		},
		{
			value: input.min_bedrooms,
			column: "p.bedrooms",
			operator: ">=",
		},
		{
			value: input.max_bedrooms,
			column: "p.bedrooms",
			operator: "<=",
		},
		{
			value: input.min_bathrooms,
			column: "p.bathrooms",
			operator: ">=",
		},
		{
			value: input.max_bathrooms,
			column: "p.bathrooms",
			operator: "<=",
		},
		{
			value: input.min_year_built,
			column: "p.year_built",
			operator: ">=",
		},
		{
			value: input.max_year_built,
			column: "p.year_built",
			operator: "<=",
		},
	];

	for (const filter of numericFilters) {
		if (filter.value !== undefined) {
			const placeholder = addValue(filter.value);

			conditions.push(`${filter.column} ${filter.operator} ${placeholder}`);
		}
	}

	const whereClause =
		conditions.length === 0 ? "" : `WHERE ${conditions.join(" AND ")}`;

	const countValues = [...values];

	const limitPlaceholder = addValue(pageSize);
	const offsetPlaceholder = addValue(offset);

	const listQuery = `
		SELECT
			p.id,
			p.reference_number,
			p.property_type,
			p.property_source,
			p.primary_contact_id,
			c.full_name AS contact_full_name,
			c.company_name AS contact_company_name,
			c.email AS contact_email,
			c.phone AS contact_phone,
			p.street_name,
			p.house_number,
			p.unit_number,
			p.postal_code,
			p.city,
			p.living_area_m2,
			p.plot_area_m2,
			p.rooms,
			p.bedrooms,
			p.bathrooms,
			p.year_built,
			p.floor_number,
			p.total_floors,
			p.archived_at,
			p.created_at,
			p.updated_at
		FROM properties AS p
		LEFT JOIN contacts AS c
			ON c.id = p.primary_contact_id
		${whereClause}
		ORDER BY ${orderBy}
		LIMIT ${limitPlaceholder}
		OFFSET ${offsetPlaceholder};
	`;

	const countQuery = `
		SELECT COUNT(*) AS total_count
		FROM properties AS p
		LEFT JOIN contacts AS c
			ON c.id = p.primary_contact_id
		${whereClause};
	`;

	const [propertiesResult, countResult] = await Promise.all([
		pool.query<PropertyRow>(listQuery, values),

		pool.query<PropertyCountRow>(countQuery, countValues),
	]);

	const totalItems = Number(countResult.rows[0]?.total_count ?? 0);

	const totalPages = Math.ceil(totalItems / pageSize);

	const { page: _page, page_size: _pageSize, sort: _sort, ...filters } = input;

	return {
		items: propertiesResult.rows.map(mapPropertyRow),

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

export const getPropertyByIdService = async (
	id: string,
): Promise<PropertyType> => {
	const query = `
		SELECT
			p.id,
			p.reference_number,
			p.property_type,
			p.property_source,
			p.primary_contact_id,
			c.full_name AS contact_full_name,
			c.company_name AS contact_company_name,
			c.email AS contact_email,
			c.phone AS contact_phone,
			p.street_name,
			p.house_number,
			p.unit_number,
			p.postal_code,
			p.city,
			p.living_area_m2,
			p.plot_area_m2,
			p.rooms,
			p.bedrooms,
			p.bathrooms,
			p.year_built,
			p.floor_number,
			p.total_floors,
			p.archived_at,
			p.created_at,
			p.updated_at
		FROM properties AS p
		LEFT JOIN contacts AS c
			ON c.id = p.primary_contact_id
		WHERE p.id = $1;
	`;

	const result = await pool.query<PropertyRow>(query, [id]);

	const property = requireFound(result.rows[0], "Property not found");

	return mapPropertyRow(property);
};

export const updatePropertyService = async (
	id: string,
	input: UpdatePropertyDataType,
): Promise<PropertyType> => {
	const currentProperty = await getPropertyByIdService(id);

	const normalizedInput: UpdatePropertyDataType = {
		...input,
	};

	if (
		input.property_source === "AGENCY_OWNED" &&
		input.primary_contact_id === undefined
	) {
		normalizedInput.primary_contact_id = null;
	}

	if (input.property_type === "APARTMENT" && input.plot_area_m2 === undefined) {
		normalizedInput.plot_area_m2 = null;
	}

	if (input.property_type === "HOUSE" && input.floor_number === undefined) {
		normalizedInput.floor_number = null;
	}

	const propertyType =
		normalizedInput.property_type ?? currentProperty.property_type;

	const propertySource =
		normalizedInput.property_source ?? currentProperty.property_source;

	const primaryContactId =
		normalizedInput.primary_contact_id === undefined
			? (currentProperty.primary_contact?.id ?? null)
			: normalizedInput.primary_contact_id;

	const plotArea =
		normalizedInput.plot_area_m2 === undefined
			? currentProperty.plot_area_m2
			: normalizedInput.plot_area_m2;

	const floorNumber =
		normalizedInput.floor_number === undefined
			? currentProperty.floor_number
			: normalizedInput.floor_number;

	validatePropertyState({
		property_type: propertyType,
		property_source: propertySource,
		primary_contact_id: primaryContactId,
		plot_area_m2: plotArea,
		floor_number: floorNumber,
	});

	await ensureContactExists(primaryContactId);

	const updates: Array<{
		column: string;
		value: unknown;
	}> = [];

	const allowedFields = [
		"primary_contact_id",
		"property_type",
		"property_source",
		"street_name",
		"house_number",
		"unit_number",
		"postal_code",
		"city",
		"living_area_m2",
		"plot_area_m2",
		"rooms",
		"bedrooms",
		"bathrooms",
		"year_built",
		"floor_number",
		"total_floors",
	] as const;

	for (const field of allowedFields) {
		const value = normalizedInput[field];

		if (value !== undefined) {
			updates.push({
				column: field,
				value,
			});
		}
	}

	const assignments = updates.map(
		(update, index) => `${update.column} = $${index + 1}`,
	);

	const values = updates.map((update) => update.value);

	values.push(id);

	const idPlaceholder = `$${values.length}`;

	const query = `
		UPDATE properties
		SET
			${assignments.join(", ")},
			updated_at = CURRENT_TIMESTAMP
		WHERE id = ${idPlaceholder}
		RETURNING id;
	`;

	const result = await pool.query<PropertyIdRow>(query, values);

	requireFound(result.rows[0], "Property not found");

	return await getPropertyByIdService(id);
};

const hasOpenListingsService = async (propertyId: string): Promise<boolean> => {
	const query = `
		SELECT EXISTS (
			SELECT 1
			FROM listings
			WHERE property_id = $1
				AND status IN ('DRAFT', 'PUBLISHED')
		) AS exists;
	`;

	const result = await pool.query<ExistsRow>(query, [propertyId]);

	return result.rows[0]?.exists ?? false;
};

const hasAnyListingsService = async (propertyId: string): Promise<boolean> => {
	const query = `
		SELECT EXISTS (
			SELECT 1
			FROM listings
			WHERE property_id = $1
		) AS exists;
	`;

	const result = await pool.query<ExistsRow>(query, [propertyId]);

	return result.rows[0]?.exists ?? false;
};

export const archivePropertyService = async (
	id: string,
): Promise<PropertyType> => {
	const property = await getPropertyByIdService(id);

	if (property.archived_at !== null) {
		throw conflictError("Property is already archived");
	}

	if (await hasOpenListingsService(id)) {
		throw conflictError(
			"Property cannot be archived while it has open listings",
		);
	}

	const query = `
		UPDATE properties
		SET
			archived_at = CURRENT_TIMESTAMP,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
			AND archived_at IS NULL
		RETURNING id;
	`;

	const result = await pool.query<PropertyIdRow>(query, [id]);

	requireFound(result.rows[0], "Property not found");

	return await getPropertyByIdService(id);
};

export const restorePropertyService = async (
	id: string,
): Promise<PropertyType> => {
	const property = await getPropertyByIdService(id);

	if (property.archived_at === null) {
		throw conflictError("Property is not archived");
	}

	const query = `
		UPDATE properties
		SET
			archived_at = NULL,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
			AND archived_at IS NOT NULL
		RETURNING id;
	`;

	const result = await pool.query<PropertyIdRow>(query, [id]);

	requireFound(result.rows[0], "Property not found");

	return await getPropertyByIdService(id);
};

export const deletePropertyService = async (
	id: string,
): Promise<PropertyType> => {
	const property = await getPropertyByIdService(id);

	if (await hasAnyListingsService(id)) {
		throw conflictError(
			"Delete the property's draft listings first. Properties with published listing history cannot be deleted",
		);
	}

	const query = `
		DELETE FROM properties
		WHERE id = $1
		RETURNING id;
	`;

	const result = await pool.query<PropertyIdRow>(query, [id]);

	requireFound(result.rows[0], "Property not found");

	return property;
};
