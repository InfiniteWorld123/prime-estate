import { FileSearch, MapPinned, MessagesSquare } from "lucide-react";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

const reasonIcons = [FileSearch, MapPinned, MessagesSquare];

export function WhyPrimeEstateSection() {
	const { copy } = useLanguage();
	return (
		<section
			aria-labelledby="why-prime-estate-heading"
			className="border-y bg-muted/35 py-16 sm:py-20"
		>
			<div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 lg:px-8">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
						{copy.why.eyebrow}
					</p>

					<h2
						className="mt-4 max-w-md text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
						id="why-prime-estate-heading"
					>
						{copy.why.heading}
					</h2>

					<p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
						{copy.why.description}
					</p>
				</div>

				<div className="border-t">
					{copy.why.items.map((reason, index) => {
						const Icon = reasonIcons[index] ?? FileSearch;

						return (
							<article
								className="grid gap-4 border-b py-6 sm:grid-cols-[3rem_1fr] sm:gap-6"
								key={reason.title}
							>
								<div className="grid size-11 place-items-center rounded-md border bg-background text-primary shadow-xs">
									<Icon aria-hidden="true" className="size-5" />
								</div>

								<div>
									<h3 className="text-lg font-semibold tracking-tight">
										{reason.title}
									</h3>

									<p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
										{reason.description}
									</p>
								</div>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
