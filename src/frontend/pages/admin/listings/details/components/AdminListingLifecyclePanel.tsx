import { Link } from "@tanstack/react-router";
import {
	Archive,
	Check,
	Circle,
	ExternalLink,
	Eye,
	Trash2,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/frontend/components/ui/tooltip";
import type { AdminListingDetailRecord } from "@/frontend/features/listings/admin-listing.types";
import { cn } from "@/frontend/lib/utils";
import type { AdminListingDetailsCopy } from "../admin-listing-details.copy";
import { getPublishBlockers } from "../admin-listing-details.model";

type AdminListingLifecyclePanelProps = {
	copy: AdminListingDetailsCopy;
	isDirty: boolean;
	listing: AdminListingDetailRecord;
	onArchive: () => void;
	onDelete: () => void;
	onPublish: () => void;
};

function formatDate(value: string | null) {
	if (!value) return "—";
	return new Intl.DateTimeFormat("de-DE", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

function statusLabel(
	listing: AdminListingDetailRecord,
	copy: AdminListingDetailsCopy,
) {
	if (listing.status === "DRAFT") return copy.draft;
	if (listing.status === "PUBLISHED") return copy.published;
	if (listing.archiveOutcome === "SOLD") return copy.sold;
	if (listing.archiveOutcome === "RENTED") return copy.rented;
	if (listing.archiveOutcome === "WITHDRAWN") return copy.withdrawn;
	return copy.archived;
}

export function AdminListingLifecyclePanel({
	copy,
	isDirty,
	listing,
	onArchive,
	onDelete,
	onPublish,
}: AdminListingLifecyclePanelProps) {
	const blockers = getPublishBlockers(listing);
	const publishDisabled = blockers.length > 0 || isDirty;
	return (
		<aside className="rounded-lg border bg-background p-4 lg:sticky lg:top-24">
			<div className="flex items-center justify-between gap-3">
				<p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
					{copy.status}
				</p>
				<span
					className={cn(
						"rounded-full border px-2.5 py-1 text-xs font-semibold",
						listing.status === "DRAFT" &&
							"border-amber-500/25 bg-amber-500/8 text-amber-800 dark:text-amber-300",
						listing.status === "PUBLISHED" &&
							"border-emerald-600/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300",
						listing.status === "ARCHIVED" && "bg-muted text-muted-foreground",
					)}
				>
					{statusLabel(listing, copy)}
				</span>
			</div>

			{listing.status === "DRAFT" ? (
				<>
					<h2 className="mt-5 font-heading text-lg font-semibold">
						{copy.readiness}
					</h2>
					<ul className="mt-4 space-y-3">
						{(["price", "title", "description", "coverImage"] as const).map(
							(item) => {
								const complete = !blockers.includes(item);
								return (
									<li className="flex items-center gap-2 text-sm" key={item}>
										{complete ? (
											<Check className="size-4 text-emerald-600" />
										) : (
											<Circle className="size-4 text-muted-foreground" />
										)}
										<span className={cn(!complete && "text-muted-foreground")}>
											{copy.blockers[item]}
										</span>
									</li>
								);
							},
						)}
					</ul>
					{blockers.length === 0 ? (
						<p className="mt-4 rounded-md bg-emerald-500/8 p-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
							{copy.ready}
						</p>
					) : null}
					<div className="mt-5 grid gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="block" tabIndex={publishDisabled ? 0 : -1}>
										<Button
											className="w-full"
											disabled={publishDisabled}
											onClick={onPublish}
											type="button"
										>
											{copy.publish}
										</Button>
									</span>
								</TooltipTrigger>
								<TooltipContent align="end" side="left">
									<p className="font-semibold">{copy.publishChecklist}</p>
									<ul className="mt-2 space-y-1.5">
										{(
											["price", "title", "description", "coverImage"] as const
										).map((item) => {
											const complete = !blockers.includes(item);
											return (
												<li className="flex items-center gap-2" key={item}>
													{complete ? (
														<Check className="size-3.5 text-emerald-600" />
													) : (
														<Circle className="size-3.5 text-muted-foreground" />
													)}
													<span>{copy.blockers[item]}</span>
												</li>
											);
										})}
									</ul>
									{isDirty ? (
										<p className="mt-2 border-t pt-2 text-xs font-medium text-amber-700 dark:text-amber-300">
											{copy.saveBeforePublish}
										</p>
									) : null}
									<p className="mt-2 border-t pt-2 text-xs leading-5 text-muted-foreground">
										{copy.publishOptional}
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						{isDirty ? (
							<Button
								disabled
								title={copy.unavailablePreview}
								type="button"
								variant="outline"
							>
								<Eye />
								{copy.preview}
							</Button>
						) : (
							<Button asChild variant="outline">
								<Link
									params={{ listingId: listing.id }}
									target="_blank"
									to="/admin/listings/$listingId/preview"
								>
									<Eye />
									{copy.preview}
								</Link>
							</Button>
						)}
						<Button onClick={onDelete} type="button" variant="ghost">
							<Trash2 />
							{copy.delete}
						</Button>
					</div>
				</>
			) : null}

			{listing.status === "PUBLISHED" ? (
				<div className="mt-5 space-y-4">
					<div className="rounded-md bg-emerald-500/8 p-3 text-sm text-emerald-800 dark:text-emerald-200">
						{copy.publishedAt}: {formatDate(listing.publishedAt)}
					</div>
					<p className="break-all font-mono text-xs text-muted-foreground">
						/properties/{listing.slug}
					</p>
					{listing.slug ? (
						<Button asChild className="w-full" variant="outline">
							<Link
								params={{ slug: listing.slug }}
								target="_blank"
								to="/properties/$slug"
							>
								<ExternalLink />
								{copy.openPublic}
							</Link>
						</Button>
					) : null}
					<Button
						className="w-full"
						onClick={onArchive}
						type="button"
						variant="outline"
					>
						<Archive />
						{copy.archive}
					</Button>
				</div>
			) : null}

			{listing.status === "ARCHIVED" ? (
				<div className="mt-5 space-y-3 text-sm">
					<p>
						<span className="text-muted-foreground">{copy.archivedAt}: </span>
						{formatDate(listing.archivedAt)}
					</p>
					{listing.archiveOutcome === "WITHDRAWN" ? (
						<p className="rounded-md bg-muted p-3 text-muted-foreground">
							{copy.noPublicPage}
						</p>
					) : listing.slug ? (
						<Button asChild className="w-full" variant="outline">
							<Link
								params={{ slug: listing.slug }}
								target="_blank"
								to="/properties/$slug"
							>
								<ExternalLink />
								{copy.openPublic}
							</Link>
						</Button>
					) : null}
				</div>
			) : null}
		</aside>
	);
}
