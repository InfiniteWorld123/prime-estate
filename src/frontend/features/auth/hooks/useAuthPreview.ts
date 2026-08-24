import { useEffect, useState } from "react";
import {
	AUTH_PREVIEW_USER_KEY,
	type AuthPreviewUser,
	mockDelay,
} from "@/frontend/features/auth/auth.mock";

export function useAuthPreview() {
	const [user, setUser] = useState<AuthPreviewUser | null>(null);
	const [isSigningOut, setIsSigningOut] = useState(false);

	useEffect(() => {
		const stored = window.sessionStorage.getItem(AUTH_PREVIEW_USER_KEY);
		if (!stored) return;
		try {
			setUser(JSON.parse(stored) as AuthPreviewUser);
		} catch {
			window.sessionStorage.removeItem(AUTH_PREVIEW_USER_KEY);
		}
	}, []);

	return {
		isSigningOut,
		signOut: async () => {
			setIsSigningOut(true);
			await mockDelay(650);
			window.sessionStorage.removeItem(AUTH_PREVIEW_USER_KEY);
			setUser(null);
			setIsSigningOut(false);
		},
		user,
	};
}
