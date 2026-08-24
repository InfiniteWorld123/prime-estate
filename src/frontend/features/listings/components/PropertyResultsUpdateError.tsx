import { AlertCircle } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type PropertyResultsUpdateErrorProps = {
	onRetry: () => void;
};

export function PropertyResultsUpdateError({
	onRetry,
}: PropertyResultsUpdateErrorProps) {
	const { copy } = useLanguage();

	return (
		<div
			className="mt-5 flex flex-col gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
			aria-atomic="true"
			aria-live="polite"
		>
			<div className="flex items-start gap-3">
				<AlertCircle
					aria-hidden="true"
					className="mt-0.5 size-4 shrink-0 text-destructive"
				/>

				<p className="text-sm">{copy.properties.results.updateError}</p>
			</div>

			<Button onClick={onRetry} size="sm" type="button" variant="outline">
				{copy.properties.results.retry}
			</Button>
		</div>
	);
}
