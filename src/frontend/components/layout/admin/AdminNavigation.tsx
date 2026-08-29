import { Link, useRouterState } from "@tanstack/react-router";

import { cn } from "@/frontend/lib/utils";
import { adminNavigation } from "./admin-navigation";
import type { AdminShellCopy } from "./admin-shell.copy";

type AdminNavigationProps = {
	copy: AdminShellCopy;
	isCollapsed?: boolean;
	onNavigate?: () => void;
};

export function AdminNavigation({
	copy,
	isCollapsed = false,
	onNavigate,
}: AdminNavigationProps) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	return (
		<nav aria-label={copy.mainNavigation} className="flex flex-col gap-1">
			{adminNavigation.map((item) => {
				const Icon = item.icon;
				const isActive = item.exact
					? pathname === item.to || pathname === `${item.to}/`
					: pathname.startsWith(item.to);
				const label = copy[item.label];

				return (
					<Link
						aria-current={isActive ? "page" : undefined}
						aria-label={isCollapsed ? label : undefined}
						className={cn(
							"group relative flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/70 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring motion-reduce:transition-none",
							isActive &&
								"bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-sidebar-primary",
							isCollapsed && "justify-center px-0",
						)}
						key={item.to}
						onClick={onNavigate}
						to={item.to}
					>
						<Icon aria-hidden="true" className="size-4.5 shrink-0" />
						{isCollapsed ? (
							<span
								className="pointer-events-none absolute left-[calc(100%+0.65rem)] z-50 whitespace-nowrap rounded-md border border-sidebar-border bg-sidebar px-2.5 py-1.5 text-xs text-sidebar-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
								role="tooltip"
							>
								{label}
							</span>
						) : (
							<span>{label}</span>
						)}
					</Link>
				);
			})}
		</nav>
	);
}
