import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/frontend/components/ui/accordion";
import type { marketingPagesCopy } from "@/frontend/i18n/marketing-pages.copy";

type ContactCopy =
	(typeof marketingPagesCopy)[keyof typeof marketingPagesCopy]["contact"];

export function ContactFaqSection({ copy }: { copy: ContactCopy }) {
	return (
		<section className="border-t bg-muted/35 py-16 sm:py-24">
			<div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 lg:px-8">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
						{copy.faqEyebrow}
					</p>
					<h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
						{copy.faqTitle}
					</h2>
				</div>
				<Accordion className="border-y" collapsible type="single">
					{copy.faqs.map((item, index) => (
						<AccordionItem key={item.question} value={`faq-${index + 1}`}>
							<AccordionTrigger className="py-5 text-base hover:no-underline">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
