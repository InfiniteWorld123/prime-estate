import { Elysia } from "elysia";
import { responseOk } from "#/backend/shared/response";
import { contactRoutes } from "../contacts/contact.route";
import { featureRoutes } from "../features/feature.route";
import { inquiryRoutes } from "../inquiries/inquiry.route";
import { listingRoutes } from "../listings/listing.route";
import { propertyRoutes } from "../properties/property.route";
import { propertyImageRoutes } from "../property-images/property-image.route";
import { adminGuard } from "./admin.guard";

export const adminRoutes = new Elysia({
	prefix: "/admin",
})
	.use(adminGuard)
	.use(contactRoutes)
	.use(featureRoutes)
	.use(inquiryRoutes)
	.use(listingRoutes)
	.use(propertyImageRoutes)
	.use(propertyRoutes)
	.get("/me", ({ adminUser }) =>
		responseOk({
			data: {
				id: adminUser.id,
				name: adminUser.name,
				email: adminUser.email,
				role: adminUser.role,
			},
			message: "Admin session active",
		}),
	);
