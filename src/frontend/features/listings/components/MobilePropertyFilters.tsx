import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/frontend/components/ui/accordion";
import { Button } from "@/frontend/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/frontend/components/ui/sheet";
import { BedroomsFilter } from "@/frontend/features/listings/components/filters/BedroomsFilter";
import { FeaturesFilter } from "@/frontend/features/listings/components/filters/FeaturesFilter";
import { LocationFilter } from "@/frontend/features/listings/components/filters/LocationFilter";
import { PropertyTypeFilter } from "@/frontend/features/listings/components/filters/PropertyTypeFilter";
import { RangeFilter } from "@/frontend/features/listings/components/filters/RangeFilter";
import type { PropertyFiltersProps } from "@/frontend/features/listings/components/PropertyFilters";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type MobilePropertyFiltersProps = PropertyFiltersProps & {
	activeFilterCount: number;
};

function FilterSummary({ value }: { value: string }) {
	if (!value) return null;

	return (
		<span className="ml-auto mr-2 max-w-32 truncate rounded-md bg-muted px-2 py-1 text-xs font-normal text-muted-foreground">
			{value}
		</span>
	);
}

export function MobilePropertyFilters({
	activeFilterCount,
	features,
	filters,
	locationError,
	onApply,
	onClear,
	onFilterChange,
	onToggleFeature,
}: MobilePropertyFiltersProps) {
	const { copy } = useLanguage();
	const [open, setOpen] = useState(false);

	const handleApply = () => {
		const applied = onApply();

		if (applied) {
			setOpen(false);
		}
	};
	const priceLabel =
		filters.listingType === "SALE"
			? copy.properties.filters.purchasePrice
			: filters.listingType === "RENT"
				? copy.properties.filters.monthlyRent
				: copy.properties.filters.price;

	const rangeSummary = (minimum: string, maximum: string, unit = "") => {
		const suffix = unit ? ` ${unit}` : "";

		if (minimum && maximum) {
			return `${minimum}–${maximum}${suffix}`;
		}

		if (minimum) {
			return `≥ ${minimum}${suffix}`;
		}

		if (maximum) {
			return `≤ ${maximum}${suffix}`;
		}

		return "";
	};

	const propertyTypeSummary =
		filters.propertyType === "APARTMENT"
			? copy.property.apartment
			: filters.propertyType === "HOUSE"
				? copy.property.house
				: "";

	const featuresSummary = filters.featureIds.length
		? copy.properties.filters.selected.replace(
				"{count}",
				String(filters.featureIds.length),
			)
		: "";

	return (
		<Sheet onOpenChange={setOpen} open={open}>
			<SheetTrigger asChild>
				<Button
					className="w-full justify-between lg:hidden"
					type="button"
					variant="outline"
				>
					<span className="inline-flex items-center gap-2">
						<SlidersHorizontal aria-hidden="true" />
						{copy.properties.filters.heading}
					</span>

					{activeFilterCount > 0 ? (
						<span className="grid size-6 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
							{activeFilterCount}
						</span>
					) : null}
				</Button>
			</SheetTrigger>

			<SheetContent
				className="flex h-full w-[92vw] flex-col overflow-hidden p-0 sm:max-w-md"
				side="left"
			>
				<SheetHeader className="border-b text-left">
					<SheetTitle>{copy.properties.filters.heading}</SheetTitle>
					<SheetDescription>{copy.properties.description}</SheetDescription>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto px-4">
					<Accordion type="multiple">
						<AccordionItem value="location">
							<AccordionTrigger>
								{copy.properties.filters.location}
								<FilterSummary value={filters.location} />
							</AccordionTrigger>
							<AccordionContent>
								<LocationFilter
									className="[&>span:first-child]:sr-only"
									error={locationError}
									onChange={(value) => onFilterChange("location", value)}
									value={filters.location}
								/>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="property-type">
							<AccordionTrigger>
								{copy.properties.filters.propertyType}
								<FilterSummary value={propertyTypeSummary} />
							</AccordionTrigger>
							<AccordionContent>
								<PropertyTypeFilter
									className="border-0 pt-0 [&>legend]:sr-only"
									onChange={(value) => onFilterChange("propertyType", value)}
									value={filters.propertyType}
								/>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="price">
							<AccordionTrigger>
								{priceLabel}
								<FilterSummary
									value={rangeSummary(filters.minPrice, filters.maxPrice, "€")}
								/>
							</AccordionTrigger>{" "}
							<AccordionContent>
								<RangeFilter
									className="border-0 pt-0 [&>legend]:sr-only"
									label={priceLabel}
									maximum={filters.maxPrice}
									minimum={filters.minPrice}
									onMaximumChange={(value) => onFilterChange("maxPrice", value)}
									onMinimumChange={(value) => onFilterChange("minPrice", value)}
									unit="€"
								/>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="living-area">
							<AccordionTrigger>
								{copy.properties.filters.livingArea}
								<FilterSummary
									value={rangeSummary(
										filters.minLivingArea,
										filters.maxLivingArea,
										"m²",
									)}
								/>
							</AccordionTrigger>
							<AccordionContent>
								<RangeFilter
									className="border-0 pt-0 [&>legend]:sr-only"
									label={copy.properties.filters.livingArea}
									maximum={filters.maxLivingArea}
									minimum={filters.minLivingArea}
									onMaximumChange={(value) =>
										onFilterChange("maxLivingArea", value)
									}
									onMinimumChange={(value) =>
										onFilterChange("minLivingArea", value)
									}
									unit="m²"
								/>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="rooms">
							<AccordionTrigger>
								{copy.properties.filters.rooms}
								<FilterSummary
									value={rangeSummary(filters.minRooms, filters.maxRooms)}
								/>
							</AccordionTrigger>
							<AccordionContent>
								<RangeFilter
									className="border-0 pt-0 [&>legend]:sr-only"
									label={copy.properties.filters.rooms}
									maximum={filters.maxRooms}
									minimum={filters.minRooms}
									onMaximumChange={(value) => onFilterChange("maxRooms", value)}
									onMinimumChange={(value) => onFilterChange("minRooms", value)}
								/>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="bedrooms">
							<AccordionTrigger>
								{copy.properties.filters.bedrooms}
								<FilterSummary
									value={filters.minBedrooms ? `≥ ${filters.minBedrooms}` : ""}
								/>
							</AccordionTrigger>
							<AccordionContent>
								<BedroomsFilter
									className="border-0 pt-0 [&>span:first-child]:sr-only"
									onChange={(value) => onFilterChange("minBedrooms", value)}
									value={filters.minBedrooms}
								/>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="features">
							<AccordionTrigger>
								{copy.properties.filters.features}
								<FilterSummary value={featuresSummary} />
							</AccordionTrigger>
							<AccordionContent>
								<FeaturesFilter
									className="border-0 pt-0 [&>legend]:sr-only"
									features={features}
									onToggle={onToggleFeature}
									selectedFeatureIds={filters.featureIds}
								/>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>

				<div className="grid grid-cols-[auto_1fr] gap-2 border-t bg-background p-4">
					<Button onClick={onClear} type="button" variant="outline">
						{copy.properties.filters.clear}
					</Button>

					<Button onClick={handleApply} type="button">
						{copy.properties.filters.showResults}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
