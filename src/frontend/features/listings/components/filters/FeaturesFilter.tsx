import { ChevronDown, ChevronUp } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import type { PropertyFeatureOption } from "@/frontend/features/listings/listing.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { cn } from "@/frontend/lib/utils";

type FeaturesFilterProps = {
	className?: string;
	features: PropertyFeatureOption[];
	selectedFeatureIds: string[];
	onToggle: (featureId: string) => void;
};

export function FeaturesFilter({
	className,
	features,
	selectedFeatureIds,
	onToggle,
}: FeaturesFilterProps) {
	const { copy, language } = useLanguage();
	const fieldId = useId();
	const [showAllFeatures, setShowAllFeatures] = useState(false);

	const displayedFeatures = showAllFeatures ? features : features.slice(0, 5);

	return (
		<fieldset className={cn("border-t pt-5", className)}>
			<legend className="text-sm font-semibold">
				{copy.properties.filters.features}
			</legend>

			<div className="mt-3 space-y-3">
				{displayedFeatures.map((feature) => {
					const checkboxId = `${fieldId}-${feature.id}`;
					return (
						<label
							className="flex cursor-pointer items-center gap-3 text-sm"
							htmlFor={checkboxId}
							key={feature.id}
						>
							<Checkbox
								checked={selectedFeatureIds.includes(feature.id)}
								id={checkboxId}
								onCheckedChange={() => onToggle(feature.id)}
							/>

							<span>{feature.label[language]}</span>
						</label>
					);
				})}
			</div>

			{features.length > 5 ? (
				<Button
					className="mt-3 px-0"
					onClick={() => setShowAllFeatures((current) => !current)}
					size="sm"
					type="button"
					variant="link"
				>
					{showAllFeatures
						? copy.properties.filters.showLess
						: copy.properties.filters.showMore}

					{showAllFeatures ? <ChevronUp /> : <ChevronDown />}
				</Button>
			) : null}
		</fieldset>
	);
}
