import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { MarketingFooter } from "@/frontend/components/layout/MarketingFooter";
import { MarketingHeader } from "@/frontend/components/layout/MarketingHeader";
import { usePropertyDetailsPage } from "@/frontend/hooks/pages/usePropertyDetailsPage";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { PropertyBreadcrumb } from "./components/PropertyBreadcrumb";
import { PropertyDetailsPreview } from "./components/PropertyDetailsPreview";
import { PropertyDetailsSkeleton } from "./components/PropertyDetailsSkeleton";
import { PropertyDetailsState } from "./components/PropertyDetailsState";
import { PropertyContactCard } from "./sections/PropertyContactCard";
import { PropertyGallerySection } from "./sections/PropertyGallerySection";
import { PropertyInformationSections } from "./sections/PropertyInformationSections";
import { PropertySummarySection } from "./sections/PropertySummarySection";

type PropertyDetailsPageProps = {
	slug: string;
};

export function PropertyDetailsPage({ slug }: PropertyDetailsPageProps) {
	const { copy } = useLanguage();
	const {
		hasBackgroundError,
		isError,
		isLoading,
		isNotFound,
		listing,
		previewState,
		retry,
		setPreviewState,
	} = usePropertyDetailsPage(slug);
	const galleryCopy = copy.propertyDetails.gallery;

	useEffect(() => {
		if (!listing) return;
		document.title = listing.seoTitle;
		const description = document.querySelector<HTMLMetaElement>(
			'meta[name="description"]',
		);
		description?.setAttribute("content", listing.seoDescription);

		return () => {
			document.title = copy.meta.title;
			description?.setAttribute("content", copy.meta.description);
		};
	}, [copy.meta.description, copy.meta.title, listing]);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<MarketingHeader />

			<main>
				<div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
					{isLoading ? <PropertyDetailsSkeleton /> : null}

					{!isLoading && isError ? (
						<PropertyDetailsState onRetry={retry} type="error" />
					) : null}

					{!isLoading && isNotFound ? (
						<PropertyDetailsState type="not-found" />
					) : null}

					{!isLoading && !isError && !isNotFound && listing ? (
						<>
							<PropertyBreadcrumb title={listing.title} />

							<div className="mt-6">
								<PropertyGallerySection
									closeLabel={galleryCopy.close}
									fallbackLabel={galleryCopy.imageUnavailable}
									galleryLabel={galleryCopy.label}
									images={listing.images}
									nextLabel={galleryCopy.next}
									openImageLabel={galleryCopy.openImage}
									photosLabel={galleryCopy.photos}
									previousLabel={galleryCopy.previous}
								/>
							</div>

							<PropertySummarySection listing={listing} />

							{hasBackgroundError ? (
								<output className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
									<AlertTriangle
										aria-hidden="true"
										className="mt-0.5 size-4 shrink-0"
									/>
									{copy.propertyDetails.states.updateError}
								</output>
							) : null}

							<div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
								<PropertyInformationSections listing={listing} />
								<PropertyContactCard listing={listing} />
							</div>
						</>
					) : null}
				</div>
			</main>

			<MarketingFooter />

			<PropertyDetailsPreview
				onStateChange={setPreviewState}
				state={previewState}
			/>
		</div>
	);
}
