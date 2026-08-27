import {
	CheckCircle2,
	CircleAlert,
	LoaderCircle,
	Plus,
	Search,
	Sparkles,
	X,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { usePropertyFeaturesSetupPage } from "@/frontend/hooks/pages/usePropertyFeaturesSetupPage";
import { cn } from "@/frontend/lib/utils";
import { PropertySetupJourney } from "../setup/PropertySetupJourney";

export function PropertyFeaturesSetupPage() {
	const page = usePropertyFeaturesSetupPage();
	if (page.isLoading) {
		return (
			<div className="grid min-h-[60vh] place-items-center px-4 py-10">
				<output className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
					<LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
					{page.copy.features.saving}
				</output>
			</div>
		);
	}
	if (page.loadError) {
		return (
			<div className="grid min-h-[60vh] place-items-center px-4 py-10 text-center">
				<div>
					<CircleAlert className="mx-auto size-6 text-destructive" />
					<p className="mt-3 font-heading text-lg font-semibold">
						{page.copy.common.loadError}
					</p>
					<p className="mt-1 text-sm text-muted-foreground">{page.loadError}</p>
					<Button className="mt-4" onClick={() => void page.refetch()}>
						{page.copy.common.retry}
					</Button>
				</div>
			</div>
		);
	}
	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<header className="max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
					{page.copy.common.administration}
				</p>
				<h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
					{page.copy.features.title}
				</h1>
				<p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
					{page.copy.features.description}
				</p>
			</header>
			<div className="mt-7">
				<PropertySetupJourney current="features" labels={page.copy.journey} />
			</div>

			<section className="mt-7 rounded-lg border bg-background p-4 sm:p-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="relative w-full max-w-xl">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							aria-label={page.copy.features.search}
							className="pl-9"
							onChange={(event) => page.setSearch(event.target.value)}
							placeholder={page.copy.features.search}
							value={page.search}
						/>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm font-medium">
							{page.copy.features.selected(page.selectedIds.size)}
						</span>
						{page.selectedIds.size > 0 ? (
							<Button onClick={page.clearSelection} size="sm" variant="ghost">
								<X />
								{page.copy.features.clear}
							</Button>
						) : null}
						<Button
							onClick={() => page.setCreateOpen(true)}
							size="sm"
							variant="outline"
						>
							<Plus />
							{page.copy.features.create}
						</Button>
					</div>
				</div>

				{page.catalog.length === 0 ? (
					<div className="mt-6 grid min-h-48 place-items-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
						{page.copy.features.empty}
					</div>
				) : page.filteredFeatures.length === 0 ? (
					<div className="mt-6 grid min-h-40 place-items-center rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
						{page.copy.features.noResults}
					</div>
				) : (
					<div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{page.filteredFeatures.map((feature) => {
							const selected = page.selectedIds.has(feature.id);
							const checkboxId = `property-feature-${feature.id}`;
							return (
								<div
									className={cn(
										"flex items-start gap-3 rounded-lg border p-4 transition-colors",
										selected
											? "border-primary/45 bg-primary/5"
											: "hover:bg-muted/30",
									)}
									key={feature.id}
								>
									<Checkbox
										checked={selected}
										id={checkboxId}
										onCheckedChange={() => page.toggleFeature(feature.id)}
									/>
									<label
										className="min-w-0 flex-1 cursor-pointer"
										htmlFor={checkboxId}
									>
										<span className="block font-medium">{feature.name}</span>
										<span className="mt-1 block font-mono text-xs text-muted-foreground">
											{feature.code}
										</span>
									</label>
								</div>
							);
						})}
					</div>
				)}
			</section>

			{page.saveSuccess ? (
				<output className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-600/20 bg-emerald-500/8 p-4 text-sm font-medium text-emerald-800 dark:text-emerald-300">
					<CheckCircle2 className="size-4" />
					{page.copy.features.success}
				</output>
			) : null}
			{page.saveError ? (
				<p className="mt-5 text-sm text-destructive" role="alert">
					{page.saveError}
				</p>
			) : null}

			<footer className="sticky bottom-3 z-10 mt-8 flex flex-col-reverse gap-3 rounded-lg border bg-background/95 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Button onClick={page.finishLater} type="button" variant="outline">
						{page.copy.common.finishLater}
					</Button>
					<p className="mt-1 text-xs text-muted-foreground">
						{page.copy.common.statusNotice}
					</p>
				</div>
				<Button
					disabled={page.isSaving}
					onClick={() => void page.saveAndContinue()}
					type="button"
				>
					{page.isSaving ? page.copy.features.saving : page.copy.features.save}
				</Button>
			</footer>

			<Dialog
				open={page.createOpen}
				onOpenChange={(open) => {
					page.setCreateOpen(open);
					if (!open) page.setCreateConflict(false);
				}}
			>
				<DialogContent>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							void page.createForm.handleSubmit();
						}}
					>
						<DialogHeader>
							<DialogTitle>{page.copy.features.createTitle}</DialogTitle>
							<DialogDescription>
								{page.copy.features.createDescription}
							</DialogDescription>
						</DialogHeader>
						<page.createForm.Field
							name="name"
							validators={{
								onDynamic: ({ value }) =>
									value.trim() ? undefined : page.copy.features.required,
							}}
						>
							{(field) => (
								<label
									className="mt-5 block space-y-2 text-sm font-medium"
									htmlFor="new-feature-name"
								>
									{page.copy.features.name}
									<Input
										aria-invalid={Boolean(
											field.state.meta.errors[0] || page.createConflict,
										)}
										id="new-feature-name"
										onBlur={field.handleBlur}
										onChange={(event) => {
											field.handleChange(event.target.value);
											page.setCreateConflict(false);
										}}
										value={field.state.value}
									/>
									{field.state.meta.errors[0] ? (
										<span className="block text-sm text-destructive">
											{field.state.meta.errors[0]}
										</span>
									) : null}
									{page.createConflict ? (
										<span className="block text-sm text-destructive">
											{page.copy.features.conflict}
										</span>
									) : null}
									{page.createError ? (
										<span className="block text-sm text-destructive">
											{page.createError}
										</span>
									) : null}
									<span className="block text-xs font-normal text-muted-foreground">
										{page.copy.features.codeHint}
									</span>
								</label>
							)}
						</page.createForm.Field>
						<DialogFooter className="mt-6">
							<Button
								onClick={() => page.setCreateOpen(false)}
								type="button"
								variant="outline"
							>
								{page.copy.features.cancel}
							</Button>
							<page.createForm.Subscribe
								selector={(state) => state.isSubmitting}
							>
								{(isSubmitting) => (
									<Button disabled={isSubmitting} type="submit">
										<Sparkles />
										{page.copy.features.createAction}
									</Button>
								)}
							</page.createForm.Subscribe>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				onOpenChange={(open) => !open && page.blocker.reset?.()}
				open={page.blocker.status === "blocked"}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{page.copy.common.leaveTitle}</DialogTitle>
						<DialogDescription>
							{page.copy.common.leaveDescription}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => page.blocker.reset?.()} variant="outline">
							{page.copy.common.stay}
						</Button>
						<Button
							onClick={() => page.blocker.proceed?.()}
							variant="destructive"
						>
							{page.copy.common.discard}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
