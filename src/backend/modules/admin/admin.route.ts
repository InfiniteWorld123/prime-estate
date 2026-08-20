import { Elysia } from "elysia";
import { responseOk } from "#/backend/shared/response";
import { contactRoutes } from "../contacts/contact.route";
import { propertyRoutes } from "../properties/property.route";
import { adminGuard } from "./admin.guard";

export const adminRoutes = new Elysia({
	prefix: "/admin",
})
	.use(adminGuard)
	.use(contactRoutes)
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
