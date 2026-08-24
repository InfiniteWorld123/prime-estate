import { SearchX } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type PropertyResultsEmptyProps = {
	onReset: () => void;
};

export function PropertyResultsEmpty({ onReset }: PropertyResultsEmptyProps) {
	const { copy } = useLanguage();

	return (
		<div className="mt-6 grid min-h-80 place-items-center rounded-lg border border-dashed bg-muted/25 px-6 py-12 text-center">
			<div className="max-w-md">
				<span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
					<SearchX aria-hidden="true" className="size-5" />
				</span>

				<h3 className="mt-5 text-xl font-semibold tracking-tight">
					{copy.properties.results.emptyHeading}
				</h3>

				<p className="mt-2 text-sm leading-6 text-muted-foreground">
					{copy.properties.results.emptyDescription}
				</p>

				<Button className="mt-6" onClick={onReset} type="button">
					{copy.properties.results.resetFilters}
				</Button>
			</div>
		</div>
	);
}
