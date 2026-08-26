import { Link } from "@tanstack/react-router";
import { ImageOff, Images, ListChecks } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import type { AdminListingDetailRecord } from "@/frontend/features/listings/admin-listing.types";
import type { AdminListingDetailsCopy } from "../admin-listing-details.copy";
import { QuickCoverDialog } from "./QuickCoverDialog";

type AdminListingMediaPanelProps = {
	copy: AdminListingDetailsCopy;
	listing: AdminListingDetailRecord;
	onCoverSelect: (cover: {
		altText: string | null;
		id: string;
		url: string;
	}) => void;
};

export function AdminListingMediaPanel({
	copy,
	listing,
	onCoverSelect,
}: AdminListingMediaPanelProps) {
	return (
		<section className="rounded-lg border bg-background p-4 sm:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h2 className="font-heading text-lg font-semibold">{copy.media}</h2>
					<p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
						{copy.imagesExplanation}
					</p>
				</div>
				<Button asChild size="sm" variant="outline">
					<Link
						params={{ propertyId: listing.property.id }}
						to="/admin/properties/$propertyId/images"
					>
						<Images />
						{copy.manageImages}
					</Link>
				</Button>
			</div>

			<div className="mt-5 grid gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
				<QuickCoverDialog
					copy={copy}
					listing={listing}
					onSelect={onCoverSelect}
					trigger={
						<button
							className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-muted text-muted-foreground outline-none ring-offset-2 hover:bg-muted/75 focus-visible:ring-2 focus-visible:ring-ring"
							type="button"
						>
							{listing.coverImage ? (
								<img
									alt={listing.title ?? ""}
									className="size-full object-cover transition-opacity group-hover:opacity-80"
									src={listing.coverImage}
								/>
							) : (
								<span className="grid size-full place-items-center text-center text-xs">
									<span>
										<ImageOff className="mx-auto mb-2 size-5" />
										{copy.noCover}
									</span>
								</span>
							)}
						</button>
					}
				/>
				<div className="rounded-md border p-4">
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
						{copy.features}
					</p>
					{listing.features.length > 0 ? (
						<div className="mt-3 flex flex-wrap gap-2">
							{listing.features.map((feature) => (
								<span
									className="rounded-full border bg-muted/35 px-2.5 py-1 text-xs"
									key={feature.id}
								>
									{feature.name}
								</span>
							))}
						</div>
					) : (
						<p className="mt-3 text-sm text-muted-foreground">
							{copy.featuresEmpty}
						</p>
					)}
					<Button asChild className="mt-4" size="sm" variant="ghost">
						<Link
							params={{ propertyId: listing.property.id }}
							to="/admin/properties/$propertyId/features"
						>
							<ListChecks />
							{copy.manageFeatures}
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
