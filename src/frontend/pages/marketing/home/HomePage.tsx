import { MarketingFooter } from "@/frontend/components/layout/MarketingFooter";
import { MarketingHeader } from "@/frontend/components/layout/MarketingHeader";
import { useHomePage } from "@/frontend/hooks/pages/useHomePage";
import { heroListing, latestListings } from "./home.mock";
import { ContactCtaSection } from "./sections/ContactCtaSection";
import { HeroSection } from "./sections/HeroSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { LatestPropertiesSection } from "./sections/LatestPropertiesSection";
import { LocalExpertiseSection } from "./sections/LocalExpertiseSection";
import { WhyPrimeEstateSection } from "./sections/WhyPrimeEstateSection";

export function HomePage() {
	const {
		listingIntent,
		location,
		setListingIntent,
		setLocation,
		isSearchDisabled,
	} = useHomePage();

	return (
		<div className="min-h-screen bg-background text-foreground">
			<MarketingHeader />

			<main>
				<HeroSection
					isSearchDisabled={isSearchDisabled}
					listing={heroListing}
					listingIntent={listingIntent}
					location={location}
					onListingIntentChange={setListingIntent}
					onLocationChange={setLocation}
				/>

				<LatestPropertiesSection listings={latestListings} />
				<WhyPrimeEstateSection />
				<HowItWorksSection />
				<LocalExpertiseSection />
				<ContactCtaSection />
			</main>

			<MarketingFooter />
		</div>
	);
}
