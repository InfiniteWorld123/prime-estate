import { Elysia } from "elysia";
import { responseOk } from "#/backend/shared/response";
import { adminGuard } from "./admin.guard";

export const adminRoutes = new Elysia({
	prefix: "/admin",
})
	.use(adminGuard)
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
