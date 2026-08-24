import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/frontend/components/theme/ThemeToggle";
import { authCopy } from "@/frontend/i18n/auth.copy";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { LanguageToggle } from "@/frontend/i18n/LanguageToggle";

type AuthShellProps = {
	children: ReactNode;
	variant?: "split" | "card";
};

function AuthBrand() {
	const { language } = useLanguage();
	const copy = authCopy[language].common;
	return (
		<Link
			aria-label={copy.brandLabel}
			className="inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
			to="/"
		>
			<span className="grid size-10 place-items-center rounded-md bg-primary font-semibold text-primary-foreground shadow-sm">
				PE
			</span>
			<span>
				<span className="block text-sm font-semibold">Prime Estate</span>
				<span className="mt-1 block text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
					{copy.location}
				</span>
			</span>
		</Link>
	);
}

export function AuthShell({ children, variant = "split" }: AuthShellProps) {
	const { language } = useLanguage();
	const copy = authCopy[language].common;

	if (variant === "card") {
		return (
			<div className="relative min-h-screen overflow-hidden bg-muted/35 text-foreground">
				<div aria-hidden="true" className="absolute inset-0 opacity-40">
					<div className="absolute left-[18%] top-0 h-full w-px bg-border" />
					<div className="absolute right-[18%] top-0 h-full w-px bg-border" />
					<div className="absolute left-0 top-1/2 h-px w-full bg-border" />
					<div className="absolute left-[18%] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 bg-primary" />
				</div>
				<header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-8">
					<AuthBrand />
					<div className="flex items-center gap-2">
						<LanguageToggle />
						<ThemeToggle />
					</div>
				</header>
				<main className="relative z-10 mx-auto flex w-full max-w-xl items-center px-4 py-10 sm:min-h-[calc(100vh-5rem)] sm:px-6 sm:py-16">
					<div className="w-full rounded-lg border bg-card p-6 shadow-lg sm:p-10">
						{children}
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(28rem,0.75fr)]">
			<aside className="relative hidden min-h-screen overflow-hidden bg-sidebar text-sidebar-foreground lg:block">
				<img
					alt=""
					className="absolute inset-0 size-full object-cover opacity-75"
					src="/images/properties/modern-home-erfurt.jpg"
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-sidebar/35 via-sidebar/55 to-sidebar" />
				<div aria-hidden="true" className="absolute inset-0 opacity-35">
					<div className="absolute left-[16%] top-0 h-full w-px bg-white/40" />
					<div className="absolute right-[20%] top-0 h-full w-px bg-white/25" />
					<div className="absolute left-0 top-[62%] h-px w-full bg-white/35" />
					<div className="absolute left-[16%] top-[62%] size-2 -translate-x-1/2 -translate-y-1/2 bg-amber-300" />
				</div>
				<div className="relative flex min-h-screen flex-col justify-between p-10 xl:p-14">
					<Link
						className="inline-flex w-fit items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-4 focus-visible:ring-offset-sidebar"
						to="/"
					>
						<span className="grid size-10 place-items-center rounded-md bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
							PE
						</span>
						<span>
							<span className="block text-sm font-semibold">Prime Estate</span>
							<span className="mt-1 block text-[0.65rem] uppercase tracking-[0.16em] text-sidebar-foreground/60">
								{copy.location}
							</span>
						</span>
					</Link>
					<div className="max-w-xl pb-8">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-primary">
							{copy.mediaEyebrow}
						</p>
						<h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-balance xl:text-5xl">
							{copy.mediaTitle}
						</h2>
						<p className="mt-5 max-w-lg text-base leading-7 text-sidebar-foreground/68">
							{copy.mediaDescription}
						</p>
					</div>
				</div>
			</aside>

			<div className="flex min-h-screen flex-col">
				<header className="flex items-center justify-between px-4 py-5 sm:px-8 lg:px-10">
					<div className="lg:hidden">
						<AuthBrand />
					</div>
					<Link
						className="hidden items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground lg:inline-flex"
						to="/"
					>
						<ArrowLeft aria-hidden="true" className="size-4" />
						{copy.backHome}
					</Link>
					<div className="flex items-center gap-2">
						<LanguageToggle />
						<ThemeToggle />
					</div>
				</header>
				<main className="flex flex-1 items-center px-4 py-10 sm:px-8 lg:px-10">
					<div className="mx-auto w-full max-w-md">{children}</div>
				</main>
			</div>
		</div>
	);
}
