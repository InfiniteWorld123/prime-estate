import { Check, MapPin } from "lucide-react";
import type { PropertyDetailListing } from "@/frontend/features/listings/listing.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type PropertyInformationSectionsProps = {
	listing: PropertyDetailListing;
};

export function PropertyInformationSections({
	listing,
}: PropertyInformationSectionsProps) {
	const { copy, language } = useLanguage();
	const sectionCopy = copy.propertyDetails.sections;
	const numberFormatter = new Intl.NumberFormat(
		language === "de" ? "de-DE" : "en-DE",
		{ maximumFractionDigits: 0 },
	);
	const descriptionParagraphs = listing.description
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
	const hasExactAddress = Boolean(
		listing.address.streetName && listing.address.houseNumber,
	);
	const publicLocation = hasExactAddress
		? `${listing.address.streetName} ${listing.address.houseNumber}, ${listing.address.postalCode} ${listing.address.city}`
		: `${listing.address.postalCode} ${listing.address.city}`;
	const details = [
		{ label: sectionCopy.reference, value: listing.referenceNumber },
		...(listing.bedrooms !== null
			? [{ label: sectionCopy.bedrooms, value: String(listing.bedrooms) }]
			: []),
		...(listing.plotArea !== null
			? [
					{
						label: sectionCopy.plotArea,
						value: `${numberFormatter.format(listing.plotArea)} m²`,
					},
				]
			: []),
		...(listing.yearBuilt !== null
			? [{ label: sectionCopy.yearBuilt, value: String(listing.yearBuilt) }]
			: []),
		...(listing.floorNumber !== null
			? [{ label: sectionCopy.floor, value: String(listing.floorNumber) }]
			: []),
		...(listing.totalFloors !== null
			? [{ label: sectionCopy.totalFloors, value: String(listing.totalFloors) }]
			: []),
	];

	return (
		<div className="space-y-12">
			<section aria-labelledby="property-description-heading">
				<h2
					className="text-2xl font-semibold tracking-tight sm:text-3xl"
					id="property-description-heading"
				>
					{sectionCopy.description}
				</h2>
				<div className="mt-5 max-w-3xl space-y-4 text-base leading-8 text-muted-foreground">
					{descriptionParagraphs.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>
			</section>

			{listing.features.length > 0 ? (
				<section aria-labelledby="property-features-heading">
					<h2
						className="text-2xl font-semibold tracking-tight sm:text-3xl"
						id="property-features-heading"
					>
						{sectionCopy.features}
					</h2>
					<ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
						{listing.features.map((feature) => (
							<li
								className="flex items-center gap-3 border-b py-3 text-sm font-medium"
								key={feature.id}
							>
								<span className="grid size-6 place-items-center rounded-full bg-primary/10 text-primary">
									<Check aria-hidden="true" className="size-3.5" />
								</span>
								{feature.name}
							</li>
						))}
					</ul>
				</section>
			) : null}

			<section aria-labelledby="property-details-heading">
				<h2
					className="text-2xl font-semibold tracking-tight sm:text-3xl"
					id="property-details-heading"
				>
					{sectionCopy.details}
				</h2>
				<dl className="mt-5 divide-y rounded-xl border bg-card px-5 sm:px-6">
					{details.map((detail) => (
						<div
							className="flex items-center justify-between gap-6 py-4"
							key={detail.label}
						>
							<dt className="text-sm text-muted-foreground">{detail.label}</dt>
							<dd className="text-right text-sm font-semibold">
								{detail.value}
							</dd>
						</div>
					))}
				</dl>
			</section>

			<section aria-labelledby="property-location-heading">
				<h2
					className="text-2xl font-semibold tracking-tight sm:text-3xl"
					id="property-location-heading"
				>
					{sectionCopy.location}
				</h2>
				<div className="mt-5 flex gap-4 rounded-xl border bg-card p-5 sm:p-6">
					<span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
						<MapPin aria-hidden="true" className="size-5" />
					</span>
					<div>
						<p className="font-semibold">{publicLocation}</p>
						{!hasExactAddress ? (
							<p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
								{sectionCopy.addressOnRequest}
							</p>
						) : null}
					</div>
				</div>
			</section>
		</div>
	);
}
