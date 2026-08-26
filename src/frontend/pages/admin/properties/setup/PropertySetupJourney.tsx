import { Check, ImageIcon, ListPlus, MapPinned, Sparkles } from "lucide-react";

import { cn } from "@/frontend/lib/utils";

type SetupStage = "property" | "images" | "features" | "listing";

type PropertySetupJourneyProps = {
	current: SetupStage;
	labels: {
		complete: string;
		current: string;
		features: string;
		images: string;
		listing: string;
		property: string;
		upcoming: string;
	};
};

const stages: Array<{ icon: typeof MapPinned; key: SetupStage }> = [
	{ icon: MapPinned, key: "property" },
	{ icon: ImageIcon, key: "images" },
	{ icon: Sparkles, key: "features" },
	{ icon: ListPlus, key: "listing" },
];

export function PropertySetupJourney({
	current,
	labels,
}: PropertySetupJourneyProps) {
	const currentIndex = stages.findIndex((stage) => stage.key === current);
	return (
		<ol
			aria-label={labels[current]}
			className="grid overflow-hidden rounded-lg border bg-background sm:grid-cols-2 xl:grid-cols-4"
		>
			{stages.map((stage, index) => {
				const Icon = stage.icon;
				const isComplete = index < currentIndex;
				const isCurrent = index === currentIndex;
				const state = isComplete
					? labels.complete
					: isCurrent
						? labels.current
						: labels.upcoming;
				return (
					<li
						className={cn(
							"relative flex items-center gap-3 border-t p-4 first:border-t-0 sm:[&:nth-child(2)]:border-t-0 xl:border-t-0 xl:border-r xl:last:border-r-0",
							isCurrent && "bg-primary/5",
						)}
						key={stage.key}
					>
						<span
							className={cn(
								"grid size-9 shrink-0 place-items-center rounded-md border",
								isCurrent &&
									"border-primary/30 bg-primary text-primary-foreground",
								isComplete && "border-primary/20 bg-primary/10 text-primary",
								!isCurrent && !isComplete && "bg-muted text-muted-foreground",
							)}
						>
							{isComplete ? (
								<Check aria-hidden="true" className="size-4" />
							) : (
								<Icon aria-hidden="true" className="size-4" />
							)}
						</span>
						<span className="min-w-0">
							<span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
								{index + 1} · {state}
							</span>
							<span className="mt-1 block truncate text-sm font-semibold">
								{labels[stage.key]}
							</span>
						</span>
					</li>
				);
			})}
		</ol>
	);
}
