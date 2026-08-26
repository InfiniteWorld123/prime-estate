import { Check, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/frontend/components/ui/button";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { cn } from "@/frontend/lib/utils";
import type { AdminListingDetailsCopy } from "../admin-listing-details.copy";
import {
	createFeatureCode,
	hasFeatureName,
} from "../admin-listing-media.model";

type PropertyFeature = { code?: string; id: string; name: string };

const defaultFeatures: PropertyFeature[] = [
	{ code: "BALCONY", id: "feature-balcony", name: "Balcony" },
	{ code: "GARDEN", id: "feature-garden", name: "Garden" },
	{ code: "ELEVATOR", id: "feature-elevator", name: "Elevator" },
	{ code: "PARKING", id: "feature-parking", name: "Parking space" },
	{ code: "FITTED_KITCHEN", id: "feature-kitchen", name: "Fitted kitchen" },
	{ code: "BASEMENT", id: "feature-basement", name: "Basement" },
	{ code: "ACCESSIBLE", id: "feature-accessible", name: "Accessible" },
	{ code: "GUEST_WC", id: "feature-guest-wc", name: "Guest WC" },
];

type PropertyFeaturesDialogProps = {
	copy: AdminListingDetailsCopy;
	features: Array<{ id: string; name: string }>;
	onSave: (features: Array<{ id: string; name: string }>) => void;
	trigger: React.ReactNode;
};

function mergeCatalog(features: Array<{ id: string; name: string }>) {
	const catalog = [...defaultFeatures];
	for (const feature of features) {
		if (!catalog.some((item) => item.id === feature.id)) catalog.push(feature);
	}
	return catalog;
}

export function PropertyFeaturesDialog({
	copy,
	features,
	onSave,
	trigger,
}: PropertyFeaturesDialogProps) {
	const [open, setOpen] = useState(false);
	const [catalog, setCatalog] = useState<PropertyFeature[]>([]);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [search, setSearch] = useState("");
	const [newFeatureName, setNewFeatureName] = useState("");
	const [createError, setCreateError] = useState("");

	const selectedFeatures = catalog.filter((feature) =>
		selectedIds.has(feature.id),
	);
	const filteredFeatures = useMemo(() => {
		const query = search.trim().toLocaleLowerCase();
		if (!query) return catalog;
		return catalog.filter((feature) =>
			`${feature.name} ${feature.code ?? ""}`
				.toLocaleLowerCase()
				.includes(query),
		);
	}, [catalog, search]);
	const originalIds = features
		.map((feature) => feature.id)
		.sort()
		.join("|");
	const selectedKey = [...selectedIds].sort().join("|");
	const isDirty = originalIds !== selectedKey;

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			setCatalog(mergeCatalog(features));
			setSelectedIds(new Set(features.map((feature) => feature.id)));
			setSearch("");
			setNewFeatureName("");
			setCreateError("");
		}
		setOpen(nextOpen);
	};

	const toggleFeature = (id: string) =>
		setSelectedIds((current) => {
			const next = new Set(current);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	const createFeature = () => {
		const name = newFeatureName.trim();
		if (!name) {
			setCreateError(copy.featureManager.required);
			return;
		}
		if (hasFeatureName(catalog, name)) {
			setCreateError(copy.featureManager.duplicate);
			return;
		}
		const feature = {
			code: createFeatureCode(name),
			id: `feature-${crypto.randomUUID()}`,
			name,
		};
		setCatalog((current) => [...current, feature]);
		setSelectedIds((current) => new Set([...current, feature.id]));
		setNewFeatureName("");
		setCreateError("");
	};

	const save = () => {
		onSave(
			catalog
				.filter((feature) => selectedIds.has(feature.id))
				.map(({ id, name }) => ({ id, name })),
		);
		setOpen(false);
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
				<DialogHeader className="shrink-0 p-4 pr-12 sm:p-6 sm:pr-14">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div className="max-w-xl">
							<DialogTitle>{copy.featureManager.title}</DialogTitle>
							<DialogDescription className="mt-2 leading-6">
								{copy.featureManager.description}
							</DialogDescription>
						</div>
						<span className="rounded-md border bg-muted/35 px-2.5 py-1 font-mono text-xs font-semibold text-muted-foreground">
							{copy.featureManager.selected(selectedIds.size)}
						</span>
					</div>
				</DialogHeader>

				<div className="min-h-0 flex-1 space-y-6 overflow-y-auto border-y px-4 py-5 sm:px-6">
					<section aria-labelledby="selected-features-title">
						<div className="flex items-center justify-between gap-3">
							<h3
								className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
								id="selected-features-title"
							>
								{copy.featureManager.selectedTitle}
							</h3>
							{selectedFeatures.length > 0 ? (
								<Button
									onClick={() => setSelectedIds(new Set())}
									size="sm"
									type="button"
									variant="ghost"
								>
									{copy.featureManager.clear}
								</Button>
							) : null}
						</div>
						{selectedFeatures.length > 0 ? (
							<div className="mt-3 flex flex-wrap gap-2">
								{selectedFeatures.map((feature) => (
									<span
										className="inline-flex items-center gap-1 rounded-full border bg-primary/5 py-1 pl-3 pr-1 text-sm"
										key={feature.id}
									>
										{feature.name}
										<button
											aria-label={`${copy.featureManager.remove}: ${feature.name}`}
											className="grid size-6 place-items-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
											onClick={() => toggleFeature(feature.id)}
											type="button"
										>
											<X aria-hidden="true" className="size-3.5" />
										</button>
									</span>
								))}
							</div>
						) : (
							<p className="mt-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
								{copy.featureManager.empty}
							</p>
						)}
					</section>

					<section
						className="rounded-lg border bg-muted/15 p-4"
						aria-labelledby="create-feature-title"
					>
						<h3 className="font-medium" id="create-feature-title">
							{copy.featureManager.createTitle}
						</h3>
						<p className="mt-1 text-xs leading-5 text-muted-foreground">
							{copy.featureManager.createDescription}
						</p>
						<div className="mt-3 flex flex-col gap-2 sm:flex-row">
							<div className="min-w-0 flex-1">
								<label className="sr-only" htmlFor="new-property-feature">
									{copy.featureManager.name}
								</label>
								<Input
									aria-invalid={Boolean(createError)}
									id="new-property-feature"
									onChange={(event) => {
										setNewFeatureName(event.target.value);
										setCreateError("");
									}}
									onKeyDown={(event) => {
										if (event.key === "Enter") {
											event.preventDefault();
											createFeature();
										}
									}}
									placeholder={copy.featureManager.namePlaceholder}
									value={newFeatureName}
								/>
								{createError ? (
									<p className="mt-1.5 text-xs text-destructive">
										{createError}
									</p>
								) : null}
							</div>
							<Button onClick={createFeature} type="button" variant="outline">
								<Plus />
								{copy.featureManager.create}
							</Button>
						</div>
					</section>

					<section aria-labelledby="available-features-title">
						<h3
							className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
							id="available-features-title"
						>
							{copy.featureManager.available}
						</h3>
						<div className="relative mt-3">
							<Search
								aria-hidden="true"
								className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								aria-label={copy.featureManager.search}
								className="pl-9"
								onChange={(event) => setSearch(event.target.value)}
								placeholder={copy.featureManager.search}
								value={search}
							/>
						</div>
						{filteredFeatures.length > 0 ? (
							<div className="mt-3 grid gap-2 sm:grid-cols-2">
								{filteredFeatures.map((feature) => {
									const selected = selectedIds.has(feature.id);
									const checkboxId = `listing-feature-${feature.id}`;
									return (
										<label
											className={cn(
												"flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
												selected
													? "border-primary/45 bg-primary/5"
													: "hover:bg-muted/30",
											)}
											htmlFor={checkboxId}
											key={feature.id}
										>
											<Checkbox
												checked={selected}
												id={checkboxId}
												onCheckedChange={() => toggleFeature(feature.id)}
											/>
											<span className="min-w-0 flex-1">
												<span className="block font-medium">
													{feature.name}
												</span>
												{feature.code ? (
													<span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
														{feature.code}
													</span>
												) : null}
											</span>
											{selected ? (
												<Check
													aria-hidden="true"
													className="size-4 text-primary"
												/>
											) : null}
										</label>
									);
								})}
							</div>
						) : (
							<p className="mt-3 rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
								{copy.featureManager.noResults}
							</p>
						)}
					</section>
				</div>

				<DialogFooter className="mx-0 mb-0 shrink-0 rounded-none px-4 py-3 sm:px-6">
					<Button
						onClick={() => handleOpenChange(false)}
						type="button"
						variant="outline"
					>
						{copy.cancel}
					</Button>
					<Button disabled={!isDirty} onClick={save} type="button">
						{copy.featureManager.save}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
