import { MarketingFooter } from "@/frontend/components/layout/MarketingFooter";
import { MarketingHeader } from "@/frontend/components/layout/MarketingHeader";
import { usePropertiesPage } from "@/frontend/hooks/pages/usePropertiesPage";
import { PropertiesResultsSection } from "./sections/PropertiesResultsSection";
import { PropertiesSearchSection } from "./sections/PropertiesSearchSection";

export function PropertiesPage() {
	const {
		applyFilters,
		chips,
		clearFilters,
		currentPage,
		draftFilters,
		features,
		heading,
		isInitialLoading,
		listings,
		locationError,
		previewState,
		removeChip,
		retryResults,
		setListingType,
		setPage,
		setPreviewState,
		setSort,
		sort,
		toggleFeature,
		totalItems,
		totalPages,
		updateDraftFilter,
	} = usePropertiesPage();

	return (
		<div className="min-h-screen bg-background text-foreground">
			<MarketingHeader />

			<main>
				<PropertiesSearchSection
					listingType={draftFilters.listingType}
					onListingTypeChange={setListingType}
				/>
				<div id="property-results">
					<PropertiesResultsSection
						chips={chips}
						currentPage={currentPage}
						features={features}
						filters={draftFilters}
						heading={heading}
						isInitialLoading={isInitialLoading}
						listings={listings}
						locationError={locationError}
						onApplyFilters={applyFilters}
						onClearFilters={clearFilters}
						onFilterChange={updateDraftFilter}
						onPageChange={setPage}
						onPreviewStateChange={setPreviewState}
						onRemoveChip={removeChip}
						onRetryResults={retryResults}
						onSortChange={setSort}
						onToggleFeature={toggleFeature}
						previewState={previewState}
						sort={sort}
						totalItems={totalItems}
						totalPages={totalPages}
					/>
				</div>
			</main>

			<MarketingFooter />
		</div>
	);
}
