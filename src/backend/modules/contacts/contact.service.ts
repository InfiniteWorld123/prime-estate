import { pool } from "#/backend/db/pool";
import { validationError } from "#/backend/shared/error";
import { requireCreated, requireFound } from "#/backend/shared/service-utils";
import type {
	ContactSortType,
	ContactsPageType,
	ContactType,
	CreateContactDataType,
	ListContactsDataType,
	UpdateContactDataType,
} from "#/shared/types/contact.type";

type ContactCountRow = {
	total_count: string;
};

const contactOrderBy: Record<ContactSortType, string> = {
	newest: "created_at DESC, id DESC",
	oldest: "created_at ASC, id ASC",
	name_asc: "LOWER(full_name) ASC, id ASC",
	name_desc: "LOWER(full_name) DESC, id DESC",
};

export const createContactService = async (
	input: CreateContactDataType,
): Promise<ContactType> => {
	const query = `
        INSERT INTO contacts (
            full_name,
            company_name,
            email,
            phone
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            full_name,
            company_name,
            email,
            phone,
            created_at,
            updated_at;
    `;

	const values = [
		input.full_name,
		input.company_name ?? null,
		input.email ?? null,
		input.phone ?? null,
	];

	const result = await pool.query<ContactType>(query, values);

	return requireCreated(result.rows[0], "Contact could not be created");
};

export const listContactsService = async (
	input: ListContactsDataType,
): Promise<ContactsPageType> => {
	const page = input.page ?? 1;
	const pageSize = input.page_size ?? 20;
	const offset = (page - 1) * pageSize;
	const search = input.search ? `%${input.search}%` : null;
	const sort = input.sort ?? "newest";
	const orderBy = contactOrderBy[sort];

	const listQuery = `
        SELECT
            id,
            full_name,
            company_name,
            email,
            phone,
            created_at,
            updated_at
        FROM contacts
        WHERE (
            $1::text IS NULL
            OR full_name ILIKE $1
            OR company_name ILIKE $1
            OR email ILIKE $1
            OR phone ILIKE $1
        )
		ORDER BY ${orderBy}
        LIMIT $2
        OFFSET $3;
    `;

	const countQuery = `
        SELECT COUNT(*) AS total_count
        FROM contacts
        WHERE (
            $1::text IS NULL
            OR full_name ILIKE $1
            OR company_name ILIKE $1
            OR email ILIKE $1
            OR phone ILIKE $1
        );
    `;

	const [contactsResult, countResult] = await Promise.all([
		pool.query<ContactType>(listQuery, [search, pageSize, offset]),
		pool.query<ContactCountRow>(countQuery, [search]),
	]);

	const totalItems = Number(countResult.rows[0]?.total_count ?? 0);
	const totalPages = Math.ceil(totalItems / pageSize);

	return {
		items: contactsResult.rows,
		page,
		page_size: pageSize,
		total_items: totalItems,
		total_pages: totalPages,
		has_previous_page: page > 1,
		has_next_page: page < totalPages,
		sort,
	};
};

export const getContactByIdService = async (
	id: string,
): Promise<ContactType> => {
	const query = `
        SELECT
            id,
            full_name,
            company_name,
            email,
            phone,
            created_at,
            updated_at
        FROM contacts
        WHERE id = $1;
    `;
	const result = await pool.query<ContactType>(query, [id]);

	return requireFound(result.rows[0], "Contact not found");
};

export const updateContactService = async (
	id: string,
	input: UpdateContactDataType,
): Promise<ContactType> => {
	const currentContact = await getContactByIdService(id);

	const nextEmail =
		input.email === undefined ? currentContact.email : input.email;

	const nextPhone =
		input.phone === undefined ? currentContact.phone : input.phone;

	if (!nextEmail && !nextPhone) {
		throw validationError("Email or phone is required");
	}

	const updates: Array<{
		column: string;
		value: unknown;
	}> = [];

	if (input.full_name !== undefined) {
		updates.push({
			column: "full_name",
			value: input.full_name,
		});
	}

	if (input.company_name !== undefined) {
		updates.push({
			column: "company_name",
			value: input.company_name,
		});
	}

	if (input.email !== undefined) {
		updates.push({
			column: "email",
			value: input.email,
		});
	}

	if (input.phone !== undefined) {
		updates.push({
			column: "phone",
			value: input.phone,
		});
	}

	const assignments = updates.map(
		(update, index) => `${update.column} = $${index + 1}`,
	);

	const values = updates.map((update) => update.value);

	values.push(id);

	const idPlaceholder = `$${values.length}`;

	const query = `
        UPDATE contacts
        SET
            ${assignments.join(", ")},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${idPlaceholder}
        RETURNING
            id,
            full_name,
            company_name,
            email,
            phone,
            created_at,
            updated_at;
    `;

	const result = await pool.query<ContactType>(query, values);

	return requireFound(result.rows[0], "Contact not found");
};

export const deleteContactService = async (
	id: string,
): Promise<ContactType> => {
	const query = `
        DELETE FROM contacts
        WHERE id = $1
        RETURNING
            id,
            full_name,
            company_name,
            email,
            phone,
            created_at,
            updated_at;
    `;

	const result = await pool.query<ContactType>(query, [id]);

	return requireFound(result.rows[0], "Contact not found");
};
