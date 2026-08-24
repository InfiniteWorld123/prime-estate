import { Tabs, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import type { ListingIntent } from "@/frontend/hooks/pages/usePropertiesPage";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type PropertiesSearchSectionProps = {
	listingType: ListingIntent;
	onListingTypeChange: (listingType: ListingIntent) => void;
};

export function PropertiesSearchSection({
	listingType,
	onListingTypeChange,
}: PropertiesSearchSectionProps) {
	const { copy } = useLanguage();
	return (
		<section className="border-b bg-muted/35">
			<div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
					{copy.properties.eyebrow}
				</p>
				<div className="mt-3 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
							{copy.properties.heading}
						</h1>
						<p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
							{copy.properties.description}
						</p>
					</div>

					<Tabs
						onValueChange={(value) =>
							onListingTypeChange(value as ListingIntent)
						}
						value={listingType}
					>
						<TabsList className="h-11 w-full p-1 sm:w-auto">
							<TabsTrigger className="px-4" value="ALL">
								{copy.properties.tabs.all}
							</TabsTrigger>
							<TabsTrigger className="px-4" value="SALE">
								{copy.properties.tabs.buy}
							</TabsTrigger>
							<TabsTrigger className="px-4" value="RENT">
								{copy.properties.tabs.rent}
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
			</div>
		</section>
	);
}
