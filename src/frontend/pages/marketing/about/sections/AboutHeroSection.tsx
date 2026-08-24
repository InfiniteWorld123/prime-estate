import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { marketingPagesCopy } from "@/frontend/i18n/marketing-pages.copy";

export function AboutHeroSection() {
	const { language } = useLanguage();
	const copy = marketingPagesCopy[language].about;

	return (
		<section className="relative isolate overflow-hidden border-b bg-sidebar text-sidebar-foreground">
			<div className="mx-auto grid min-h-[38rem] w-full max-w-[96rem] lg:grid-cols-[minmax(0,1.45fr)_minmax(24rem,0.55fr)]">
				<div className="relative min-h-[24rem] overflow-hidden lg:min-h-full">
					<img
						alt={copy.heroImageAlt}
						className="absolute inset-0 size-full object-cover"
						src="/images/properties/erfurt-apartment.jpg"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-sidebar/10 via-sidebar/5 to-sidebar/75" />
					<div aria-hidden="true" className="absolute inset-0 opacity-30">
						<div className="absolute left-[12%] top-0 h-full w-px bg-white/45" />
						<div className="absolute right-[18%] top-0 h-full w-px bg-white/30" />
						<div className="absolute left-0 top-[68%] h-px w-full bg-white/40" />
						<div className="absolute left-[12%] top-[68%] size-2 -translate-x-1/2 -translate-y-1/2 bg-amber-300" />
					</div>
				</div>

				<div className="relative flex items-end border-t border-sidebar-border bg-sidebar px-6 py-12 sm:px-10 lg:border-l lg:border-t-0 lg:px-12 lg:py-16">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-sidebar-primary">
							{copy.heroEyebrow}
						</p>
						<h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
							{copy.heroTitle}
						</h1>
						<p className="mt-6 max-w-xl text-base leading-7 text-sidebar-foreground/68">
							{copy.heroDescription}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
