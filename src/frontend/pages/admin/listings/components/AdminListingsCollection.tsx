import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Building2, House, ImageOff } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import type { AdminListingRecord } from "@/frontend/features/listings/admin-listing.types";
import { cn } from "@/frontend/lib/utils";
import type { AdminListingsCopy } from "../admin-listings.copy";

type AdminListingsCollectionProps = {
	copy: AdminListingsCopy;
	listings: AdminListingRecord[];
};

function statusLabel(listing: AdminListingRecord, copy: AdminListingsCopy) {
	if (listing.status === "DRAFT") return copy.draft;
	if (listing.status === "PUBLISHED") return copy.published;
	if (listing.archiveOutcome === "SOLD") return copy.sold;
	if (listing.archiveOutcome === "RENTED") return copy.rented;
	if (listing.archiveOutcome === "WITHDRAWN") return copy.withdrawn;
	return copy.archived;
}

function ListingStatus({
	copy,
	listing,
}: {
	copy: AdminListingsCopy;
	listing: AdminListingRecord;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
				listing.status === "DRAFT" &&
					"border-amber-500/25 bg-amber-500/8 text-amber-800 dark:text-amber-300",
				listing.status === "PUBLISHED" &&
					"border-emerald-600/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300",
				listing.status === "ARCHIVED" && "bg-muted text-muted-foreground",
			)}
		>
			{statusLabel(listing, copy)}
		</span>
	);
}

function formatPrice(listing: AdminListingRecord, copy: AdminListingsCopy) {
	if (listing.priceAmount === null) return copy.noPrice;
	return new Intl.NumberFormat("de-DE", {
		currency: "EUR",
		maximumFractionDigits: 0,
		style: "currency",
	}).format(listing.priceAmount);
}

function formatDate(value: string, locale: string) {
	return new Intl.DateTimeFormat(locale, {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

function ListingCover({
	copy,
	listing,
}: {
	copy: AdminListingsCopy;
	listing: AdminListingRecord;
}) {
	if (!listing.coverImage)
		return (
			<div
				aria-label={copy.missingImage}
				className="grid h-12 w-[4.5rem] shrink-0 place-items-center rounded-md bg-muted text-muted-foreground"
				role="img"
			>
				<ImageOff className="size-4" />
			</div>
		);
	return (
		<img
			alt=""
			className="h-12 w-[4.5rem] shrink-0 rounded-md object-cover"
			loading="lazy"
			src={listing.coverImage}
		/>
	);
}

export function AdminListingsCollection({
	copy,
	listings,
}: AdminListingsCollectionProps) {
	if (listings.length === 0)
		return (
			<div className="mt-5 grid min-h-60 place-items-center rounded-lg border bg-background p-6 text-center text-sm text-muted-foreground">
				{copy.empty}
			</div>
		);

	return (
		<>
			<div className="mt-5 hidden overflow-x-auto rounded-lg border bg-background lg:block">
				<table className="w-full min-w-[64rem] border-collapse text-left text-sm">
					<thead className="border-b bg-muted/45 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
						<tr>
							<th className="px-4 py-3">{copy.table.title}</th>
							<th className="px-3 py-3">{copy.table.address}</th>
							<th className="px-3 py-3">{copy.listingType}</th>
							<th className="px-3 py-3">{copy.table.price}</th>
							<th className="px-3 py-3">{copy.table.status}</th>
							<th className="px-3 py-3">{copy.table.updated}</th>
							<th className="w-14 px-3 py-3">
								<span className="sr-only">{copy.view}</span>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y">
						{listings.map((listing) => {
							const TypeIcon =
								listing.property.propertyType === "HOUSE" ? House : Building2;
							return (
								<tr
									className="transition-colors hover:bg-muted/25"
									key={listing.id}
								>
									<td className="px-4 py-3">
										<div className="flex items-center gap-3">
											<ListingCover copy={copy} listing={listing} />
											<div className="min-w-0">
												<p className="max-w-64 truncate font-semibold">
													{listing.title ?? copy.untitled}
												</p>
												<p className="mt-1 font-mono text-xs text-muted-foreground">
													{listing.slug ?? listing.id}
												</p>
											</div>
										</div>
									</td>
									<td className="px-3 py-3">
										<p className="flex items-center gap-1.5 font-medium">
											<TypeIcon className="size-3.5 text-muted-foreground" />
											{listing.property.referenceNumber}
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{listing.property.postalCode} {listing.property.city}
										</p>
									</td>
									<td className="px-3 py-3">
										{listing.listingType === "SALE" ? copy.sale : copy.rent}
									</td>
									<td className="px-3 py-3 font-medium tabular-nums">
										{formatPrice(listing, copy)}
									</td>
									<td className="px-3 py-3">
										<ListingStatus copy={copy} listing={listing} />
									</td>
									<td className="px-3 py-3 text-muted-foreground">
										{formatDate(listing.updatedAt, copy.locale)}
									</td>
									<td className="px-3 py-3">
										<Button
											asChild
											aria-label={`${copy.view}: ${listing.title ?? copy.untitled}`}
											size="icon"
											variant="ghost"
										>
											<Link
												params={{ listingId: listing.id }}
												to="/admin/listings/$listingId"
											>
												<ArrowUpRight />
											</Link>
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div className="mt-5 grid gap-3 lg:hidden">
				{listings.map((listing) => (
					<Link
						className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted/20"
						key={listing.id}
						params={{ listingId: listing.id }}
						to="/admin/listings/$listingId"
					>
						<div className="flex gap-3">
							<ListingCover copy={copy} listing={listing} />
							<div className="min-w-0 flex-1">
								<p className="truncate font-semibold">
									{listing.title ?? copy.untitled}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{listing.property.referenceNumber} · {listing.property.city}
								</p>
							</div>
						</div>
						<div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3 text-sm">
							<ListingStatus copy={copy} listing={listing} />
							<span className="text-muted-foreground">
								{listing.listingType === "SALE" ? copy.sale : copy.rent}
							</span>
							<strong className="ml-auto tabular-nums">
								{formatPrice(listing, copy)}
							</strong>
						</div>
					</Link>
				))}
			</div>
		</>
	);
}
