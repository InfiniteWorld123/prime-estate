import { Elysia } from "elysia";
import {
	CreatePropertySchema,
	ListPropertiesQuerySchema,
	PropertyParamsSchema,
	UpdatePropertySchema,
} from "#/shared/validation/property.validation";
import {
	archiveProperty,
	createProperty,
	deleteProperty,
	getPropertyById,
	listProperties,
	restoreProperty,
	updateProperty,
} from "./property.controller";

export const propertyRoutes = new Elysia({
	prefix: "/properties",
})
	.post("/", createProperty, {
		body: CreatePropertySchema,
	})
	.get("/", listProperties, {
		query: ListPropertiesQuerySchema,
	})
	.get("/:id", getPropertyById, {
		params: PropertyParamsSchema,
	})
	.patch("/:id", updateProperty, {
		params: PropertyParamsSchema,
		body: UpdatePropertySchema,
	})
	.post("/:id/archive", archiveProperty, {
		params: PropertyParamsSchema,
	})
	.post("/:id/restore", restoreProperty, {
		params: PropertyParamsSchema,
	})
	.delete("/:id", deleteProperty, {
		params: PropertyParamsSchema,
	});
