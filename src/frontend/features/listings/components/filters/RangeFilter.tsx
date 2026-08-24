import { useId } from "react";

import { Input } from "@/frontend/components/ui/input";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { cn } from "@/frontend/lib/utils";

type RangeFilterProps = {
	className?: string;
	label: string;
	maximum: string;
	minimum: string;
	unit?: string;
	onMaximumChange: (value: string) => void;
	onMinimumChange: (value: string) => void;
};

export function RangeFilter({
	className,
	label,
	maximum,
	minimum,
	unit,
	onMaximumChange,
	onMinimumChange,
}: RangeFilterProps) {
	const { copy } = useLanguage();
	const fieldId = useId();
	const minimumId = `${fieldId}-minimum`;
	const maximumId = `${fieldId}-maximum`;

	return (
		<fieldset className={cn("border-t pt-5", className)}>
			<legend className="text-sm font-semibold">{label}</legend>

			<div className="mt-3 grid grid-cols-2 gap-2">
				<label
					className="space-y-1.5 text-xs text-muted-foreground"
					htmlFor={minimumId}
				>
					<span>{copy.properties.filters.minimum}</span>

					<div className="relative">
						<Input
							className={cn("h-9", unit && "pr-9")}
							id={minimumId}
							min="0"
							onChange={(event) => onMinimumChange(event.target.value)}
							placeholder="0"
							type="number"
							value={minimum}
						/>

						{unit ? (
							<span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs">
								{unit}
							</span>
						) : null}
					</div>
				</label>

				<label
					className="space-y-1.5 text-xs text-muted-foreground"
					htmlFor={maximumId}
				>
					<span>{copy.properties.filters.maximum}</span>

					<div className="relative">
						<Input
							className={cn("h-9", unit && "pr-9")}
							id={maximumId}
							min="0"
							onChange={(event) => onMaximumChange(event.target.value)}
							placeholder={copy.properties.filters.any}
							type="number"
							value={maximum}
						/>

						{unit ? (
							<span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs">
								{unit}
							</span>
						) : null}
					</div>
				</label>
			</div>
		</fieldset>
	);
}
