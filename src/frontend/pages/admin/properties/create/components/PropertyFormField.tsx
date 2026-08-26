import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";

type PropertyFormFieldProps = {
	autoComplete?: string;
	error?: unknown;
	id: string;
	inputMode?: "decimal" | "numeric" | "text";
	label: string;
	maxLength?: number;
	onBlur: () => void;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: string;
	unit?: string;
	value: string;
};

export function PropertyFormField({
	autoComplete,
	error,
	id,
	inputMode,
	label,
	maxLength,
	onBlur,
	onChange,
	placeholder,
	type = "text",
	unit,
	value,
}: PropertyFormFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<div className="relative">
				<Input
					aria-describedby={error ? `${id}-error` : undefined}
					aria-invalid={Boolean(error)}
					autoComplete={autoComplete}
					className={unit ? "h-10 pr-12" : "h-10"}
					id={id}
					inputMode={inputMode}
					maxLength={maxLength}
					onBlur={onBlur}
					onChange={(event) => onChange(event.target.value)}
					placeholder={placeholder}
					type={type}
					value={value}
				/>
				{unit ? (
					<span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-xs font-medium text-muted-foreground">
						{unit}
					</span>
				) : null}
			</div>
			{error ? (
				<p className="text-sm text-destructive" id={`${id}-error`}>
					{String(error)}
				</p>
			) : null}
		</div>
	);
}
