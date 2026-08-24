import { MarketingFooter } from "@/frontend/components/layout/MarketingFooter";
import { MarketingHeader } from "@/frontend/components/layout/MarketingHeader";
import { useContactPage } from "@/frontend/hooks/pages/useContactPage";
import { ContactFaqSection } from "./sections/ContactFaqSection";
import { ContactHeroSection } from "./sections/ContactHeroSection";
import { ContactMainSection } from "./sections/ContactMainSection";

export function ContactPage() {
	const contactPage = useContactPage();

	return (
		<div className="min-h-screen bg-background text-foreground">
			<MarketingHeader />
			<main>
				<ContactHeroSection copy={contactPage.copy} />
				<ContactMainSection {...contactPage} />
				<ContactFaqSection copy={contactPage.copy} />
			</main>
			<MarketingFooter />
		</div>
	);
}
