import { useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";

import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { adminShellCopy } from "./admin-shell.copy";

const SIDEBAR_STORAGE_KEY = "prime-estate-admin-sidebar-collapsed";

export function AdminShell({ children }: { children: ReactNode }) {
	const { language } = useLanguage();
	const copy = adminShellCopy[language];
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);

	useEffect(() => {
		setIsCollapsed(window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true");
	}, []);

	const toggleSidebar = () => {
		setIsCollapsed((currentValue) => {
			const nextValue = !currentValue;
			window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextValue));
			return nextValue;
		});
	};

	const currentPage = pathname.startsWith("/admin/inquiries")
		? copy.inquiries
		: pathname.startsWith("/admin/listings")
			? copy.listings
			: pathname.startsWith("/admin/properties")
				? copy.properties
				: copy.overview;

	return (
		<div className="min-h-screen bg-background text-foreground lg:flex">
			<AdminSidebar
				copy={copy}
				isCollapsed={isCollapsed}
				onCollapseChange={toggleSidebar}
			/>

			<div className="min-w-0 flex-1">
				<AdminTopBar
					copy={copy}
					currentPage={currentPage}
					isMobileNavigationOpen={isMobileNavigationOpen}
					onMobileNavigationChange={setIsMobileNavigationOpen}
				/>
				<main className="min-h-[calc(100vh-4.25rem)] bg-muted/20">
					{children}
				</main>
			</div>
		</div>
	);
}
