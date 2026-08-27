import { LoaderCircle, X } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/frontend/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import { MobilePropertyFilters } from "@/frontend/features/listings/components/MobilePropertyFilters";
import { PropertyCard } from "@/frontend/features/listings/components/PropertyCard";
import { PropertyCardSkeleton } from "@/frontend/features/listings/components/PropertyCardSkeleton";
import { PropertyFilters } from "@/frontend/features/listings/components/PropertyFilters";
import { PropertyResultsEmpty } from "@/frontend/features/listings/components/PropertyResultsEmpty";
import { PropertyResultsError } from "@/frontend/features/listings/components/PropertyResultsError";
import { PropertyResultsPreview } from "@/frontend/features/listings/components/PropertyResultsPreview";
import { PropertyResultsUpdateError } from "@/frontend/features/listings/components/PropertyResultsUpdateError";
import type {
	PropertyFeatureOption,
	PropertySearchListing,
} from "@/frontend/features/listings/listing.types";
import type {
	PropertyFilterChip,
	PropertyFilters as PropertyFiltersValue,
	PropertyResultsPreviewState,
	PropertySort,
} from "@/frontend/hooks/pages/usePropertiesPage";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { cn } from "@/frontend/lib/utils";

const PROPERTY_SKELETON_IDS = [
	"property-skeleton-01",
	"property-skeleton-02",
	"property-skeleton-03",
	"property-skeleton-04",
	"property-skeleton-05",
	"property-skeleton-06",
	"property-skeleton-07",
	"property-skeleton-08",
	"property-skeleton-09",
	"property-skeleton-10",
	"property-skeleton-11",
	"property-skeleton-12",
] as const;

type PropertiesResultsSectionProps = {
	chips: PropertyFilterChip[];
	currentPage: number;
	features: PropertyFeatureOption[];
	filters: PropertyFiltersValue;
	heading: string;
	hasQueryBackgroundError: boolean;
	hasQueryError: boolean;
	listings: PropertySearchListing[];
	locationError: string;
	isInitialLoading: boolean;
	isQueryRefreshing: boolean;
	onApplyFilters: () => boolean;
	onClearFilters: () => void;
	onFilterChange: <Key extends keyof PropertyFiltersValue>(
		key: Key,
		value: PropertyFiltersValue[Key],
	) => void;
	onPageChange: (page: number) => void;
	onPreviewStateChange: (state: PropertyResultsPreviewState) => void;
	onRemoveChip: (chipId: string) => void;
	onRetryResults: () => void;
	onSortChange: (sort: PropertySort) => void;
	onToggleFeature: (featureId: string) => void;
	previewState: PropertyResultsPreviewState;
	sort: PropertySort;
	totalItems: number;
	totalPages: number;
};

const visiblePages = (currentPage: number, totalPages: number) => {
	if (totalPages <= 5)
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	const pages: Array<number | "ellipsis-start" | "ellipsis-end"> = [1];
	if (currentPage > 3) pages.push("ellipsis-start");
	for (
		let page = Math.max(2, currentPage - 1);
		page <= Math.min(totalPages - 1, currentPage + 1);
		page += 1
	)
		pages.push(page);
	if (currentPage < totalPages - 2) pages.push("ellipsis-end");
	pages.push(totalPages);
	return pages;
};

export function PropertiesResultsSection({
	isInitialLoading,
	chips,
	currentPage,
	features,
	filters,
	heading,
	hasQueryBackgroundError,
	hasQueryError,
	isQueryRefreshing,
	listings,
	locationError,
	onApplyFilters,
	onClearFilters,
	onFilterChange,
	onPageChange,
	onPreviewStateChange,
	onRemoveChip,
	onRetryResults,
	onSortChange,
	onToggleFeature,
	previewState,
	sort,
	totalItems,
	totalPages,
}: PropertiesResultsSectionProps) {
	const { copy } = useLanguage();
	const pages = visiblePages(currentPage, totalPages);
	const isFullError = hasQueryError || previewState === "error";
	const isRefreshing = isQueryRefreshing || previewState === "refreshing";
	const hasBackgroundError =
		hasQueryBackgroundError || previewState === "background-error";
	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
			<PropertyResultsPreview
				onStateChange={onPreviewStateChange}
				state={previewState}
			/>

			<div className="grid gap-8 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:items-start">
				<aside className="hidden lg:block">
					<PropertyFilters
						features={features}
						filters={filters}
						locationError={locationError}
						onApply={onApplyFilters}
						onClear={onClearFilters}
						onFilterChange={onFilterChange}
						onToggleFeature={onToggleFeature}
					/>
				</aside>

				<div className="min-w-0">
					<div className="mb-5 lg:hidden">
						<MobilePropertyFilters
							activeFilterCount={chips.length}
							features={features}
							filters={filters}
							locationError={locationError}
							onApply={onApplyFilters}
							onClear={onClearFilters}
							onFilterChange={onFilterChange}
							onToggleFeature={onToggleFeature}
						/>
					</div>
					<div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h2 className="text-2xl font-semibold tracking-tight">
								{heading}
							</h2>
							<div
								aria-live="polite"
								className="mt-1 flex min-h-5 items-center gap-2 text-sm text-muted-foreground"
							>
								{!isFullError ? (
									<>
										<span>
											{copy.properties.results.count.replace(
												"{count}",
												String(totalItems),
											)}
										</span>
										{isRefreshing ? (
											<LoaderCircle
												aria-hidden="true"
												className="size-4 animate-spin motion-reduce:animate-none"
											/>
										) : null}
									</>
								) : null}
							</div>
						</div>

						<div className="flex items-center gap-2 text-sm font-medium">
							<span>{copy.properties.results.sortLabel}</span>
							<Select
								disabled={isFullError || isInitialLoading}
								onValueChange={(value) => onSortChange(value as PropertySort)}
								value={sort}
							>
								<SelectTrigger
									aria-label={copy.properties.results.sortLabel}
									className="h-9 w-52"
								>
									<SelectValue placeholder={copy.properties.sort.newest} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="newest">
										{copy.properties.sort.newest}
									</SelectItem>
									<SelectItem value="price_asc">
										{copy.properties.sort.priceAsc}
									</SelectItem>
									<SelectItem value="price_desc">
										{copy.properties.sort.priceDesc}
									</SelectItem>
									<SelectItem value="living_area_asc">
										{copy.properties.sort.areaAsc}
									</SelectItem>
									<SelectItem value="living_area_desc">
										{copy.properties.sort.areaDesc}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{chips.length ? (
						<div className="flex flex-wrap items-center gap-2 py-5">
							{chips.map((chip) => (
								<Button
									className="rounded-full"
									key={chip.id}
									onClick={() => onRemoveChip(chip.id)}
									size="sm"
									type="button"
									variant="secondary"
								>
									{chip.label}
									<X aria-hidden="true" />
								</Button>
							))}
							<Button
								onClick={onClearFilters}
								size="sm"
								type="button"
								variant="link"
							>
								{copy.properties.filters.clearAll}
							</Button>
						</div>
					) : null}

					{!isInitialLoading && hasBackgroundError ? (
						<PropertyResultsUpdateError onRetry={onRetryResults} />
					) : null}

					{!isInitialLoading && isFullError ? (
						<PropertyResultsError onRetry={onRetryResults} />
					) : !isInitialLoading && listings.length === 0 ? (
						<PropertyResultsEmpty onReset={onClearFilters} />
					) : (
						<div
							aria-busy={isInitialLoading || isRefreshing}
							className={cn(
								"mt-6 grid gap-6 transition-opacity sm:grid-cols-2 xl:grid-cols-3",
								isRefreshing && "opacity-55",
							)}
						>
							{isInitialLoading
								? PROPERTY_SKELETON_IDS.map((skeletonId) => (
										<PropertyCardSkeleton key={skeletonId} />
									))
								: listings.map((listing) => (
										<PropertyCard key={listing.id} listing={listing} />
									))}
						</div>
					)}

					{!isInitialLoading &&
					!isFullError &&
					listings.length > 0 &&
					totalPages > 1 ? (
						<Pagination
							className="mt-10"
							aria-label={copy.properties.pagination.label}
						>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										aria-disabled={currentPage === 1}
										className={
											currentPage === 1
												? "pointer-events-none opacity-45"
												: undefined
										}
										href="#property-results"
										onClick={(event) => {
											event.preventDefault();
											onPageChange(currentPage - 1);
										}}
										text={copy.properties.pagination.previous}
									/>
								</PaginationItem>

								{pages.map((page) => (
									<PaginationItem key={page}>
										{typeof page === "number" ? (
											<PaginationLink
												href="#property-results"
												isActive={page === currentPage}
												onClick={(event) => {
													event.preventDefault();
													onPageChange(page);
												}}
											>
												{page}
											</PaginationLink>
										) : (
											<PaginationEllipsis />
										)}
									</PaginationItem>
								))}

								<PaginationItem>
									<PaginationNext
										aria-disabled={currentPage === totalPages}
										className={
											currentPage === totalPages
												? "pointer-events-none opacity-45"
												: undefined
										}
										href="#property-results"
										onClick={(event) => {
											event.preventDefault();
											onPageChange(currentPage + 1);
										}}
										text={copy.properties.pagination.next}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					) : null}
				</div>
			</div>
		</section>
	);
}
