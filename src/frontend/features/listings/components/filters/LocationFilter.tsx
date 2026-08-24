import { useId } from "react";
import { Input } from "@/frontend/components/ui/input";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { cn } from "@/frontend/lib/utils";

type LocationFilterProps = {
	error: string;
	value: string;
	className?: string;
	onChange: (value: string) => void;
};

export function LocationFilter({
	className,
	error,
	value,
	onChange,
}: LocationFilterProps) {
	const { copy } = useLanguage();
	const locationId = useId();

	return (
		<label
			className={cn("block space-y-2 text-sm font-semibold", className)}
			htmlFor={locationId}
		>
			<span>{copy.properties.filters.location}</span>

			<Input
				aria-invalid={Boolean(error)}
				id={locationId}
				onChange={(event) => onChange(event.target.value)}
				placeholder={copy.properties.filters.locationPlaceholder}
				value={value}
			/>

			{error ? (
				<span className="block text-xs font-normal text-destructive">
					{error}
				</span>
			) : null}
		</label>
	);
}
