import { status } from "elysia";
import * as v from "valibot";
import { HttpStatusCode } from "#/backend/shared/http";
import { responseOk } from "#/backend/shared/response";
import type {
	ContactParamsType,
	CreateContactBodyType,
	ListContactsQueryType,
	UpdateContactBodyType,
} from "#/shared/types/contact.type";
import {
	ContactParamsSchema,
	CreateContactSchema,
	UpdateContactSchema,
} from "#/shared/validation/contact.validation";
import {
	createContactService,
	deleteContactService,
	getContactByIdService,
	listContactsService,
	updateContactService,
} from "./contact.service";

export const createContact = async ({
	body,
}: {
	body: CreateContactBodyType;
}) => {
	const parsedBody = v.parse(CreateContactSchema, body);
	const contact = await createContactService(parsedBody);

	return status(
		HttpStatusCode.CREATED,
		responseOk({
			data: contact,
			message: "Contact created",
		}),
	);
};

export const listContacts = async ({
	query,
}: {
	query: ListContactsQueryType;
}) => {
	const contacts = await listContactsService(query);

	return responseOk({
		data: contacts,
		message: "Contacts retrieved",
	});
};

export const getContactById = async ({
	params,
}: {
	params: ContactParamsType;
}) => {
	const parsedParams = v.parse(ContactParamsSchema, params);

	const contact = await getContactByIdService(parsedParams.id);

	return responseOk({
		data: contact,
		message: "Contact retrieved",
	});
};

export const updateContact = async ({
	params,
	body,
}: {
	params: ContactParamsType;
	body: UpdateContactBodyType;
}) => {
	const parsedParams = v.parse(ContactParamsSchema, params);

	const parsedBody = v.parse(UpdateContactSchema, body);

	const contact = await updateContactService(parsedParams.id, parsedBody);

	return responseOk({
		data: contact,
		message: "Contact updated",
	});
};

export const deleteContact = async ({
	params,
}: {
	params: ContactParamsType;
}) => {
	const parsedParams = v.parse(ContactParamsSchema, params);

	const contact = await deleteContactService(parsedParams.id);

	return responseOk({
		data: contact,
		message: "Contact deleted",
	});
};
