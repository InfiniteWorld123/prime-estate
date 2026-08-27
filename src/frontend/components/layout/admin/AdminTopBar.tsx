import {
	Building2,
	LoaderCircle,
	LogOut,
	Menu,
	ShieldCheck,
} from "lucide-react";

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
import { useAuthNavigation } from "@/frontend/features/auth/hooks/useAuthNavigation";
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
	const authNavigation = useAuthNavigation();
	const initials = authNavigation.user?.name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

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
								{initials || "PE"}
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
								{authNavigation.user?.name ?? "Prime Estate Admin"}
							</span>
							<span className="mt-1 block text-xs font-normal text-muted-foreground">
								{authNavigation.user?.email ?? copy.account}
							</span>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							disabled={authNavigation.isSigningOut}
							onSelect={() => void authNavigation.signOut()}
						>
							{authNavigation.isSigningOut ? (
								<LoaderCircle className="animate-spin motion-reduce:animate-none" />
							) : (
								<LogOut aria-hidden="true" />
							)}
							{copy.signOut}
						</DropdownMenuItem>
						{authNavigation.signOutError ? (
							<p className="px-2 py-1.5 text-xs text-destructive" role="alert">
								{authNavigation.signOutError}
							</p>
						) : null}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
