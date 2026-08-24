import { Check, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { cn } from "@/frontend/lib/utils";

type AuthTextFieldProps = {
	autoComplete?: string;
	error?: unknown;
	id: string;
	inputMode?: "email" | "numeric" | "text";
	label: string;
	maxLength?: number;
	onBlur: () => void;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: string;
	value: string;
};

export function AuthTextField({
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
	value,
}: AuthTextFieldProps) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				aria-describedby={error ? `${id}-error` : undefined}
				aria-invalid={Boolean(error)}
				autoComplete={autoComplete}
				className="h-11"
				id={id}
				inputMode={inputMode}
				maxLength={maxLength}
				onBlur={onBlur}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				type={type}
				value={value}
			/>
			{error ? (
				<AuthFieldError id={`${id}-error`} message={String(error)} />
			) : null}
		</div>
	);
}

type PasswordFieldProps = Omit<AuthTextFieldProps, "type" | "inputMode"> & {
	hideLabel: string;
	showLabel: string;
};

export function PasswordField({
	error,
	hideLabel,
	id,
	label,
	onBlur,
	onChange,
	placeholder,
	showLabel,
	value,
	...props
}: PasswordFieldProps) {
	const [visible, setVisible] = useState(false);
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<div className="relative">
				<Input
					{...props}
					aria-describedby={error ? `${id}-error` : undefined}
					aria-invalid={Boolean(error)}
					autoComplete={props.autoComplete}
					className="h-11 pr-11"
					id={id}
					onBlur={onBlur}
					onChange={(event) => onChange(event.target.value)}
					placeholder={placeholder}
					type={visible ? "text" : "password"}
					value={value}
				/>
				<button
					aria-label={visible ? hideLabel : showLabel}
					className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
					onClick={() => setVisible((current) => !current)}
					type="button"
				>
					{visible ? (
						<EyeOff aria-hidden="true" className="size-4" />
					) : (
						<Eye aria-hidden="true" className="size-4" />
					)}
				</button>
			</div>
			{error ? (
				<AuthFieldError id={`${id}-error`} message={String(error)} />
			) : null}
		</div>
	);
}

export function AuthFieldError({
	id,
	message,
}: {
	id: string;
	message: string;
}) {
	return (
		<p className="text-sm text-destructive" id={id}>
			{message}
		</p>
	);
}

export function AuthSubmitButton({
	idleLabel,
	isSubmitting,
	pendingLabel,
}: {
	idleLabel: string;
	isSubmitting: boolean;
	pendingLabel: string;
}) {
	return (
		<Button className="h-11 w-full" disabled={isSubmitting} type="submit">
			{isSubmitting ? (
				<LoaderCircle
					aria-hidden="true"
					className="animate-spin motion-reduce:animate-none"
				/>
			) : null}
			{isSubmitting ? pendingLabel : idleLabel}
		</Button>
	);
}

export function PasswordRequirements({
	checks,
	labels,
}: {
	checks: boolean[];
	labels: readonly string[];
}) {
	return (
		<ul className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
			{labels.map((label, index) => (
				<li
					className={cn(
						"flex items-center gap-2",
						checks[index] && "text-foreground",
					)}
					key={label}
				>
					<span
						className={cn(
							"grid size-4 place-items-center rounded-full border",
							checks[index] &&
								"border-primary bg-primary text-primary-foreground",
						)}
					>
						<Check aria-hidden="true" className="size-2.5" />
					</span>
					{label}
				</li>
			))}
		</ul>
	);
}
