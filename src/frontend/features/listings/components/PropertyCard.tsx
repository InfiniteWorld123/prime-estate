import { Link } from "@tanstack/react-router";
import {
	BedDouble,
	Building2,
	ImageOff,
	MapPin,
	Maximize2,
} from "lucide-react";
import type { PropertyCardListing } from "@/frontend/features/listings/listing.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type PropertyCardProps = {
	listing: PropertyCardListing;
};

export function PropertyCard({ listing }: PropertyCardProps) {
	const isForRent = listing.listingType === "RENT";
	const { copy, language } = useLanguage();
	const propertyType =
		listing.propertyType === "HOUSE"
			? copy.property.house
			: copy.property.apartment;
	const priceFormatter = new Intl.NumberFormat(
		language === "de" ? "de-DE" : "en-DE",
		{
			style: "currency",
			currency: "EUR",
			maximumFractionDigits: 0,
		},
	);

	return (
		<article className="h-full">
			<Link
				className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
				params={{ slug: listing.slug }}
				to="/properties/$slug"
			>
				<div className="relative aspect-[4/3] overflow-hidden bg-muted">
					<div className="absolute inset-0 grid place-items-center text-muted-foreground">
						<div className="flex flex-col items-center gap-2">
							<ImageOff aria-hidden="true" className="size-6" />
							<span className="text-xs">{copy.property.imageUnavailable}</span>
						</div>
					</div>

					<img
						alt={listing.image.alt[language]}
						className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"
						decoding="async"
						loading="lazy"
						onError={(event) => {
							event.currentTarget.hidden = true;
						}}
						src={listing.image.src}
					/>

					<span className="absolute left-3 top-3 rounded-md bg-background/95 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur">
						{isForRent ? copy.property.forRent : copy.property.forSale}
					</span>
				</div>

				<div className="flex flex-1 flex-col p-5">
					<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
						<MapPin aria-hidden="true" className="size-4" />
						<span>
							{listing.city}, {listing.postalCode}
						</span>
					</div>

					<h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-6 tracking-tight">
						{listing.title[language]}
					</h3>

					<p className="mt-4 text-xl font-semibold text-primary">
						{priceFormatter.format(listing.price)}
						{isForRent ? (
							<span className="text-sm font-medium text-muted-foreground">
								{" "}
								/ {copy.property.month}
							</span>
						) : null}
					</p>

					<div className="mt-auto grid grid-cols-3 gap-2 border-t pt-4 text-xs text-muted-foreground">
						<span className="inline-flex items-center gap-1.5">
							<BedDouble aria-hidden="true" className="size-4" />
							{listing.rooms}
						</span>

						<span className="inline-flex items-center gap-1.5">
							<Maximize2 aria-hidden="true" className="size-4" />
							{listing.livingArea} m²
						</span>

						<span className="inline-flex items-center justify-end gap-1.5">
							<Building2 aria-hidden="true" className="size-4" />
							{propertyType}
						</span>
					</div>
				</div>
			</Link>
		</article>
	);
}
