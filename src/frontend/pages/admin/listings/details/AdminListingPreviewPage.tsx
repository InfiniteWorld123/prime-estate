import { Link, useParams } from "@tanstack/react-router";
import {
	AlertTriangle,
	ArrowLeft,
	Eye,
	ImageOff,
	LockKeyhole,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { useAdminListingQuery } from "@/frontend/features/listings/hooks/useAdminListingQuery";
import { toAdminListingDetailRecord } from "@/frontend/features/listings/listing.mapper";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { ListingPreviewSkeleton } from "../components/AdminListingSkeletons";
import { adminListingDetailsCopy } from "./admin-listing-details.copy";

export function AdminListingPreviewPage() {
	const { language } = useLanguage();
	const copy = adminListingDetailsCopy[language];
	const { listingId } = useParams({ strict: false }) as { listingId: string };
	const listingQuery = useAdminListingQuery(listingId);
	const listing = listingQuery.data
		? toAdminListingDetailRecord(listingQuery.data)
		: null;

	if (listingQuery.isPending)
		return <ListingPreviewSkeleton label={copy.loading} />;

	if (listingQuery.error)
		return (
			<div className="grid min-h-[60vh] place-items-center px-4 text-center">
				<div className="max-w-md rounded-lg border border-destructive/25 bg-destructive/5 p-6">
					<AlertTriangle className="mx-auto size-8 text-destructive" />
					<p className="mt-4 font-medium">{copy.loadError}</p>
					<p className="mt-2 text-sm text-muted-foreground">
						{listingQuery.error.message}
					</p>
					<Button className="mt-5" onClick={() => void listingQuery.refetch()}>
						{copy.retry}
					</Button>
				</div>
			</div>
		);

	if (!listing) return null;

	const price = listing.priceAmount
		? new Intl.NumberFormat(language === "de" ? "de-DE" : "en-GB", {
				currency: "EUR",
				maximumFractionDigits: 0,
				style: "currency",
			}).format(listing.priceAmount)
		: "—";
	const address = listing.showExactAddress
		? `${listing.property.streetName} ${listing.property.houseNumber}, ${listing.property.postalCode} ${listing.property.city}`
		: `${listing.property.postalCode} ${listing.property.city}`;

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<div className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-start gap-3">
					<span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
						<Eye className="size-4" />
					</span>
					<div>
						<strong className="text-sm">
							{language === "de" ? "Geschützte Vorschau" : "Protected preview"}
						</strong>
						<p className="mt-1 text-xs text-muted-foreground">
							{language === "de"
								? "Nicht öffentlich, nicht indexierbar und ohne Kontaktaktionen."
								: "Not public, not indexable, and without contact actions."}
						</p>
					</div>
				</div>
				<Button asChild size="sm" variant="outline">
					<Link params={{ listingId }} to="/admin/listings/$listingId">
						<ArrowLeft />
						{language === "de" ? "Zur Bearbeitung" : "Back to editor"}
					</Link>
				</Button>
			</div>

			<div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.7fr)]">
				{listing.coverImage ? (
					<img
						alt={listing.title ?? ""}
						className="aspect-[16/10] w-full rounded-lg object-cover"
						src={listing.coverImage}
					/>
				) : (
					<div className="grid aspect-[16/10] place-items-center rounded-lg bg-muted text-muted-foreground">
						<ImageOff />
					</div>
				)}
				<aside className="rounded-lg border bg-background p-5">
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
						{listing.listingType === "SALE" ? copy.sale : copy.rent}
					</p>
					<h1 className="mt-3 font-heading text-2xl font-semibold">
						{listing.title ?? copy.draft}
					</h1>
					<strong className="mt-5 block text-2xl tabular-nums">{price}</strong>
					<p className="mt-2 text-sm text-muted-foreground">{address}</p>
					<div className="mt-5 grid grid-cols-2 gap-2 border-y py-4 text-sm">
						<span>{listing.property.livingArea} m²</span>
						<span>{listing.property.rooms} rooms</span>
					</div>
					<Button className="mt-5 w-full" disabled>
						<LockKeyhole />
						{language === "de" ? "Kontakt deaktiviert" : "Contact disabled"}
					</Button>
				</aside>
			</div>

			{listing.description ? (
				<section className="mt-6 max-w-3xl rounded-lg border bg-background p-5 sm:p-6">
					<h2 className="font-heading text-lg font-semibold">
						{copy.description}
					</h2>
					<p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
						{listing.description}
					</p>
				</section>
			) : null}
		</div>
	);
}
