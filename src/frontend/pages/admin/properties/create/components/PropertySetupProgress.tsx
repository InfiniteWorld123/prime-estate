import { Check, Images, ListPlus, MapPinned } from "lucide-react";

import { cn } from "@/frontend/lib/utils";
import type { CreatePropertyCopy } from "../create-property.copy";

export function PropertySetupProgress({ copy }: { copy: CreatePropertyCopy }) {
	const steps = [
		{
			icon: MapPinned,
			label: copy.progress.property,
			state: copy.progress.current,
		},
		{
			icon: Images,
			label: copy.progress.images,
			state: copy.progress.upcoming,
		},
		{
			icon: ListPlus,
			label: copy.progress.listing,
			state: copy.progress.upcoming,
		},
	];
	return (
		<ol
			aria-label={copy.title}
			className="grid overflow-hidden rounded-lg border bg-background sm:grid-cols-3"
		>
			{steps.map((step, index) => {
				const Icon = step.icon;
				const active = index === 0;
				return (
					<li
						className={cn(
							"relative flex items-center gap-3 p-4 sm:border-r sm:last:border-r-0",
							index > 0 && "border-t sm:border-t-0",
							active && "bg-primary/5",
						)}
						key={step.label}
					>
						<span
							className={cn(
								"grid size-9 place-items-center rounded-md border",
								active
									? "border-primary/30 bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground",
							)}
						>
							<Icon aria-hidden="true" className="size-4" />
						</span>
						<span>
							<span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
								{index + 1} · {step.state}
							</span>
							<span className="mt-1 block text-sm font-semibold">
								{step.label}
							</span>
						</span>
						{active ? (
							<Check
								aria-hidden="true"
								className="ml-auto size-4 text-primary"
							/>
						) : null}
					</li>
				);
			})}
		</ol>
	);
}
