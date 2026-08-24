import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu } from "lucide-react";

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

function DisabledNavigationButton({ children }: { children: React.ReactNode }) {
	const { copy } = useLanguage();
	return (
		<button
			className="cursor-not-allowed rounded-md px-3 py-2 text-sm font-medium text-muted-foreground opacity-65"
			disabled
			title={copy.header.disabledTitle}
			type="button"
		>
			{children}
		</button>
	);
}

function DesktopNavigation() {
	const { copy } = useLanguage();
	const disabledNavigation = [
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

					{disabledNavigation.map((item) => (
						<DropdownMenuItem
							className="flex cursor-not-allowed flex-col items-start gap-1 opacity-60"
							disabled
							key={item.label}
						>
							<span className="font-medium">{item.label}</span>
							<span className="text-xs text-muted-foreground">
								{item.description}
							</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<DisabledNavigationButton>{copy.header.about}</DisabledNavigationButton>
			<DisabledNavigationButton>{copy.header.contact}</DisabledNavigationButton>
		</nav>
	);
}

function MobileNavigation() {
	const { copy } = useLanguage();
	const disabledNavigation = [copy.header.forSale, copy.header.forRent];
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

					{disabledNavigation.map((item) => (
						<button
							className="cursor-not-allowed rounded-md px-3 py-3 text-left text-sm font-medium text-muted-foreground opacity-65"
							disabled
							key={item}
							type="button"
						>
							{item}
						</button>
					))}

					<div className="my-4 h-px bg-border" />

					<DisabledNavigationButton>
						{copy.header.about}
					</DisabledNavigationButton>
					<DisabledNavigationButton>
						{copy.header.contact}
					</DisabledNavigationButton>
					<DisabledNavigationButton>
						{copy.header.signIn}
					</DisabledNavigationButton>

					<Button className="mt-3" disabled type="button">
						{copy.header.signUp}
					</Button>
				</nav>

				<div className="border-t px-4 py-4 text-xs text-muted-foreground">
					{copy.header.pagesLater}
				</div>
			</SheetContent>
		</Sheet>
	);
}

export function MarketingHeader() {
	const { copy } = useLanguage();
	return (
		<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
			<div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Brand />

				<div className="flex items-center gap-2">
					<DesktopNavigation />

					<div className="hidden h-6 w-px bg-border lg:block" />

					<LanguageToggle />
					<ThemeToggle />

					<div className="hidden items-center gap-2 lg:flex">
						<Button disabled type="button" variant="ghost">
							{copy.header.signIn}
						</Button>

						<Button disabled type="button">
							{copy.header.signUp}
						</Button>
					</div>

					<MobileNavigation />
				</div>
			</div>
		</header>
	);
}
