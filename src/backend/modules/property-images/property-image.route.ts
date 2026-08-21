import { Elysia, t } from "elysia";
import {
	PropertyImageParamsSchema,
	PropertyImagePropertyParamsSchema,
	ReorderPropertyImagesSchema,
	UpdatePropertyImageSchema,
} from "#/shared/validation/property-image.validation";
import {
	deletePropertyImage,
	listPropertyImages,
	reorderPropertyImages,
	setPropertyCoverImage,
	updatePropertyImage,
	uploadImage,
} from "./property-image.controller";

export const propertyImageRoutes = new Elysia()
	.get("/properties/:id/images", listPropertyImages, {
		params: PropertyImagePropertyParamsSchema,
	})
	.post("/properties/:id/images", uploadImage, {
		params: PropertyImagePropertyParamsSchema,
		body: t.Object({
			file: t.File(),
			alt_text: t.Optional(t.Nullable(t.String())),
		}),
	})
	.put("/properties/:id/images/order", reorderPropertyImages, {
		params: PropertyImagePropertyParamsSchema,
		body: ReorderPropertyImagesSchema,
	})
	.patch("/properties/:id/images/:imageId", updatePropertyImage, {
		params: PropertyImageParamsSchema,
		body: UpdatePropertyImageSchema,
	})
	.delete("/properties/:id/images/:imageId", deletePropertyImage, {
		params: PropertyImageParamsSchema,
	})
	.post("/properties/:id/images/:imageId/cover", setPropertyCoverImage, {
		params: PropertyImageParamsSchema,
	});
