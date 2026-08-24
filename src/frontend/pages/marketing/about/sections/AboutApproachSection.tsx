import { FileSearch, MapPinned, MessagesSquare } from "lucide-react";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { marketingPagesCopy } from "@/frontend/i18n/marketing-pages.copy";

const icons = [FileSearch, MapPinned, MessagesSquare];

export function AboutApproachSection() {
	const { language } = useLanguage();
	const copy = marketingPagesCopy[language].about;

	return (
		<section
			aria-labelledby="about-approach-heading"
			className="py-16 sm:py-24"
		>
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
							{copy.approachEyebrow}
						</p>
						<h2
							className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl"
							id="about-approach-heading"
						>
							{copy.approachTitle}
						</h2>
					</div>
					<p className="max-w-2xl text-base leading-8 text-muted-foreground lg:pt-8">
						{copy.approachDescription}
					</p>
				</div>

				<div className="mt-14 grid border-y sm:grid-cols-3">
					{copy.principles.map((principle, index) => {
						const Icon = icons[index] ?? FileSearch;
						return (
							<article
								className="border-b py-8 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
								key={principle.title}
							>
								<Icon aria-hidden="true" className="size-5 text-primary" />
								<h3 className="mt-5 text-lg font-semibold">
									{principle.title}
								</h3>
								<p className="mt-3 text-sm leading-6 text-muted-foreground">
									{principle.description}
								</p>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
