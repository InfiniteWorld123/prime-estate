import { useId } from "react";

import { Input } from "@/frontend/components/ui/input";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { cn } from "@/frontend/lib/utils";

type BedroomsFilterProps = {
	className?: string;
	value: string;
	onChange: (value: string) => void;
};

export function BedroomsFilter({
	className,
	value,
	onChange,
}: BedroomsFilterProps) {
	const { copy } = useLanguage();
	const bedroomsId = useId();

	return (
		<label
			className={cn("block border-t pt-5 text-sm font-semibold", className)}
			htmlFor={bedroomsId}
		>
			<span>{copy.properties.filters.bedrooms}</span>

			<Input
				className="mt-3 h-9"
				id={bedroomsId}
				min="0"
				onChange={(event) => onChange(event.target.value)}
				placeholder={copy.properties.filters.minimum}
				type="number"
				value={value}
			/>
		</label>
	);
}
