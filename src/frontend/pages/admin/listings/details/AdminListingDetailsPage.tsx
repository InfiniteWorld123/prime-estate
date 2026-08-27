import { Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	ArrowLeft,
	Check,
	ExternalLink,
	FileText,
	LoaderCircle,
	Save,
} from "lucide-react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/frontend/components/ui/accordion";
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
import { Label } from "@/frontend/components/ui/label";
import { Textarea } from "@/frontend/components/ui/textarea";
import type { AdminListingDetailRecord } from "@/frontend/features/listings/admin-listing.types";
import { ListingMetadataPreview } from "@/frontend/features/listings/components/ListingMetadataPreview";
import {
	createListingSlug,
	createSeoDescription,
} from "@/frontend/features/listings/listing-slug";
import { useAdminListingDetailsPage } from "@/frontend/hooks/pages/useAdminListingDetailsPage";
import { ListingWorkspaceSkeleton } from "../components/AdminListingSkeletons";
import { AdminListingLifecyclePanel } from "./components/AdminListingLifecyclePanel";
import { AdminListingMediaPanel } from "./components/AdminListingMediaPanel";

function formatPrice(listing: AdminListingDetailRecord) {
	if (listing.priceAmount === null) return "—";
	return new Intl.NumberFormat("de-DE", {
		currency: "EUR",
		maximumFractionDigits: 0,
		style: "currency",
	}).format(listing.priceAmount);
}

function ArchivedContent({
	copy,
	listing,
}: {
	copy: ReturnType<typeof useAdminListingDetailsPage>["copy"];
	listing: AdminListingDetailRecord;
}) {
	const values = [
		[copy.listingType, listing.listingType === "SALE" ? copy.sale : copy.rent],
		[
			listing.listingType === "SALE" ? copy.priceSale : copy.priceRent,
			formatPrice(listing),
		],
		[copy.title, listing.title ?? "—"],
		[copy.description, listing.description ?? "—"],
		[copy.slug, listing.slug ?? "—"],
		[copy.seoTitle, listing.seoTitle ?? copy.automatic],
		[copy.seoDescription, listing.seoDescription ?? copy.automatic],
		[
			copy.exactAddress,
			listing.showExactAddress
				? copy.exactAddressVisible
				: copy.exactAddressHidden,
		],
	] as const;

	return (
		<section className="rounded-lg border bg-background p-4 sm:p-6">
			<h2 className="font-heading text-lg font-semibold">{copy.content}</h2>
			<dl className="mt-5 divide-y">
				{values.map(([label, value]) => (
					<div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr]" key={label}>
						<dt className="text-sm font-medium text-muted-foreground">
							{label}
						</dt>
						<dd className="whitespace-pre-wrap text-sm leading-6">{value}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}

export function AdminListingDetailsPage() {
	const page = useAdminListingDetailsPage();
	const listing = page.listing;

	if (page.isLoading) {
		return <ListingWorkspaceSkeleton label={page.copy.loading} />;
	}

	if (page.loadError && !page.isNotFound) {
		return (
			<div className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-10 text-center">
				<div className="max-w-md rounded-lg border border-destructive/25 bg-destructive/5 p-6">
					<AlertTriangle className="mx-auto size-8 text-destructive" />
					<h1 className="mt-4 font-heading text-2xl font-semibold">
						{page.copy.loadError}
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">{page.loadError}</p>
					<Button className="mt-5" onClick={() => void page.refetch()}>
						{page.copy.retry}
					</Button>
				</div>
			</div>
		);
	}

	if (!listing) {
		return (
			<div className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-10 text-center">
				<div>
					<FileText className="mx-auto size-9 text-muted-foreground" />
					<h1 className="mt-4 font-heading text-2xl font-semibold">
						{page.copy.notFound}
					</h1>
					<Button asChild className="mt-5">
						<Link to="/admin/listings">{page.copy.back}</Link>
					</Button>
				</div>
			</div>
		);
	}

	const editable = listing.status !== "ARCHIVED";
	const publicUrl = `/properties/${listing.slug ?? "…"}`;

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<header>
				<Button asChild size="sm" variant="ghost">
					<Link to="/admin/listings">
						<ArrowLeft />
						{page.copy.back}
					</Link>
				</Button>
				<div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="max-w-3xl">
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
							{page.copy.administration} · {listing.property.referenceNumber}
						</p>
						<h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
							{listing.title ?? page.copy.draft}
						</h1>
						<p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
							{page.copy.subtitle}
						</p>
					</div>
					<Button asChild variant="outline">
						<Link
							params={{ propertyId: listing.property.id }}
							search={{ edit: undefined }}
							to="/admin/properties/$propertyId"
						>
							{page.copy.openProperty}
							<ExternalLink />
						</Link>
					</Button>
				</div>
			</header>

			<div className="mt-5 min-h-6" aria-live="polite">
				{page.feedback ? (
					<p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
						<Check className="size-4" />
						{page.feedback}
					</p>
				) : null}
				{page.operationError ? (
					<p className="text-sm font-medium text-destructive" role="alert">
						{page.operationError}
					</p>
				) : null}
			</div>

			<form
				className="mt-3 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
				onSubmit={(event) => {
					event.preventDefault();
					void page.form.handleSubmit();
				}}
			>
				<div className="space-y-6">
					{editable ? (
						<section className="rounded-lg border bg-background p-4 sm:p-6">
							<div className="flex items-center justify-between gap-4">
								<h2 className="font-heading text-lg font-semibold">
									{page.copy.content}
								</h2>
								<span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
									{listing.listingType === "SALE"
										? page.copy.sale
										: page.copy.rent}
								</span>
							</div>

							<div className="mt-6 grid gap-5">
								<page.form.Field
									name="price"
									validators={{
										onDynamic: ({ value }) => {
											if (!value.trim())
												return listing.status === "PUBLISHED"
													? page.copy.blockers.price
													: undefined;
											return Number(value) > 0
												? undefined
												: page.copy.blockers.price;
										},
									}}
								>
									{(field) => (
										<div className="space-y-2">
											<Label htmlFor="listing-details-price">
												{listing.listingType === "SALE"
													? page.copy.priceSale
													: page.copy.priceRent}
											</Label>
											<div className="relative">
												<Input
													aria-invalid={Boolean(field.state.meta.errors[0])}
													className="pr-14"
													id="listing-details-price"
													inputMode="decimal"
													onBlur={field.handleBlur}
													onChange={(event) => {
														field.handleChange(event.target.value);
														page.markDirty();
													}}
													value={field.state.value}
												/>
												<span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-xs font-semibold text-muted-foreground">
													EUR
												</span>
											</div>
											{field.state.meta.errors[0] ? (
												<p className="text-sm text-destructive">
													{field.state.meta.errors[0]}
												</p>
											) : null}
										</div>
									)}
								</page.form.Field>
								{(["title", "description"] as const).map((name) => (
									<page.form.Field
										key={name}
										name={name}
										validators={{
											onDynamic: ({ value }) =>
												listing.status === "PUBLISHED" && !value.trim()
													? page.copy.blockers[name]
													: undefined,
										}}
									>
										{(field) => (
											<div className="space-y-2">
												<Label htmlFor={`listing-details-${name}`}>
													{name === "title"
														? page.copy.title
														: page.copy.description}
												</Label>
												{name === "title" ? (
													<Input
														aria-invalid={Boolean(field.state.meta.errors[0])}
														id={`listing-details-${name}`}
														onBlur={field.handleBlur}
														onChange={(event) => {
															field.handleChange(event.target.value);
															page.markDirty();
														}}
														value={field.state.value}
													/>
												) : (
													<Textarea
														aria-invalid={Boolean(field.state.meta.errors[0])}
														id={`listing-details-${name}`}
														onBlur={field.handleBlur}
														onChange={(event) => {
															field.handleChange(event.target.value);
															page.markDirty();
														}}
														rows={8}
														value={field.state.value}
													/>
												)}
												{field.state.meta.errors[0] ? (
													<p className="text-sm text-destructive">
														{field.state.meta.errors[0]}
													</p>
												) : null}
											</div>
										)}
									</page.form.Field>
								))}

								<page.form.Subscribe selector={(state) => state.values.title}>
									{(title) => (
										<page.form.Field name="slug">
											{(field) => (
												<div className="space-y-2">
													<Label htmlFor="listing-details-slug">
														{page.copy.slug}
													</Label>
													<Input
														disabled={listing.status === "PUBLISHED"}
														id="listing-details-slug"
														onBlur={field.handleBlur}
														onChange={(event) => {
															field.handleChange(event.target.value);
															page.markDirty();
														}}
														value={
															field.state.value || createListingSlug(title)
														}
													/>
												</div>
											)}
										</page.form.Field>
									)}
								</page.form.Subscribe>
								<page.form.Subscribe
									selector={(state) => ({
										description: state.values.description,
										seoDescription: state.values.seoDescription,
										seoTitle: state.values.seoTitle,
										slug: state.values.slug,
										title: state.values.title,
									})}
								>
									{(values) => (
										<ListingMetadataPreview
											copy={page.copy}
											{...values}
											variant="url"
										/>
									)}
								</page.form.Subscribe>

								<page.form.Field name="showExactAddress">
									{(field) => (
										<label
											className="flex items-start gap-3 rounded-lg border p-4"
											htmlFor="listing-details-address"
										>
											<Checkbox
												checked={field.state.value}
												id="listing-details-address"
												onCheckedChange={(checked) => {
													field.handleChange(checked === true);
													page.markDirty();
												}}
											/>
											<span>
												<span className="block text-sm font-semibold">
													{page.copy.exactAddress}
												</span>
												<span className="mt-1 block text-xs leading-5 text-muted-foreground">
													{field.state.value
														? page.copy.exactAddressVisible
														: page.copy.exactAddressHidden}
												</span>
											</span>
										</label>
									)}
								</page.form.Field>

								<Accordion
									defaultValue={listing.status === "DRAFT" ? "seo" : undefined}
									type="single"
									collapsible
								>
									<AccordionItem className="rounded-lg border px-4" value="seo">
										<AccordionTrigger>{page.copy.seo}</AccordionTrigger>
										<AccordionContent className="space-y-4 pt-2">
											<p className="text-xs leading-5 text-muted-foreground">
												{page.copy.seoHelp}
											</p>
											<page.form.Subscribe
												selector={(state) => ({
													description: state.values.description,
													title: state.values.title,
												})}
											>
												{({ description, title }) =>
													(["seoTitle", "seoDescription"] as const).map(
														(name) => (
															<page.form.Field key={name} name={name}>
																{(field) => (
																	<div className="space-y-2">
																		<Label htmlFor={`listing-details-${name}`}>
																			{name === "seoTitle"
																				? page.copy.seoTitle
																				: page.copy.seoDescription}
																		</Label>
																		<Input
																			id={`listing-details-${name}`}
																			onChange={(event) => {
																				field.handleChange(event.target.value);
																				page.markDirty();
																			}}
																			value={
																				field.state.value ||
																				(name === "seoTitle"
																					? title
																					: createSeoDescription(description))
																			}
																		/>
																	</div>
																)}
															</page.form.Field>
														),
													)
												}
											</page.form.Subscribe>
											<page.form.Subscribe
												selector={(state) => ({
													description: state.values.description,
													seoDescription: state.values.seoDescription,
													seoTitle: state.values.seoTitle,
													slug: state.values.slug,
													title: state.values.title,
												})}
											>
												{(values) => (
													<ListingMetadataPreview
														copy={page.copy}
														{...values}
														variant="seo"
													/>
												)}
											</page.form.Subscribe>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</div>

							<div className="mt-6 flex justify-end border-t pt-5">
								<page.form.Subscribe selector={(state) => state.isSubmitting}>
									{(isSubmitting) => (
										<Button
											disabled={!page.isDirty || isSubmitting}
											type="submit"
										>
											{isSubmitting ? (
												<LoaderCircle className="animate-spin" />
											) : (
												<Save />
											)}
											{isSubmitting ? page.copy.saving : page.copy.save}
										</Button>
									)}
								</page.form.Subscribe>
							</div>
							{page.formError ? (
								<p className="mt-3 text-sm text-destructive" role="alert">
									{page.formError}
								</p>
							) : null}
						</section>
					) : (
						<ArchivedContent copy={page.copy} listing={listing} />
					)}

					<AdminListingMediaPanel
						availableFeatures={page.availableFeatures}
						copy={page.copy}
						listing={listing}
						onFeatureCreate={page.createPropertyFeature}
						onFeaturesSave={page.setPropertyFeatures}
						onImagesSave={page.setPropertyImages}
					/>
				</div>

				<AdminListingLifecyclePanel
					copy={page.copy}
					isDirty={page.isDirty}
					listing={listing}
					onArchive={() => page.setArchiveOpen(true)}
					onDelete={() => page.setDeleteOpen(true)}
					onPublish={() => page.setPublishOpen(true)}
				/>
			</form>

			<Dialog
				onOpenChange={(open) =>
					!page.isLifecyclePending && page.setPublishOpen(open)
				}
				open={page.publishOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{page.copy.publishTitle}</DialogTitle>
						<DialogDescription>
							{page.copy.publishDescription}
						</DialogDescription>
					</DialogHeader>
					<div className="rounded-md bg-muted/45 p-4 text-sm">
						<strong className="block">{listing.title}</strong>
						<span className="mt-1 block text-muted-foreground">
							{formatPrice(listing)} · {publicUrl}
						</span>
					</div>
					{page.operationError ? (
						<p className="text-sm text-destructive" role="alert">
							{page.operationError}
						</p>
					) : null}
					<DialogFooter>
						<Button
							disabled={page.isLifecyclePending}
							onClick={() => page.setPublishOpen(false)}
							variant="outline"
						>
							{page.copy.cancel}
						</Button>
						<Button
							disabled={page.isLifecyclePending}
							onClick={() => void page.publish()}
						>
							{page.isLifecyclePending ? (
								<LoaderCircle className="animate-spin" />
							) : null}
							{page.copy.confirmPublish}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				onOpenChange={(open) =>
					!page.isLifecyclePending && page.setArchiveOpen(open)
				}
				open={page.archiveOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{page.copy.archiveTitle}</DialogTitle>
						<DialogDescription>
							{page.copy.archiveDescription}
						</DialogDescription>
					</DialogHeader>
					<fieldset>
						<legend className="text-sm font-semibold">
							{page.copy.archiveOutcome}
						</legend>
						<div className="mt-3 grid gap-2 sm:grid-cols-2">
							{page.archiveOutcomes.map((outcome) => (
								<Button
									aria-pressed={page.archiveOutcome === outcome}
									key={outcome}
									onClick={() => page.setArchiveOutcome(outcome)}
									type="button"
									variant={
										page.archiveOutcome === outcome ? "default" : "outline"
									}
								>
									{outcome === "SOLD"
										? page.copy.sold
										: outcome === "RENTED"
											? page.copy.rented
											: page.copy.withdrawn}
								</Button>
							))}
						</div>
					</fieldset>
					{page.operationError ? (
						<p className="text-sm text-destructive" role="alert">
							{page.operationError}
						</p>
					) : null}
					<DialogFooter>
						<Button
							disabled={page.isLifecyclePending}
							onClick={() => page.setArchiveOpen(false)}
							variant="outline"
						>
							{page.copy.cancel}
						</Button>
						<Button
							disabled={!page.archiveOutcome || page.isLifecyclePending}
							onClick={() => void page.archive()}
						>
							{page.isLifecyclePending ? (
								<LoaderCircle className="animate-spin" />
							) : null}
							{page.copy.confirmArchive}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				onOpenChange={(open) =>
					!page.isLifecyclePending && page.setDeleteOpen(open)
				}
				open={page.deleteOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{page.copy.deleteTitle}</DialogTitle>
						<DialogDescription>{page.copy.deleteDescription}</DialogDescription>
					</DialogHeader>
					{page.operationError ? (
						<p className="text-sm text-destructive" role="alert">
							{page.operationError}
						</p>
					) : null}
					<DialogFooter>
						<Button
							disabled={page.isLifecyclePending}
							onClick={() => page.setDeleteOpen(false)}
							variant="outline"
						>
							{page.copy.cancel}
						</Button>
						<Button
							disabled={page.isLifecyclePending}
							onClick={() => void page.deleteDraft()}
							variant="destructive"
						>
							{page.isLifecyclePending ? (
								<LoaderCircle className="animate-spin" />
							) : null}
							{page.copy.confirmDelete}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				onOpenChange={(open) => !open && page.blocker.reset?.()}
				open={page.blocker.status === "blocked"}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{page.copy.save}</DialogTitle>
						<DialogDescription>
							{page.copy.unavailablePreview}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => page.blocker.reset?.()} variant="outline">
							{page.copy.cancel}
						</Button>
						<Button
							onClick={() => page.blocker.proceed?.()}
							variant="destructive"
						>
							{page.copy.back}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
