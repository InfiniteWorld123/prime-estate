import type { marketingPagesCopy } from "@/frontend/i18n/marketing-pages.copy";

type ContactCopy =
	(typeof marketingPagesCopy)[keyof typeof marketingPagesCopy]["contact"];

export function ContactHeroSection({ copy }: { copy: ContactCopy }) {
	return (
		<section className="relative isolate overflow-hidden border-b bg-muted/35">
			<div aria-hidden="true" className="absolute inset-0 -z-10 opacity-35">
				<div className="absolute left-[14%] top-0 h-full w-px bg-border" />
				<div className="absolute right-[22%] top-0 h-full w-px bg-border" />
				<div className="absolute left-0 top-1/2 h-px w-full bg-border" />
				<div className="absolute left-[14%] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 bg-primary" />
			</div>
			<div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
					{copy.eyebrow}
				</p>
				<h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl lg:text-6xl">
					{copy.title}
				</h1>
				<p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
					{copy.description}
				</p>
			</div>
		</section>
	);
}
