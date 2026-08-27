import type { AuthUser } from "@/frontend/api/auth.api";

export const defaultDestinationForUser = (user: AuthUser) =>
	user.role === "ADMIN" ? "/admin/properties" : "/";

export const safeInternalRedirect = (value: unknown): string | null => {
	if (typeof value !== "string") return null;
	if (!value.startsWith("/") || value.startsWith("//")) return null;

	try {
		const url = new URL(value, "https://prime-estate.local");
		if (url.origin !== "https://prime-estate.local") return null;
		return `${url.pathname}${url.search}${url.hash}`;
	} catch {
		return null;
	}
};
