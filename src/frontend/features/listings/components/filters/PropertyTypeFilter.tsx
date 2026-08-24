import { Button } from "@/frontend/components/ui/button";
import type { PropertyTypeFilter as PropertyTypeValue } from "@/frontend/hooks/pages/usePropertiesPage";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { cn } from "@/frontend/lib/utils";

type PropertyTypeFilterProps = {
	className?: string;
	value: PropertyTypeValue;
	onChange: (value: PropertyTypeValue) => void;
};

export function PropertyTypeFilter({
	className,
	value,
	onChange,
}: PropertyTypeFilterProps) {
	const { copy } = useLanguage();

	const propertyTypes: Array<{
		label: string;
		value: Exclude<PropertyTypeValue, "ALL">;
	}> = [
		{ label: copy.property.apartment, value: "APARTMENT" },
		{ label: copy.property.house, value: "HOUSE" },
	];

	return (
		<fieldset className={cn("border-t pt-5", className)}>
			<legend className="text-sm font-semibold">
				{copy.properties.filters.propertyType}
			</legend>

			<div className="mt-3 grid grid-cols-2 gap-2">
				{propertyTypes.map((type) => {
					const selected = value === type.value;

					return (
						<Button
							aria-pressed={selected}
							key={type.value}
							onClick={() => onChange(selected ? "ALL" : type.value)}
							type="button"
							variant={selected ? "default" : "outline"}
						>
							{type.label}
						</Button>
					);
				})}
			</div>
		</fieldset>
	);
}
