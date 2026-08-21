import { Elysia } from "elysia";
import {
	BulkArchivePropertiesSchema,
	CreatePropertySchema,
	ListPropertiesQuerySchema,
	PropertyParamsSchema,
	UpdatePropertySchema,
} from "#/shared/validation/property.validation";
import {
	archiveProperty,
	bulkArchiveProperties,
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
	.post("/bulk-archive", bulkArchiveProperties, {
		body: BulkArchivePropertiesSchema,
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
