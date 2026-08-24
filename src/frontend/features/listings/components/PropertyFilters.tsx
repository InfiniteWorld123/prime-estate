import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { BedroomsFilter } from "@/frontend/features/listings/components/filters/BedroomsFilter";
import { FeaturesFilter } from "@/frontend/features/listings/components/filters/FeaturesFilter";
import { LocationFilter } from "@/frontend/features/listings/components/filters/LocationFilter";
import { PropertyTypeFilter } from "@/frontend/features/listings/components/filters/PropertyTypeFilter";
import { RangeFilter } from "@/frontend/features/listings/components/filters/RangeFilter";
import type { PropertyFeatureOption } from "@/frontend/features/listings/listing.types";
import type { PropertyFilters as PropertyFiltersValue } from "@/frontend/hooks/pages/usePropertiesPage";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { cn } from "@/frontend/lib/utils";

export type PropertyFiltersProps = {
	features: PropertyFeatureOption[];
	filters: PropertyFiltersValue;
	locationError: string;
	className?: string;
	onApply: () => boolean;
	onClear: () => void;
	onFilterChange: <Key extends keyof PropertyFiltersValue>(
		key: Key,
		value: PropertyFiltersValue[Key],
	) => void;
	onToggleFeature: (featureId: string) => void;
};

export function PropertyFilters({
	className,
	features,
	filters,
	locationError,
	onApply,
	onClear,
	onFilterChange,
	onToggleFeature,
}: PropertyFiltersProps) {
	const { copy } = useLanguage();
	const priceLabel =
		filters.listingType === "SALE"
			? copy.properties.filters.purchasePrice
			: filters.listingType === "RENT"
				? copy.properties.filters.monthlyRent
				: copy.properties.filters.price;

	return (
		<div className={cn("rounded-lg border bg-card p-5 shadow-sm", className)}>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<SlidersHorizontal
						aria-hidden="true"
						className="size-4 text-primary"
					/>
					<h2 className="font-semibold">{copy.properties.filters.heading}</h2>
				</div>
				<Button onClick={onClear} size="sm" type="button" variant="ghost">
					{copy.properties.filters.clear}
				</Button>
			</div>

			<div className="mt-5 space-y-5">
				<LocationFilter
					error={locationError}
					onChange={(value) => onFilterChange("location", value)}
					value={filters.location}
				/>

				<PropertyTypeFilter
					onChange={(value) => onFilterChange("propertyType", value)}
					value={filters.propertyType}
				/>

				<RangeFilter
					label={priceLabel}
					maximum={filters.maxPrice}
					minimum={filters.minPrice}
					onMaximumChange={(value) => onFilterChange("maxPrice", value)}
					onMinimumChange={(value) => onFilterChange("minPrice", value)}
					unit="€"
				/>
				<RangeFilter
					label={copy.properties.filters.livingArea}
					maximum={filters.maxLivingArea}
					minimum={filters.minLivingArea}
					onMaximumChange={(value) => onFilterChange("maxLivingArea", value)}
					onMinimumChange={(value) => onFilterChange("minLivingArea", value)}
					unit="m²"
				/>
				<RangeFilter
					label={copy.properties.filters.rooms}
					maximum={filters.maxRooms}
					minimum={filters.minRooms}
					onMaximumChange={(value) => onFilterChange("maxRooms", value)}
					onMinimumChange={(value) => onFilterChange("minRooms", value)}
				/>
				<BedroomsFilter
					onChange={(value) => onFilterChange("minBedrooms", value)}
					value={filters.minBedrooms}
				/>

				<FeaturesFilter
					features={features}
					onToggle={onToggleFeature}
					selectedFeatureIds={filters.featureIds}
				/>
			</div>

			<Button className="mt-6 w-full" onClick={onApply} size="lg" type="button">
				{copy.properties.filters.showResults}
			</Button>
		</div>
	);
}
