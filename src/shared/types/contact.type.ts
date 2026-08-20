import type * as v from "valibot";
import type {
	ContactParamsSchema,
	CreateContactSchema,
	ListContactsQuerySchema,
	UpdateContactSchema,
} from "../validation/contact.validation";

export type CreateContactBodyType = v.InferInput<typeof CreateContactSchema>;

export type CreateContactDataType = v.InferOutput<typeof CreateContactSchema>;

export type UpdateContactBodyType = v.InferInput<typeof UpdateContactSchema>;

export type UpdateContactDataType = v.InferOutput<typeof UpdateContactSchema>;

export type ContactParamsType = v.InferInput<typeof ContactParamsSchema>;

export type ListContactsQueryType = v.InferOutput<
	typeof ListContactsQuerySchema
>;

export type ListContactsDataType = v.InferOutput<
	typeof ListContactsQuerySchema
>;

export type ContactSortType = NonNullable<ListContactsDataType["sort"]>;

export type ContactType = {
	id: string;
	full_name: string;
	company_name: string | null;
	email: string | null;
	phone: string | null;
	created_at: Date;
	updated_at: Date;
};

export type ContactsPageType = {
	items: ContactType[];
	page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
	has_previous_page: boolean;
	has_next_page: boolean;
	sort: ContactSortType;
};
