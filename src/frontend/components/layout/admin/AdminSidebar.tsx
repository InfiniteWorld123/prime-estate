import { Link } from "@tanstack/react-router";
import { Building2, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";
import { AdminNavigation } from "./AdminNavigation";
import type { AdminShellCopy } from "./admin-shell.copy";

type AdminSidebarProps = {
	copy: AdminShellCopy;
	isCollapsed: boolean;
	onCollapseChange: () => void;
};

export function AdminSidebar({
	copy,
	isCollapsed,
	onCollapseChange,
}: AdminSidebarProps) {
	const collapseLabel = isCollapsed
		? copy.expandNavigation
		: copy.collapseNavigation;

	return (
		<aside
			className={cn(
				"sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex motion-reduce:transition-none",
				isCollapsed ? "w-[4.75rem]" : "w-64",
			)}
		>
			<div
				className={cn(
					"flex h-17 items-center border-b border-sidebar-border px-4",
					isCollapsed && "justify-center px-0",
				)}
			>
				<Link
					aria-label="Prime Estate Administration"
					className="flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
					to="/admin"
				>
					<span className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
						<Building2 aria-hidden="true" className="size-4.5" />
					</span>
					{isCollapsed ? null : (
						<span className="min-w-0 leading-none">
							<span className="block truncate text-sm font-semibold tracking-tight">
								Prime Estate
							</span>
							<span className="mt-1.5 block truncate text-[0.62rem] font-medium uppercase tracking-[0.16em] text-sidebar-foreground/55">
								{copy.region}
							</span>
						</span>
					)}
				</Link>
			</div>

			<div className="flex-1 px-3 py-5">
				<AdminNavigation copy={copy} isCollapsed={isCollapsed} />
			</div>

			<div className="border-t border-sidebar-border p-3">
				<Button
					aria-label={collapseLabel}
					className={cn(
						"w-full justify-start border-sidebar-border bg-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
						isCollapsed && "justify-center px-0",
					)}
					onClick={onCollapseChange}
					title={collapseLabel}
					type="button"
					variant="outline"
				>
					{isCollapsed ? (
						<PanelLeftOpen aria-hidden="true" />
					) : (
						<PanelLeftClose aria-hidden="true" />
					)}
					{isCollapsed ? null : <span>{collapseLabel}</span>}
				</Button>
			</div>
		</aside>
	);
}
