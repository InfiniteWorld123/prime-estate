import { pool } from "#/backend/db/pool";
import {
	internalError,
	notFoundError,
	rateLimitedError,
	validationError,
} from "#/backend/shared/error";
import { requireFound } from "#/backend/shared/service-utils";
import type {
	CreateInquiryDataType,
	CreateInquiryResultType,
	InquiriesPageType,
	InquiryLeadStatusType,
	InquirySortType,
	InquiryType,
	ListInquiriesDataType,
	UpdateInquiryStatusDataType,
} from "#/shared/types/inquiry.type";

const PRIVACY_POLICY_VERSION = "v1";
const RATE_LIMIT_MAX_REQUESTS = 5;

type InquiryRow = {
	id: string;
	inquiry_type: "GENERAL" | "LISTING";
	interest: "BUYING" | "RENTING" | "GENERAL" | null;
	full_name: string;
	email: string;
	phone: string | null;
	message: string;
	lead_status: InquiryLeadStatusType;
	read_at: Date | null;
	archived_at: Date | null;
	privacy_policy_version: string;
	privacy_accepted_at: Date;
	listing_id: string | null;
	listing_title: string | null;
	listing_slug: string | null;
	reference_number: string | null;
	listing_type: "SALE" | "RENT" | null;
	listing_status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | null;
	archive_outcome: "SOLD" | "RENTED" | "WITHDRAWN" | null;
	created_at: Date;
	updated_at: Date;
};

type CountRow = { total_count: string };
type IdRow = { id: string };
type LeadStatusRow = { lead_status: InquiryLeadStatusType };

const inquiryOrderBy: Record<InquirySortType, string> = {
	newest: "inquiry.created_at DESC, inquiry.id DESC",
	oldest: "inquiry.created_at ASC, inquiry.id ASC",
};

const inquirySelect = `
	SELECT
		inquiry.id,
		inquiry.inquiry_type,
		inquiry.interest,
		inquiry.full_name,
		inquiry.email,
		inquiry.phone,
		inquiry.message,
		inquiry.lead_status,
		inquiry.read_at,
		inquiry.archived_at,
		inquiry.privacy_policy_version,
		inquiry.privacy_accepted_at,
		inquiry.created_at,
		inquiry.updated_at,
		listing.id AS listing_id,
		listing.title AS listing_title,
		listing.slug AS listing_slug,
		property.reference_number,
		listing.listing_type,
		listing.status AS listing_status,
		listing.archive_outcome
	FROM inquiries AS inquiry
	LEFT JOIN listings AS listing ON listing.id = inquiry.listing_id
	LEFT JOIN properties AS property ON property.id = listing.property_id
`;

const mapInquiryRow = (row: InquiryRow): InquiryType => {
	if (
		row.listing_id !== null &&
		(row.listing_title === null ||
			row.listing_slug === null ||
			row.reference_number === null ||
			row.listing_type === null ||
			row.listing_status === null)
	) {
		throw internalError("Inquiry listing data is inconsistent");
	}

	return {
		id: row.id,
		inquiry_type: row.inquiry_type,
		interest: row.interest,
		full_name: row.full_name,
		email: row.email,
		phone: row.phone,
		message: row.message,
		lead_status: row.lead_status,
		read_at: row.read_at,
		archived_at: row.archived_at,
		privacy_policy_version: row.privacy_policy_version,
		privacy_accepted_at: row.privacy_accepted_at,
		listing:
			row.listing_id === null
				? null
				: {
						id: row.listing_id,
						title: row.listing_title as string,
						slug: row.listing_slug as string,
						reference_number: row.reference_number as string,
						listing_type: row.listing_type as "SALE" | "RENT",
						status: row.listing_status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
						archive_outcome: row.archive_outcome,
						is_available: row.listing_status === "PUBLISHED",
					},
		created_at: row.created_at,
		updated_at: row.updated_at,
	};
};

const statusTransitions: Record<
	InquiryLeadStatusType,
	readonly InquiryLeadStatusType[]
> = {
	NEW: ["CONTACTED", "CLOSED"],
	CONTACTED: ["CLOSED"],
	CLOSED: ["CONTACTED"],
};

export const isInquiryStatusTransitionAllowed = (
	current: InquiryLeadStatusType,
	next: InquiryLeadStatusType,
) => current === next || statusTransitions[current].includes(next);

export const createInquiryService = async (
	input: CreateInquiryDataType,
): Promise<CreateInquiryResultType> => {
	if (input.website !== "") {
		return { received: true };
	}

	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		let listingId: string | null = null;
		let interest: "BUYING" | "RENTING" | "GENERAL" | null = null;

		if (input.inquiry_type === "LISTING") {
			const listingResult = await client.query<IdRow>(
				`SELECT id
				 FROM listings
				 WHERE slug = $1
				   AND status = 'PUBLISHED'
				 FOR SHARE;`,
				[input.listing_slug],
			);

			if (!listingResult.rows[0]) {
				throw notFoundError("Listing is not available");
			}

			listingId = listingResult.rows[0].id;
		} else {
			interest = input.interest;
		}

		await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
			input.email,
		]);

		const duplicateResult = await client.query<IdRow>(
			`SELECT id
			 FROM inquiries
			 WHERE email = $1
			   AND inquiry_type = $2
			   AND listing_id IS NOT DISTINCT FROM $3::uuid
			   AND interest IS NOT DISTINCT FROM $4::text
			   AND message = $5
			   AND created_at >= CURRENT_TIMESTAMP - INTERVAL '2 minutes'
			 LIMIT 1;`,
			[input.email, input.inquiry_type, listingId, interest, input.message],
		);

		if (duplicateResult.rows[0]) {
			await client.query("COMMIT");
			return { received: true };
		}

		const rateLimitResult = await client.query<CountRow>(
			`SELECT COUNT(*) AS total_count
			 FROM inquiries
			 WHERE email = $1
			   AND created_at >= CURRENT_TIMESTAMP - INTERVAL '15 minutes';`,
			[input.email],
		);

		if (
			Number(rateLimitResult.rows[0]?.total_count ?? 0) >=
			RATE_LIMIT_MAX_REQUESTS
		) {
			throw rateLimitedError("Too many inquiries. Please try again later");
		}

		await client.query(
			`INSERT INTO inquiries (
				inquiry_type,
				listing_id,
				interest,
				full_name,
				email,
				phone,
				message,
				privacy_policy_version
			 )
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
			[
				input.inquiry_type,
				listingId,
				interest,
				input.full_name,
				input.email,
				input.phone ?? null,
				input.message,
				PRIVACY_POLICY_VERSION,
			],
		);

		await client.query("COMMIT");
		return { received: true };
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const listInquiriesService = async (
	input: ListInquiriesDataType,
): Promise<InquiriesPageType> => {
	const page = input.page ?? 1;
	const pageSize = input.page_size ?? 20;
	const offset = (page - 1) * pageSize;
	const sort = input.sort ?? "newest";
	const conditions: string[] = [];
	const values: unknown[] = [];
	const addValue = (value: unknown) => {
		values.push(value);
		return `$${values.length}`;
	};

	if (input.inquiry_type) {
		conditions.push(`inquiry.inquiry_type = ${addValue(input.inquiry_type)}`);
	}
	if (input.interest) {
		conditions.push(`inquiry.interest = ${addValue(input.interest)}`);
	}
	if (input.lead_status) {
		conditions.push(`inquiry.lead_status = ${addValue(input.lead_status)}`);
	}
	if (input.listing_id) {
		conditions.push(`inquiry.listing_id = ${addValue(input.listing_id)}`);
	}
	if (input.unread === true) {
		conditions.push("inquiry.read_at IS NULL");
	}
	if (input.unread === false) {
		conditions.push("inquiry.read_at IS NOT NULL");
	}

	const archiveStatus = input.archive_status ?? "active";
	if (archiveStatus === "active") {
		conditions.push("inquiry.archived_at IS NULL");
	}
	if (archiveStatus === "archived") {
		conditions.push("inquiry.archived_at IS NOT NULL");
	}

	const whereClause =
		conditions.length === 0 ? "" : `WHERE ${conditions.join(" AND ")}`;
	const countValues = [...values];
	const limit = addValue(pageSize);
	const skip = addValue(offset);

	const [itemsResult, countResult] = await Promise.all([
		pool.query<InquiryRow>(
			`${inquirySelect}
			 ${whereClause}
			 ORDER BY ${inquiryOrderBy[sort]}
			 LIMIT ${limit} OFFSET ${skip};`,
			values,
		),
		pool.query<CountRow>(
			`SELECT COUNT(*) AS total_count
			 FROM inquiries AS inquiry
			 ${whereClause};`,
			countValues,
		),
	]);

	const totalItems = Number(countResult.rows[0]?.total_count ?? 0);
	const totalPages = Math.ceil(totalItems / pageSize);
	const { page: _page, page_size: _pageSize, sort: _sort, ...filters } = input;

	return {
		items: itemsResult.rows.map(mapInquiryRow),
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

export const getInquiryByIdService = async (
	id: string,
): Promise<InquiryType> => {
	const result = await pool.query<InquiryRow>(
		`${inquirySelect}
		 WHERE inquiry.id = $1;`,
		[id],
	);

	return mapInquiryRow(requireFound(result.rows[0], "Inquiry not found"));
};

export const markInquiryReadService = async (
	id: string,
): Promise<InquiryType> => {
	const result = await pool.query<IdRow>(
		`UPDATE inquiries
		 SET
			read_at = COALESCE(read_at, CURRENT_TIMESTAMP),
			updated_at = CASE
				WHEN read_at IS NULL THEN CURRENT_TIMESTAMP
				ELSE updated_at
			END
		 WHERE id = $1
		 RETURNING id;`,
		[id],
	);

	requireFound(result.rows[0], "Inquiry not found");
	return await getInquiryByIdService(id);
};

export const updateInquiryStatusService = async (
	id: string,
	input: UpdateInquiryStatusDataType,
): Promise<InquiryType> => {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");
		const currentResult = await client.query<LeadStatusRow>(
			`SELECT lead_status
			 FROM inquiries
			 WHERE id = $1
			 FOR UPDATE;`,
			[id],
		);
		const current = requireFound(
			currentResult.rows[0],
			"Inquiry not found",
		).lead_status;

		if (!isInquiryStatusTransitionAllowed(current, input.lead_status)) {
			throw validationError(
				`Inquiry status cannot change from ${current} to ${input.lead_status}`,
			);
		}

		if (current !== input.lead_status) {
			await client.query(
				`UPDATE inquiries
				 SET lead_status = $1, updated_at = CURRENT_TIMESTAMP
				 WHERE id = $2;`,
				[input.lead_status, id],
			);
		}

		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}

	return await getInquiryByIdService(id);
};

export const archiveInquiryService = async (
	id: string,
): Promise<InquiryType> => {
	const result = await pool.query<IdRow>(
		`UPDATE inquiries
		 SET
			archived_at = COALESCE(archived_at, CURRENT_TIMESTAMP),
			updated_at = CASE
				WHEN archived_at IS NULL THEN CURRENT_TIMESTAMP
				ELSE updated_at
			END
		 WHERE id = $1
		 RETURNING id;`,
		[id],
	);

	requireFound(result.rows[0], "Inquiry not found");
	return await getInquiryByIdService(id);
};

export const unarchiveInquiryService = async (
	id: string,
): Promise<InquiryType> => {
	const result = await pool.query<IdRow>(
		`UPDATE inquiries
		 SET
			archived_at = NULL,
			updated_at = CASE
				WHEN archived_at IS NOT NULL THEN CURRENT_TIMESTAMP
				ELSE updated_at
			END
		 WHERE id = $1
		 RETURNING id;`,
		[id],
	);

	requireFound(result.rows[0], "Inquiry not found");
	return await getInquiryByIdService(id);
};
