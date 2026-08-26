import { Link } from "@tanstack/react-router";
import { Building2, LogOut, Menu, ShieldCheck } from "lucide-react";

import { ThemeToggle } from "@/frontend/components/theme/ThemeToggle";
import { Button } from "@/frontend/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/frontend/components/ui/sheet";
import { LanguageToggle } from "@/frontend/i18n/LanguageToggle";
import { AdminNavigation } from "./AdminNavigation";
import type { AdminShellCopy } from "./admin-shell.copy";

type AdminTopBarProps = {
	copy: AdminShellCopy;
	currentPage: string;
	isMobileNavigationOpen: boolean;
	onMobileNavigationChange: (isOpen: boolean) => void;
};

export function AdminTopBar({
	copy,
	currentPage,
	isMobileNavigationOpen,
	onMobileNavigationChange,
}: AdminTopBarProps) {
	return (
		<header className="sticky top-0 z-30 flex h-17 items-center border-b bg-background/88 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/78 sm:px-6">
			<div className="flex min-w-0 flex-1 items-center gap-3">
				<Sheet
					onOpenChange={onMobileNavigationChange}
					open={isMobileNavigationOpen}
				>
					<SheetTrigger asChild>
						<Button
							aria-label={copy.openNavigation}
							className="lg:hidden"
							size="icon"
							type="button"
							variant="outline"
						>
							<Menu aria-hidden="true" />
						</Button>
					</SheetTrigger>
					<SheetContent
						className="w-[86%] border-sidebar-border bg-sidebar text-sidebar-foreground sm:max-w-xs"
						side="left"
					>
						<SheetHeader className="border-b border-sidebar-border text-left">
							<SheetTitle className="flex items-center gap-3 text-sidebar-foreground">
								<span className="grid size-9 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
									<Building2 aria-hidden="true" className="size-4.5" />
								</span>
								Prime Estate
							</SheetTitle>
							<SheetDescription className="text-sidebar-foreground/55">
								{copy.mobileDescription}
							</SheetDescription>
						</SheetHeader>
						<div className="px-3 py-2">
							<AdminNavigation
								copy={copy}
								onNavigate={() => onMobileNavigationChange(false)}
							/>
						</div>
					</SheetContent>
				</Sheet>

				<div className="min-w-0">
					<p className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground sm:block">
						{copy.administration}
					</p>
					<p className="truncate text-sm font-semibold sm:mt-0.5">
						{currentPage}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-0.5 sm:gap-1">
				<LanguageToggle />
				<ThemeToggle />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							aria-label={copy.account}
							className="ml-1 size-8 rounded-full p-0"
							type="button"
							variant="outline"
						>
							<span className="grid size-7 place-items-center rounded-full bg-primary text-[0.65rem] font-semibold text-primary-foreground">
								PE
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-64">
						<DropdownMenuLabel>
							<span className="flex items-center gap-2 font-medium">
								<ShieldCheck
									aria-hidden="true"
									className="size-4 text-primary"
								/>
								Prime Estate Admin
							</span>
							<span className="mt-1 block text-xs font-normal text-muted-foreground">
								{copy.account}
							</span>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link to="/sign-in">
								<LogOut aria-hidden="true" />
								{copy.signOut}
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
