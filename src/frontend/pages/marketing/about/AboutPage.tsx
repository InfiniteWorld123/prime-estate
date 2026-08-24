import { MarketingFooter } from "@/frontend/components/layout/MarketingFooter";
import { MarketingHeader } from "@/frontend/components/layout/MarketingHeader";
import { AboutApproachSection } from "./sections/AboutApproachSection";
import { AboutHeroSection } from "./sections/AboutHeroSection";
import { AboutLocalSection } from "./sections/AboutLocalSection";

export function AboutPage() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<MarketingHeader />
			<main>
				<AboutHeroSection />
				<AboutApproachSection />
				<AboutLocalSection />
			</main>
			<MarketingFooter />
		</div>
	);
}
