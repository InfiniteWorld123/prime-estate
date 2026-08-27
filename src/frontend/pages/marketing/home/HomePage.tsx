import { MarketingFooter } from "@/frontend/components/layout/MarketingFooter";
import { MarketingHeader } from "@/frontend/components/layout/MarketingHeader";
import { useHomePage } from "@/frontend/hooks/pages/useHomePage";
import { ContactCtaSection } from "./sections/ContactCtaSection";
import { HeroSection } from "./sections/HeroSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { LatestPropertiesSection } from "./sections/LatestPropertiesSection";
import { LocalExpertiseSection } from "./sections/LocalExpertiseSection";
import { WhyPrimeEstateSection } from "./sections/WhyPrimeEstateSection";

export function HomePage() {
	const {
		heroListing,
		isError,
		isLoading,
		latestListings,
		listingIntent,
		location,
		retry,
		search,
		setListingIntent,
		setLocation,
	} = useHomePage();

	return (
		<div className="min-h-screen bg-background text-foreground">
			<MarketingHeader />

			<main>
				<HeroSection
					isSearchDisabled={false}
					listing={heroListing}
					listingIntent={listingIntent}
					location={location}
					onListingIntentChange={setListingIntent}
					onLocationChange={setLocation}
					onSearch={search}
				/>

				<LatestPropertiesSection
					isError={isError}
					isLoading={isLoading}
					listings={latestListings}
					onRetry={() => void retry()}
				/>
				<WhyPrimeEstateSection />
				<HowItWorksSection />
				<LocalExpertiseSection />
				<ContactCtaSection />
			</main>

			<MarketingFooter />
		</div>
	);
}
