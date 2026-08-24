import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

function FooterBrand() {
	const { copy } = useLanguage();
	return (
		<Link
			aria-label={copy.header.home}
			className="inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-4 focus-visible:ring-offset-sidebar"
			to="/"
		>
			<span className="grid size-10 place-items-center rounded-md bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
				PE
			</span>

			<span>
				<span className="block font-semibold">Prime Estate</span>
				<span className="mt-1 block text-xs uppercase tracking-[0.14em] text-sidebar-foreground/55">
					{copy.header.location}
				</span>
			</span>
		</Link>
	);
}

export function MarketingFooter() {
	const { copy } = useLanguage();
	const footerRoutes = [
		["/properties", "/properties", "/properties"],
		["/about", "/contact"],
		["/sign-in", "/sign-up"],
		["/imprint", "/privacy"],
	] as const;
	return (
		<footer className="border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
			<div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
					<div>
						<FooterBrand />

						<p className="mt-5 max-w-sm text-sm leading-6 text-sidebar-foreground/65">
							{copy.footer.description}
						</p>
					</div>

					<nav
						aria-label={copy.footer.navigation}
						className="grid grid-cols-2 gap-8 sm:grid-cols-4"
					>
						{copy.footer.groups.map((group, groupIndex) => (
							<div key={group.title}>
								<h2 className="text-sm font-semibold">{group.title}</h2>

								<ul className="mt-4 space-y-3">
									{group.items.map((item, itemIndex) => (
										<li key={item}>
											<Link
												className="text-left text-sm text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground"
												to={footerRoutes[groupIndex]?.[itemIndex] ?? "/"}
											>
												{item}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>
				</div>

				<div className="mt-12 flex flex-col gap-3 border-t border-sidebar-border pt-6 text-xs text-sidebar-foreground/50 sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {new Date().getFullYear()} {copy.footer.copyright}
					</p>

					<p>{copy.footer.disclaimer}</p>
				</div>
			</div>
		</footer>
	);
}
