import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import type { PropertyDetailsPreviewState as PreviewState } from "@/frontend/features/listings/listing.types";

type PropertyDetailsPreviewProps = {
	onStateChange: (state: PreviewState) => void;
	state: PreviewState;
};

export function PropertyDetailsPreview({
	onStateChange,
	state,
}: PropertyDetailsPreviewProps) {
	if (!import.meta.env.DEV) return null;

	return (
		<div className="fixed right-4 bottom-4 z-40 rounded-lg border bg-background p-3 shadow-lg">
			<p className="mb-2 text-xs font-semibold text-muted-foreground">
				Mock detail state
			</p>
			<Select
				onValueChange={(value) => onStateChange(value as PreviewState)}
				value={state}
			>
				<SelectTrigger className="w-52">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ready">Ready</SelectItem>
					<SelectItem value="loading">Loading</SelectItem>
					<SelectItem value="error">Full error</SelectItem>
					<SelectItem value="not-found">Not found</SelectItem>
					<SelectItem value="background-error">Background error</SelectItem>
					<SelectItem value="missing-image">Missing image</SelectItem>
					<SelectItem value="all-images-missing">All images missing</SelectItem>
					<SelectItem value="sold">Sold</SelectItem>
					<SelectItem value="rented">Rented</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
