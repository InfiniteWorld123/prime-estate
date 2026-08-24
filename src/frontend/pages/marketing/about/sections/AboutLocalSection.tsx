import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { marketingPagesCopy } from "@/frontend/i18n/marketing-pages.copy";

export function AboutLocalSection() {
	const { language } = useLanguage();
	const copy = marketingPagesCopy[language].about;

	return (
		<section className="border-t bg-muted/35 py-16 sm:py-24">
			<div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:px-8">
				<div className="relative overflow-hidden rounded-lg border bg-accent p-8 text-accent-foreground sm:p-10">
					<div aria-hidden="true" className="absolute inset-0 opacity-20">
						<div className="absolute left-1/3 top-0 h-full w-px bg-accent-foreground" />
						<div className="absolute left-0 top-1/2 h-px w-full bg-accent-foreground" />
					</div>
					<div className="relative">
						<span className="grid size-12 place-items-center rounded-md bg-primary text-primary-foreground">
							<MapPin aria-hidden="true" className="size-5" />
						</span>
						<p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em]">
							{copy.localEyebrow}
						</p>
						<h2 className="mt-4 max-w-lg text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
							{copy.localTitle}
						</h2>
						<p className="mt-5 max-w-xl text-base leading-7 text-accent-foreground/75">
							{copy.localDescription}
						</p>
					</div>
				</div>

				<div className="flex flex-col justify-center rounded-lg border bg-card p-8 sm:p-10 lg:p-12">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
						{copy.ctaEyebrow}
					</p>
					<h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
						{copy.ctaTitle}
					</h2>
					<p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
						{copy.ctaDescription}
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Button asChild className="h-11 gap-2 px-5">
							<Link to="/properties">
								{copy.browse}
								<ArrowUpRight aria-hidden="true" />
							</Link>
						</Button>
						<Button asChild className="h-11 px-5" variant="outline">
							<Link to="/contact">{copy.contact}</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
