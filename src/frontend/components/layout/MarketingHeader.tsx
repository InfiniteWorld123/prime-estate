import { Link } from "@tanstack/react-router";
import { ChevronDown, LoaderCircle, LogOut, Menu } from "lucide-react";

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
import { Skeleton } from "@/frontend/components/ui/skeleton";
import { useAuthNavigation } from "@/frontend/features/auth/hooks/useAuthNavigation";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { LanguageToggle } from "@/frontend/i18n/LanguageToggle";

function Brand() {
	const { copy } = useLanguage();
	return (
		<Link
			aria-label={copy.header.home}
			className="group flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
			to="/"
		>
			<span className="grid size-9 place-items-center rounded-md bg-primary font-semibold text-primary-foreground shadow-sm">
				PE
			</span>

			<span className="flex flex-col leading-none">
				<span className="text-sm font-semibold tracking-tight">
					Prime Estate
				</span>
				<span className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
					{copy.header.location}
				</span>
			</span>
		</Link>
	);
}

function DesktopNavigation() {
	const { copy } = useLanguage();
	const propertyNavigation = [
		{ label: copy.header.forSale, description: copy.header.forSaleDescription },
		{ label: copy.header.forRent, description: copy.header.forRentDescription },
	];
	return (
		<nav
			aria-label={copy.header.mainNavigation}
			className="hidden items-center gap-1 lg:flex"
		>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="gap-1" type="button" variant="ghost">
						{copy.header.properties}
						<ChevronDown aria-hidden="true" className="size-3.5" />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="start" className="w-64">
					<DropdownMenuLabel>{copy.header.findProperty}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link className="flex flex-col items-start gap-1" to="/properties">
							<span className="font-medium">{copy.header.browseAll}</span>
							<span className="text-xs text-muted-foreground">
								{copy.header.browseAllDescription}
							</span>
						</Link>
					</DropdownMenuItem>

					{propertyNavigation.map((item) => (
						<DropdownMenuItem asChild key={item.label}>
							<Link
								className="flex flex-col items-start gap-1"
								to="/properties"
							>
								<span className="font-medium">{item.label}</span>
								<span className="text-xs text-muted-foreground">
									{item.description}
								</span>
							</Link>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<Button asChild variant="ghost">
				<Link to="/about">{copy.header.about}</Link>
			</Button>
			<Button asChild variant="ghost">
				<Link to="/contact">{copy.header.contact}</Link>
			</Button>
		</nav>
	);
}

type AccountNavigationProps = ReturnType<typeof useAuthNavigation>;

function initials(name: string) {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");
}

function AccountNavigation({
	isLoading,
	isSigningOut,
	signOut,
	signOutError,
	user,
}: AccountNavigationProps) {
	const { copy } = useLanguage();
	if (isLoading)
		return (
			<div className="hidden items-center gap-2 lg:flex" aria-hidden="true">
				<Skeleton className="h-9 w-16" />
				<Skeleton className="h-9 w-24" />
			</div>
		);
	if (!user)
		return (
			<div className="hidden items-center gap-2 lg:flex">
				<Button asChild variant="ghost">
					<Link to="/sign-in">{copy.header.signIn}</Link>
				</Button>
				<Button asChild>
					<Link to="/sign-up">{copy.header.signUp}</Link>
				</Button>
			</div>
		);
	return (
		<div className="hidden lg:block">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						aria-label={copy.header.account}
						className="size-9 rounded-full p-0"
						variant="outline"
					>
						<span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
							{initials(user.name) || "PE"}
						</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-64">
					<DropdownMenuLabel>
						<span className="block truncate font-medium">{user.name}</span>
						<span className="mt-1 block truncate text-xs font-normal text-muted-foreground">
							{user.email}
						</span>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{user.role === "ADMIN" ? (
						<DropdownMenuItem asChild>
							<Link to="/admin/properties">{copy.header.administration}</Link>
						</DropdownMenuItem>
					) : null}
					<DropdownMenuItem
						disabled={isSigningOut}
						onSelect={() => void signOut()}
					>
						{isSigningOut ? (
							<LoaderCircle
								aria-hidden="true"
								className="animate-spin motion-reduce:animate-none"
							/>
						) : (
							<LogOut aria-hidden="true" />
						)}
						{isSigningOut ? copy.header.signingOut : copy.header.signOut}
					</DropdownMenuItem>
					{signOutError ? (
						<p className="px-2 py-1.5 text-xs text-destructive" role="alert">
							{signOutError}
						</p>
					) : null}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function MobileNavigation({
	isLoading,
	isSigningOut,
	signOut,
	signOutError,
	user,
}: AccountNavigationProps) {
	const { copy } = useLanguage();
	const propertyNavigation = [copy.header.forSale, copy.header.forRent];
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					aria-label={copy.header.openNavigation}
					className="lg:hidden"
					size="icon"
					type="button"
					variant="outline"
				>
					<Menu aria-hidden="true" />
				</Button>
			</SheetTrigger>

			<SheetContent className="flex w-[88%] flex-col sm:max-w-sm" side="right">
				<SheetHeader className="text-left">
					<SheetTitle>Prime Estate</SheetTitle>
					<SheetDescription>{copy.header.mobileDescription}</SheetDescription>
				</SheetHeader>

				<nav
					aria-label={copy.header.mobileNavigation}
					className="flex flex-1 flex-col gap-1 px-4"
				>
					<p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
						{copy.header.properties}
					</p>
					<Link
						className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
						to="/properties"
					>
						{copy.header.browseAll}
					</Link>

					{propertyNavigation.map((item) => (
						<Link
							className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
							key={item}
							to="/properties"
						>
							{item}
						</Link>
					))}

					<div className="my-4 h-px bg-border" />

					<Link
						className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
						to="/about"
					>
						{copy.header.about}
					</Link>
					<Link
						className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
						to="/contact"
					>
						{copy.header.contact}
					</Link>
					{isLoading ? (
						<div className="space-y-2 rounded-md border p-3" aria-hidden="true">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-40" />
							<Skeleton className="mt-3 h-9 w-full" />
						</div>
					) : user ? (
						<div className="rounded-md border bg-muted/35 p-3">
							<p className="truncate text-sm font-medium">{user.name}</p>
							<p className="mt-1 truncate text-xs text-muted-foreground">
								{user.email}
							</p>
							{user.role === "ADMIN" ? (
								<Button asChild className="mt-3 w-full" variant="outline">
									<Link to="/admin/properties">
										{copy.header.administration}
									</Link>
								</Button>
							) : null}
							<Button
								className="mt-2 w-full"
								disabled={isSigningOut}
								onClick={() => void signOut()}
								type="button"
								variant="outline"
							>
								{isSigningOut ? (
									<LoaderCircle
										aria-hidden="true"
										className="animate-spin motion-reduce:animate-none"
									/>
								) : (
									<LogOut aria-hidden="true" />
								)}
								{isSigningOut ? copy.header.signingOut : copy.header.signOut}
							</Button>
							{signOutError ? (
								<p className="mt-2 text-xs text-destructive" role="alert">
									{signOutError}
								</p>
							) : null}
						</div>
					) : (
						<>
							<Link
								className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
								to="/sign-in"
							>
								{copy.header.signIn}
							</Link>
							<Button asChild className="mt-3">
								<Link to="/sign-up">{copy.header.signUp}</Link>
							</Button>
						</>
					)}
				</nav>

				<div className="border-t px-4 py-4 text-xs text-muted-foreground">
					{copy.header.mobileDescription}
				</div>
			</SheetContent>
		</Sheet>
	);
}

export function MarketingHeader() {
	const authNavigation = useAuthNavigation();
	return (
		<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
			<div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Brand />

				<div className="flex items-center gap-2">
					<DesktopNavigation />

					<div className="hidden h-6 w-px bg-border lg:block" />

					<LanguageToggle />
					<ThemeToggle />

					<AccountNavigation {...authNavigation} />

					<MobileNavigation {...authNavigation} />
				</div>
			</div>
		</header>
	);
}
