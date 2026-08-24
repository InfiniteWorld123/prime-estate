import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

export function ContactCtaSection() {
	const { copy } = useLanguage();
	return (
		<section aria-labelledby="contact-cta-heading" className="py-16 sm:py-20">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-lg border bg-card px-6 py-12 shadow-sm sm:px-10 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:px-12">
					<div
						aria-hidden="true"
						className="absolute bottom-0 left-0 h-1 w-28 bg-primary"
					/>

					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
							{copy.cta.eyebrow}
						</p>

						<h2
							className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
							id="contact-cta-heading"
						>
							{copy.cta.heading}
						</h2>

						<p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
							{copy.cta.description}
						</p>
					</div>

					<Button asChild className="mt-8 h-11 gap-2 px-5 lg:mt-0">
						<Link to="/contact">
							{copy.cta.action}
							<ArrowUpRight aria-hidden="true" />
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
