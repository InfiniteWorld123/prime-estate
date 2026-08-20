import { Elysia } from "elysia";
import {
	ContactParamsSchema,
	CreateContactSchema,
	ListContactsQuerySchema,
	UpdateContactSchema,
} from "#/shared/validation/contact.validation";
import {
	createContact,
	deleteContact,
	getContactById,
	listContacts,
	updateContact,
} from "./contact.controller";

export const contactRoutes = new Elysia({
	prefix: "/contacts",
})
	.post("/", createContact, {
		body: CreateContactSchema,
	})
	.get("/", listContacts, {
		query: ListContactsQuerySchema,
	})
	.get("/:id", getContactById, {
		params: ContactParamsSchema,
	})
	.patch("/:id", updateContact, {
		params: ContactParamsSchema,
		body: UpdateContactSchema,
	})
	.delete("/:id", deleteContact, {
		params: ContactParamsSchema,
	});
