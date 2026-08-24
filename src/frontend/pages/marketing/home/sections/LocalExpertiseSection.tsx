import { Landmark, MapPin, Route } from "lucide-react";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

const regionIcons = [MapPin, Landmark, Route];

export function LocalExpertiseSection() {
	const { copy } = useLanguage();
	return (
		<section
			aria-labelledby="local-expertise-heading"
			className="relative isolate overflow-hidden bg-accent py-16 text-accent-foreground sm:py-20"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 opacity-20"
			>
				<div className="absolute left-[12%] top-0 h-full w-px bg-accent-foreground" />
				<div className="absolute right-[18%] top-0 h-full w-px bg-accent-foreground" />
				<div className="absolute left-0 top-1/3 h-px w-full bg-accent-foreground" />
				<div className="absolute left-0 top-2/3 h-px w-full bg-accent-foreground" />
				<div className="absolute left-[12%] top-1/3 size-2 -translate-x-1/2 -translate-y-1/2 bg-accent-foreground" />
			</div>

			<div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20 lg:px-8">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.16em]">
						{copy.local.eyebrow}
					</p>

					<h2
						className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
						id="local-expertise-heading"
					>
						{copy.local.heading}
					</h2>

					<p className="mt-5 max-w-xl text-base leading-7 text-accent-foreground/80">
						{copy.local.description}
					</p>
				</div>

				<div className="border-t border-accent-foreground/20 bg-background/65 backdrop-blur-sm">
					{copy.local.regions.map((region, index) => {
						const Icon = regionIcons[index] ?? MapPin;

						return (
							<article
								className="grid gap-4 border-b border-accent-foreground/20 p-5 sm:grid-cols-[3rem_1fr] sm:items-start sm:p-6"
								key={region.name}
							>
								<div className="grid size-11 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm">
									<Icon aria-hidden="true" className="size-5" />
								</div>

								<div>
									<h3 className="text-lg font-semibold">{region.name}</h3>

									<p className="mt-2 text-sm leading-6 text-accent-foreground/70">
										{region.description}
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
