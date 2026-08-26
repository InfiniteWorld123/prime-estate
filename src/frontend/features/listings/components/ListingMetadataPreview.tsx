import { ExternalLink } from "lucide-react";

import { createListingSlug } from "@/frontend/features/listings/listing-slug";

type ListingMetadataPreviewCopy = {
	automaticDescription: string;
	automaticSlug: string;
	automaticTitle: string;
	customDescription: string;
	customSlug: string;
	customTitle: string;
	seoPreview: string;
	urlPreview: string;
};

type ListingMetadataPreviewProps = {
	copy: ListingMetadataPreviewCopy;
	description: string;
	seoDescription: string;
	seoTitle: string;
	slug: string;
	title: string;
	variant: "seo" | "url";
};

export function ListingMetadataPreview({
	copy,
	description,
	seoDescription,
	seoTitle,
	slug,
	title,
	variant,
}: ListingMetadataPreviewProps) {
	const generatedSlug = createListingSlug(title) || "house-for-sale-in-jena";
	const effectiveSlug = slug.trim() || generatedSlug;
	const siteUrl = (
		import.meta.env.VITE_PUBLIC_SITE_URL ||
		(typeof window === "undefined"
			? "http://localhost:3000"
			: window.location.origin)
	).replace(/\/$/, "");
	const publicUrl = `${siteUrl}/properties/${effectiveSlug}`;
	const effectiveTitle =
		seoTitle.trim() || title.trim() || "House for sale in Jena";
	const effectiveDescription =
		seoDescription.trim() ||
		description.trim() ||
		"Property description will appear here.";

	if (variant === "url") {
		return (
			<div className="rounded-lg border bg-muted/25 p-3">
				<p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
					{copy.urlPreview}
				</p>
				<p className="mt-2 break-all font-mono text-xs leading-5">
					<span className="text-muted-foreground">{siteUrl}/properties/</span>
					<strong className="text-foreground">{effectiveSlug}</strong>
				</p>
				<p className="mt-2 text-xs text-muted-foreground">
					{slug.trim() ? copy.customSlug : copy.automaticSlug}
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border bg-background p-4">
			<p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
				<ExternalLink className="size-3.5" />
				{copy.seoPreview}
			</p>
			<p className="mt-3 truncate text-xs text-emerald-700 dark:text-emerald-400">
				{publicUrl}
			</p>
			<p className="mt-1 text-base font-semibold text-primary">
				{effectiveTitle}
			</p>
			<p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
				{effectiveDescription}
			</p>
			<div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
				<span className="rounded-full bg-muted px-2 py-1">
					{seoTitle.trim() ? copy.customTitle : copy.automaticTitle}
				</span>
				<span className="rounded-full bg-muted px-2 py-1">
					{seoDescription.trim()
						? copy.customDescription
						: copy.automaticDescription}
				</span>
			</div>
		</div>
	);
}
