import type {
	ContactsPageType,
	ContactType,
	CreateContactBodyType,
	ListContactsQueryType,
} from "#/shared/types/contact.type";
import { safe_API } from "./client";
import { unwrapApiResult } from "./utils";

export async function listContacts(
	query: ListContactsQueryType,
): Promise<ContactsPageType> {
	const response = unwrapApiResult(
		await safe_API().admin.contacts.get({ query }),
		"Unable to load contacts",
	);

	return response.data;
}

export async function createContact(
	input: CreateContactBodyType,
): Promise<ContactType> {
	const response = unwrapApiResult(
		await safe_API().admin.contacts.post(input),
		"Unable to create the contact",
	);

	return response.data;
}
