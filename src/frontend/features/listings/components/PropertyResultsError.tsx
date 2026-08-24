import { AlertTriangle } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type PropertyResultsErrorProps = {
	onRetry: () => void;
};

export function PropertyResultsError({ onRetry }: PropertyResultsErrorProps) {
	const { copy } = useLanguage();

	return (
		<div
			className="mt-6 grid min-h-80 place-items-center rounded-lg border border-destructive/25 bg-destructive/5 px-6 py-12 text-center"
			role="alert"
		>
			<div className="max-w-md">
				<span className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
					<AlertTriangle aria-hidden="true" className="size-5" />
				</span>

				<h3 className="mt-5 text-xl font-semibold tracking-tight">
					{copy.properties.results.errorHeading}
				</h3>

				<p className="mt-2 text-sm leading-6 text-muted-foreground">
					{copy.properties.results.errorDescription}
				</p>

				<Button className="mt-6" onClick={onRetry} type="button">
					{copy.properties.results.retry}
				</Button>
			</div>
		</div>
	);
}
