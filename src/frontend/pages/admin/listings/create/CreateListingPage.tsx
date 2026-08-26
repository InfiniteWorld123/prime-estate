import { Building2, CopyCheck, House, ImageOff, ListPlus } from "lucide-react";

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
import { ListingMetadataPreview } from "@/frontend/features/listings/components/ListingMetadataPreview";
import {
	createListingSlug,
	createSeoDescription,
} from "@/frontend/features/listings/listing-slug";
import { useCreateListingPage } from "@/frontend/hooks/pages/useCreateListingPage";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { PropertySetupJourney } from "@/frontend/pages/admin/properties/setup/PropertySetupJourney";
import { propertySetupCopy } from "@/frontend/pages/admin/properties/setup/property-setup.copy";

export function CreateListingPage() {
	const page = useCreateListingPage();
	const { language } = useLanguage();
	const journeyCopy = propertySetupCopy[language];
	const TypeIcon = page.property.propertyType === "HOUSE" ? House : Building2;

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<header className="max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
					{page.copy.administration}
				</p>
				<h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
					{page.copy.heading}
				</h1>
				<p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
					{page.copy.subtitle}
				</p>
			</header>

			<div className="mt-7">
				<PropertySetupJourney current="listing" labels={journeyCopy.journey} />
			</div>

			<form
				className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]"
				onSubmit={(event) => {
					event.preventDefault();
					void page.form.handleSubmit();
				}}
			>
				<section className="space-y-6 rounded-lg border bg-background p-4 sm:p-6">
					<page.form.Field
						name="listingType"
						validators={{
							onDynamic: ({ value }) =>
								value ? undefined : page.copy.requiredType,
						}}
					>
						{(field) => (
							<fieldset>
								<legend className="text-sm font-semibold">
									{page.copy.listingType}
								</legend>
								<div className="mt-3 grid gap-3 sm:grid-cols-2">
									{(["SALE", "RENT"] as const).map((type) => (
										<Button
											aria-invalid={Boolean(field.state.meta.errors[0])}
											disabled={
												type === "SALE"
													? !page.availability.sale
													: !page.availability.rent
											}
											key={type}
											onClick={() => {
												field.handleChange(type);
												page.markDirty();
											}}
											type="button"
											title={
												(
													type === "SALE"
														? page.availability.sale
														: page.availability.rent
												)
													? undefined
													: page.copy.unavailableType
											}
											variant={
												field.state.value === type ? "default" : "outline"
											}
										>
											{type === "SALE" ? page.copy.sale : page.copy.rent}
										</Button>
									))}
								</div>
								{field.state.meta.errors[0] ? (
									<p className="mt-2 text-sm text-destructive">
										{field.state.meta.errors[0]}
									</p>
								) : null}
							</fieldset>
						)}
					</page.form.Field>

					{page.prefill ? (
						<div className="flex items-start gap-3 rounded-lg border border-primary/25 bg-primary/5 p-4">
							<span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
								<CopyCheck aria-hidden="true" className="size-4" />
							</span>
							<div>
								<p className="text-sm font-semibold">
									{page.prefill.sourceListing.listingType === "RENT"
										? page.copy.prefillTitle.rent
										: page.copy.prefillTitle.sale}
								</p>
								<p className="mt-1 text-xs leading-5 text-muted-foreground">
									{page.copy.prefillDescription}
								</p>
							</div>
						</div>
					) : null}

					<page.form.Subscribe selector={(state) => state.values.listingType}>
						{(listingType) => (
							<page.form.Field
								name="price"
								validators={{
									onDynamic: ({ value }) =>
										!value || Number(value) > 0
											? undefined
											: page.copy.validationPrice,
								}}
							>
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="listing-price">
											{listingType === "RENT"
												? page.copy.price.rent
												: page.copy.price.sale}
										</Label>
										<div className="relative">
											<Input
												aria-invalid={Boolean(field.state.meta.errors[0])}
												className="pr-14"
												id="listing-price"
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
						)}
					</page.form.Subscribe>

					{(["title", "description"] as const).map((name) => (
						<page.form.Field key={name} name={name}>
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={`listing-${name}`}>
										{name === "title" ? page.copy.title : page.copy.description}
									</Label>
									{name === "title" ? (
										<Input
											id={`listing-${name}`}
											onBlur={field.handleBlur}
											onChange={(event) => {
												field.handleChange(event.target.value);
												page.markDirty();
											}}
											placeholder={page.copy.titlePlaceholder}
											value={field.state.value}
										/>
									) : (
										<Textarea
											id={`listing-${name}`}
											onBlur={field.handleBlur}
											onChange={(event) => {
												field.handleChange(event.target.value);
												page.markDirty();
											}}
											placeholder={page.copy.descriptionPlaceholder}
											rows={7}
											value={field.state.value}
										/>
									)}
								</div>
							)}
						</page.form.Field>
					))}

					<page.form.Subscribe selector={(state) => state.values.title}>
						{(title) => (
							<page.form.Field name="slug">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor="listing-slug">{page.copy.slug}</Label>
										<Input
											id="listing-slug"
											onBlur={field.handleBlur}
											onChange={(event) => {
												field.handleChange(event.target.value);
												page.markDirty();
											}}
											value={field.state.value || createListingSlug(title)}
										/>
										<p className="text-xs text-muted-foreground">
											{page.copy.slugHelp}
										</p>
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
								htmlFor="listing-exact-address"
							>
								<Checkbox
									checked={field.state.value}
									id="listing-exact-address"
									onCheckedChange={(checked) => {
										field.handleChange(checked === true);
										page.markDirty();
									}}
								/>
								<span>
									<span className="block text-sm font-semibold">
										{page.copy.addressVisibility}
									</span>
									<span className="mt-1 block text-xs leading-5 text-muted-foreground">
										{page.copy.addressVisibilityDescription}
									</span>
								</span>
							</label>
						)}
					</page.form.Field>

					<Accordion defaultValue="seo" type="single" collapsible>
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
										(["seoTitle", "seoDescription"] as const).map((name) => (
											<page.form.Field key={name} name={name}>
												{(field) => (
													<div className="space-y-2">
														<Label htmlFor={`listing-${name}`}>
															{name === "seoTitle"
																? page.copy.seoTitle
																: page.copy.seoDescription}
														</Label>
														<Input
															id={`listing-${name}`}
															onBlur={field.handleBlur}
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
										))
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

					<div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
						<Button onClick={page.finishLater} type="button" variant="outline">
							{page.copy.backToProperty}
						</Button>
						<page.form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) => (
								<Button disabled={isSubmitting} type="submit">
									<ListPlus aria-hidden="true" />
									{isSubmitting ? page.copy.creating : page.copy.create}
								</Button>
							)}
						</page.form.Subscribe>
					</div>
				</section>

				<aside className="rounded-lg border bg-background p-4 lg:sticky lg:top-24">
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
						{page.copy.propertyContext}
					</p>
					{page.property.coverImage ? (
						<img
							alt=""
							className="mt-4 aspect-[4/3] w-full rounded-md object-cover"
							src={page.property.coverImage}
						/>
					) : (
						<div className="mt-4 grid aspect-[4/3] place-items-center rounded-md bg-muted text-muted-foreground">
							<ImageOff aria-hidden="true" />
						</div>
					)}
					<div className="mt-4 flex items-center justify-between gap-3">
						<strong>{page.referenceNumber}</strong>
						<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
							<TypeIcon aria-hidden="true" className="size-3.5" />
							{page.property.propertyType === "HOUSE"
								? page.copy.house
								: page.copy.apartment}
						</span>
					</div>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						{page.property.streetName} {page.property.houseNumber},{" "}
						{page.property.postalCode} {page.property.city}
					</p>
					<div className="mt-4 grid grid-cols-2 gap-2 text-sm">
						<div className="rounded-md bg-muted/45 p-3">
							<strong className="block">{page.property.livingArea} m²</strong>
							<span className="text-xs text-muted-foreground">
								{page.copy.livingArea}
							</span>
						</div>
						<div className="rounded-md bg-muted/45 p-3">
							<strong className="block">{page.property.rooms}</strong>
							<span className="text-xs text-muted-foreground">
								{page.copy.rooms}
							</span>
						</div>
					</div>
				</aside>
			</form>

			<Dialog
				onOpenChange={(open) => !open && page.blocker.reset?.()}
				open={page.blocker.status === "blocked"}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{journeyCopy.common.leaveTitle}</DialogTitle>
						<DialogDescription>
							{journeyCopy.common.leaveDescription}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => page.blocker.reset?.()} variant="outline">
							{journeyCopy.common.stay}
						</Button>
						<Button
							onClick={() => page.blocker.proceed?.()}
							variant="destructive"
						>
							{journeyCopy.common.discard}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
