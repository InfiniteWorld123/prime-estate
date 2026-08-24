import { Bath, BedDouble, Building2, MapPin, Maximize2 } from "lucide-react";
import type { PropertyDetailListing } from "@/frontend/features/listings/listing.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type PropertySummarySectionProps = {
	listing: PropertyDetailListing;
};

export function PropertySummarySection({
	listing,
}: PropertySummarySectionProps) {
	const { copy, language } = useLanguage();
	const summary = copy.propertyDetails.summary;
	const hasExactAddress = Boolean(
		listing.address.streetName && listing.address.houseNumber,
	);
	const price = new Intl.NumberFormat(language === "de" ? "de-DE" : "en-DE", {
		style: "currency",
		currency: listing.currencyCode,
		maximumFractionDigits: 0,
	}).format(listing.price);
	const status =
		listing.archiveOutcome === "SOLD"
			? summary.sold
			: listing.archiveOutcome === "RENTED"
				? summary.rented
				: listing.listingType === "RENT"
					? summary.forRent
					: summary.forSale;
	const propertyType =
		listing.propertyType === "HOUSE" ? summary.house : summary.apartment;
	const publicLocation = hasExactAddress
		? `${listing.address.streetName} ${listing.address.houseNumber}${
				listing.address.unitNumber
					? ` · ${summary.unit} ${listing.address.unitNumber}`
					: ""
			}, ${listing.address.postalCode} ${listing.address.city}`
		: `${listing.address.postalCode} ${listing.address.city}`;

	return (
		<section
			className="border-b py-8 sm:py-10"
			aria-labelledby="property-title"
		>
			<div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
				<div className="max-w-4xl">
					<span className="inline-flex rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
						{status}
					</span>
					<h1
						className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl lg:text-5xl"
						id="property-title"
					>
						{listing.title}
					</h1>
					<div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground sm:text-base">
						<span className="inline-flex items-center gap-2 text-foreground">
							<MapPin aria-hidden="true" className="size-4 text-primary" />
							{publicLocation}
						</span>
						{!hasExactAddress ? (
							<span>· {summary.exactAddressOnRequest}</span>
						) : null}
					</div>
				</div>

				<div className="shrink-0 lg:text-right">
					<p className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
						{price}
					</p>
					{listing.listingType === "RENT" ? (
						<p className="mt-1 text-sm text-muted-foreground">
							/ {summary.month}
						</p>
					) : null}
				</div>
			</div>

			<div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-4">
				<div className="bg-card p-4 sm:p-5">
					<BedDouble aria-hidden="true" className="size-5 text-primary" />
					<p className="mt-3 text-xl font-semibold">{listing.rooms}</p>
					<p className="mt-1 text-sm text-muted-foreground">{summary.rooms}</p>
				</div>
				<div className="bg-card p-4 sm:p-5">
					<Maximize2 aria-hidden="true" className="size-5 text-primary" />
					<p className="mt-3 text-xl font-semibold">{listing.livingArea} m²</p>
					<p className="mt-1 text-sm text-muted-foreground">
						{summary.livingArea}
					</p>
				</div>
				<div className="bg-card p-4 sm:p-5">
					<Bath aria-hidden="true" className="size-5 text-primary" />
					<p className="mt-3 text-xl font-semibold">{listing.bathrooms}</p>
					<p className="mt-1 text-sm text-muted-foreground">
						{summary.bathrooms}
					</p>
				</div>
				<div className="bg-card p-4 sm:p-5">
					<Building2 aria-hidden="true" className="size-5 text-primary" />
					<p className="mt-3 text-xl font-semibold">{propertyType}</p>
					<p className="mt-1 text-sm text-muted-foreground">
						{summary.propertyType}
					</p>
				</div>
			</div>
		</section>
	);
}
