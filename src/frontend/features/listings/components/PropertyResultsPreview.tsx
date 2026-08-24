import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import type { PropertyResultsPreviewState } from "@/frontend/hooks/pages/usePropertiesPage";

type PropertyResultsPreviewProps = {
	state: PropertyResultsPreviewState;
	onStateChange: (state: PropertyResultsPreviewState) => void;
};

export function PropertyResultsPreview({
	state,
	onStateChange,
}: PropertyResultsPreviewProps) {
	if (!import.meta.env.DEV) return null;

	return (
		<div className="fixed right-4 bottom-4 z-50 rounded-lg border bg-background p-3 shadow-lg">
			<p className="mb-2 text-xs font-semibold text-muted-foreground">
				Mock result state
			</p>

			<Select
				onValueChange={(value) =>
					onStateChange(value as PropertyResultsPreviewState)
				}
				value={state}
			>
				<SelectTrigger className="w-48">
					<SelectValue />
				</SelectTrigger>

				<SelectContent>
					<SelectItem value="ready">Ready</SelectItem>
					<SelectItem value="error">Full error</SelectItem>
					<SelectItem value="refreshing">Refreshing</SelectItem>
					<SelectItem value="background-error">Background error</SelectItem>
					<SelectItem value="missing-image">Missing image</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
