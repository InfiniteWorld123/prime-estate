import { ImageOff, Images, ListChecks } from "lucide-react";
import type { FeatureType } from "#/shared/types/feature.type";
import { Button } from "@/frontend/components/ui/button";
import type { AdminListingDetailRecord } from "@/frontend/features/listings/admin-listing.types";
import type { PropertyImageDraft } from "@/frontend/features/properties/hooks/usePropertyImages";
import type { AdminListingDetailsCopy } from "../admin-listing-details.copy";
import { PropertyFeaturesDialog } from "./PropertyFeaturesDialog";
import { PropertyImagesDialog } from "./PropertyImagesDialog";

type AdminListingMediaPanelProps = {
	availableFeatures: Array<Pick<FeatureType, "code" | "id" | "name">>;
	copy: AdminListingDetailsCopy;
	listing: AdminListingDetailRecord;
	onFeatureCreate: (
		name: string,
	) => Promise<Pick<FeatureType, "code" | "id" | "name">>;
	onFeaturesSave: (
		features: Array<{ id: string; name: string }>,
	) => Promise<void>;
	onImagesSave: (images: PropertyImageDraft[]) => Promise<void>;
};

export function AdminListingMediaPanel({
	availableFeatures,
	copy,
	listing,
	onFeatureCreate,
	onFeaturesSave,
	onImagesSave,
}: AdminListingMediaPanelProps) {
	return (
		<section className="rounded-lg border bg-background p-4 sm:p-6">
			<div>
				<h2 className="font-heading text-lg font-semibold">{copy.media}</h2>
				<p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
					{copy.imagesExplanation}
				</p>
			</div>

			<div className="mt-5 grid gap-4 md:grid-cols-[15rem_minmax(0,1fr)]">
				<PropertyImagesDialog
					copy={copy}
					images={listing.images}
					onSave={onImagesSave}
					trigger={
						<button
							className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted text-muted-foreground outline-none ring-offset-2 hover:border-primary/45 focus-visible:ring-2 focus-visible:ring-ring"
							type="button"
						>
							{listing.coverImage ? (
								<img
									alt={listing.title ?? ""}
									className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none"
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
							<span className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 rounded-md bg-background/92 px-2.5 py-2 text-left text-xs font-semibold text-foreground shadow-sm backdrop-blur">
								<span className="inline-flex items-center gap-1.5">
									<Images
										aria-hidden="true"
										className="size-3.5 text-primary"
									/>
									{copy.editImages}
								</span>
								<span className="font-mono text-muted-foreground">
									{listing.images.length}/30
								</span>
							</span>
						</button>
					}
				/>
				<div className="rounded-lg border p-4">
					<div className="flex items-center justify-between gap-3">
						<p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
							{copy.features}
						</p>
						<PropertyFeaturesDialog
							availableFeatures={availableFeatures}
							copy={copy}
							features={listing.features}
							onCreate={onFeatureCreate}
							onSave={onFeaturesSave}
							trigger={
								<Button size="sm" type="button" variant="outline">
									<ListChecks />
									{copy.editFeatures}
								</Button>
							}
						/>
					</div>
					{listing.features.length > 0 ? (
						<div className="mt-4 flex flex-wrap gap-2">
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
				</div>
			</div>
		</section>
	);
}
