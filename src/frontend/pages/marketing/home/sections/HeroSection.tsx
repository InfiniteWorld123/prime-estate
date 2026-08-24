import { BedDouble, Building2, MapPin, Maximize2, Search } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import type { ListingIntent } from "@/frontend/hooks/pages/useHomePage";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import type { HomeListing } from "../home.mock.ts";

type HeroSectionProps = {
	listing: HomeListing;
	listingIntent: ListingIntent;
	location: string;
	isSearchDisabled: boolean;
	onListingIntentChange: (intent: ListingIntent) => void;
	onLocationChange: (location: string) => void;
};

export function HeroSection({
	listing,
	listingIntent,
	location,
	isSearchDisabled,
	onListingIntentChange,
	onLocationChange,
}: HeroSectionProps) {
	const { copy, language } = useLanguage();
	const propertyType =
		listing.propertyType === "HOUSE"
			? copy.property.house
			: copy.property.apartment;
	const listingLabel =
		listing.listingType === "RENT"
			? copy.property.forRent
			: copy.property.forSale;
	const priceFormatter = new Intl.NumberFormat(
		language === "de" ? "de-DE" : "en-DE",
		{
			style: "currency",
			currency: "EUR",
			maximumFractionDigits: 0,
		},
	);
	return (
		<section className="relative isolate overflow-hidden border-b">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 opacity-45 dark:opacity-20"
			>
				<div className="absolute left-[8%] top-0 h-full w-px bg-border" />
				<div className="absolute right-[12%] top-0 h-full w-px bg-border" />
				<div className="absolute left-0 top-[18%] h-px w-full bg-border" />
				<div className="absolute left-0 top-[72%] h-px w-full bg-border" />
				<div className="absolute left-[8%] top-[18%] size-2 -translate-x-1/2 -translate-y-1/2 bg-primary" />
			</div>

			<div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
				<div className="max-w-2xl">
					<div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
						<span aria-hidden="true" className="h-px w-8 bg-primary" />
						{copy.hero.eyebrow}
					</div>

					<h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
						{copy.hero.heading}{" "}
						<span className="font-serif font-normal italic text-primary">
							{copy.hero.headingAccent}
						</span>
					</h1>

					<p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
						{copy.hero.description}
					</p>

					<form
						className="mt-9 rounded-lg border bg-card p-3 shadow-sm sm:p-4"
						onSubmit={(event) => event.preventDefault()}
					>
						<Tabs
							onValueChange={(value) =>
								onListingIntentChange(value as ListingIntent)
							}
							value={listingIntent}
						>
							<TabsList className="grid w-full grid-cols-2 sm:w-56">
								<TabsTrigger value="sale">{copy.hero.buy}</TabsTrigger>
								<TabsTrigger value="rent">{copy.hero.rent}</TabsTrigger>
							</TabsList>
						</Tabs>

						<div className="mt-3 flex flex-col gap-3 sm:flex-row">
							<div className="relative flex-1">
								<label className="sr-only" htmlFor="hero-location">
									{copy.hero.locationLabel}
								</label>

								<MapPin
									aria-hidden="true"
									className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
								/>

								<Input
									autoComplete="postal-code"
									className="h-11 pl-9"
									id="hero-location"
									onChange={(event) => onLocationChange(event.target.value)}
									placeholder={copy.hero.locationPlaceholder}
									value={location}
								/>
							</div>

							<Button
								className="h-11 gap-2 px-5"
								disabled={isSearchDisabled}
								title={copy.hero.searchTitle}
								type="submit"
							>
								<Search aria-hidden="true" />
								{copy.hero.search}
							</Button>
						</div>

						<p className="mt-3 text-xs text-muted-foreground">
							{copy.hero.hint}
						</p>
					</form>
				</div>

				<div className="relative">
					<div
						aria-hidden="true"
						className="absolute -bottom-4 -right-4 hidden h-full w-full rounded-lg border border-primary/20 bg-accent lg:block"
					/>

					<article className="relative overflow-hidden rounded-lg border bg-card shadow-md">
						<div className="relative aspect-[4/3] overflow-hidden bg-muted">
							<img
								alt={listing.image.alt[language]}
								className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none lg:hover:scale-[1.02]"
								decoding="async"
								fetchPriority="high"
								src={listing.image.src}
							/>

							<div className="absolute left-4 top-4 rounded-md bg-background/95 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground shadow-sm backdrop-blur">
								{copy.hero.recentlyAdded}
							</div>

							<div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />

							<p className="absolute bottom-4 left-4 text-sm font-medium text-white">
								{listing.city}, {listing.postalCode}
							</p>
						</div>

						<div className="p-5 sm:p-6">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
										{propertyType} · {listingLabel}
									</p>

									<h2 className="mt-2 text-xl font-semibold tracking-tight">
										{listing.title[language]}
									</h2>
								</div>

								<p className="shrink-0 text-xl font-semibold text-primary">
									{priceFormatter.format(listing.price)}
								</p>
							</div>

							<div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t pt-4 text-sm text-muted-foreground">
								<span className="inline-flex items-center gap-2">
									<BedDouble aria-hidden="true" className="size-4" />
									{listing.rooms} {copy.property.rooms}
								</span>

								<span className="inline-flex items-center gap-2">
									<Maximize2 aria-hidden="true" className="size-4" />
									{listing.livingArea} m²
								</span>

								<span className="inline-flex items-center gap-2">
									<Building2 aria-hidden="true" className="size-4" />
									{propertyType}
								</span>
							</div>
						</div>
					</article>
				</div>
			</div>
		</section>
	);
}
