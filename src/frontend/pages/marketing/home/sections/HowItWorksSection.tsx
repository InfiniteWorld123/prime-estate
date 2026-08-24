import { useLanguage } from "@/frontend/i18n/LanguageProvider";

export function HowItWorksSection() {
	const { copy } = useLanguage();
	return (
		<section
			aria-labelledby="how-it-works-heading"
			className="overflow-hidden bg-sidebar py-16 text-sidebar-foreground sm:py-20"
		>
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.16em] text-sidebar-primary">
							{copy.how.eyebrow}
						</p>

						<h2
							className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
							id="how-it-works-heading"
						>
							{copy.how.heading}
						</h2>
					</div>

					<p className="max-w-2xl text-base leading-7 text-sidebar-foreground/70 lg:justify-self-end">
						{copy.how.description}
					</p>
				</div>

				<ol className="mt-12 grid border-l border-t border-sidebar-border sm:grid-cols-2 lg:grid-cols-4">
					{copy.how.steps.map((step, index) => (
						<li
							className="relative min-h-64 border-b border-r border-sidebar-border p-6 sm:p-7"
							key={step.title}
						>
							<span className="font-mono text-sm font-semibold text-sidebar-primary">
								{String(index + 1).padStart(2, "0")}
							</span>

							<h3 className="mt-12 text-xl font-semibold tracking-tight">
								{step.title}
							</h3>

							<p className="mt-3 text-sm leading-6 text-sidebar-foreground/65">
								{step.description}
							</p>

							<span
								aria-hidden="true"
								className="absolute -left-1 -top-1 size-2 bg-sidebar-primary"
							/>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
