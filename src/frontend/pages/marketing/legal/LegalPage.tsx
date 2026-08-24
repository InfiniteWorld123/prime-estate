import { MarketingFooter } from "@/frontend/components/layout/MarketingFooter";
import { MarketingHeader } from "@/frontend/components/layout/MarketingHeader";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { marketingPagesCopy } from "@/frontend/i18n/marketing-pages.copy";

type LegalPageProps = {
	type: "imprint" | "privacy" | "terms";
};

export function LegalPage({ type }: LegalPageProps) {
	const { language } = useLanguage();
	const copy = marketingPagesCopy[language].legal;
	const isImprint = type === "imprint";
	const isPrivacy = type === "privacy";
	const title = isImprint
		? copy.imprintTitle
		: isPrivacy
			? copy.privacyTitle
			: copy.termsTitle;

	return (
		<div className="min-h-screen bg-background text-foreground">
			<MarketingHeader />
			<main>
				<header className="border-b bg-muted/35">
					<div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
							Prime Estate
						</p>
						<h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
							{title}
						</h1>
						<p className="mt-5 text-sm text-muted-foreground">{copy.updated}</p>
					</div>
				</header>

				<div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
					<div className="rounded-lg border border-primary/20 bg-primary/5 p-5 text-sm leading-6 text-foreground">
						{copy.portfolioNotice}
					</div>

					{isImprint ? (
						<div className="mt-10 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
							<p className="text-base leading-8 text-muted-foreground">
								{copy.imprintIntro}
							</p>
							<div className="space-y-8">
								<LegalSection title={copy.provider}>
									<p>Yaman Warda</p>
									<p className="mt-2 text-muted-foreground">
										{copy.missingAddress}
									</p>
								</LegalSection>
								<LegalSection title={copy.contact}>
									<a
										className="font-medium text-primary underline underline-offset-4"
										href="mailto:yamanwarda06@gmail.com"
									>
										yamanwarda06@gmail.com
									</a>
									<p className="mt-2">
										<a
											className="font-medium text-primary underline underline-offset-4"
											href="https://yamanwarda.dev"
											rel="noreferrer"
											target="_blank"
										>
											yamanwarda.dev
										</a>
									</p>
								</LegalSection>
								<LegalSection title={copy.location}>
									<p>{copy.locationValue}</p>
								</LegalSection>
								<LegalSection title={copy.liability}>
									<p>{copy.liabilityText}</p>
								</LegalSection>
							</div>
						</div>
					) : isPrivacy ? (
						<div className="mt-10 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
							<p className="text-base leading-8 text-muted-foreground">
								{copy.privacyIntro}
							</p>
							<div className="space-y-8">
								<LegalSection title={copy.dataTitle}>
									<p>{copy.dataText}</p>
								</LegalSection>
								<LegalSection title={copy.preferencesTitle}>
									<p>{copy.preferencesText}</p>
								</LegalSection>
								<LegalSection title={copy.futureTitle}>
									<p>{copy.futureText}</p>
								</LegalSection>
								<LegalSection title={copy.contact}>
									<a
										className="font-medium text-primary underline underline-offset-4"
										href="mailto:yamanwarda06@gmail.com"
									>
										yamanwarda06@gmail.com
									</a>
								</LegalSection>
							</div>
						</div>
					) : (
						<div className="mt-10 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
							<p className="text-base leading-8 text-muted-foreground">
								{copy.termsIntro}
							</p>
							<div className="space-y-8">
								<LegalSection title={copy.useTitle}>
									<p>{copy.useText}</p>
								</LegalSection>
								<LegalSection title={copy.accountTitle}>
									<p>{copy.accountText}</p>
								</LegalSection>
								<LegalSection title={copy.liability}>
									<p>{copy.liabilityText}</p>
								</LegalSection>
							</div>
						</div>
					)}
				</div>
			</main>
			<MarketingFooter />
		</div>
	);
}

function LegalSection({
	children,
	title,
}: {
	children: React.ReactNode;
	title: string;
}) {
	return (
		<section className="border-t pt-6">
			<h2 className="text-lg font-semibold">{title}</h2>
			<div className="mt-3 text-sm leading-7 text-muted-foreground">
				{children}
			</div>
		</section>
	);
}
