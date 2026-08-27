import { Link } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowLeft,
	Building2,
	CheckCircle2,
	House,
	LoaderCircle,
	Search,
	UserRound,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { useCreatePropertyPage } from "@/frontend/hooks/pages/useCreatePropertyPage";
import { cn } from "@/frontend/lib/utils";
import { CreateContactDialog } from "./components/CreateContactDialog";
import { PropertyFormField } from "./components/PropertyFormField";
import { PropertySetupProgress } from "./components/PropertySetupProgress";

export function CreatePropertyPage() {
	const page = useCreatePropertyPage();
	const change = (handler: (value: string) => void) => (value: string) => {
		handler(value);
		page.markDirty();
	};
	const optionalPositive = (value: string) =>
		!value || Number(value) > 0 ? undefined : page.copy.validation.positive;
	const optionalYear = (value: string) =>
		!value ||
		(/^\d{4}$/.test(value) && Number(value) >= 1000 && Number(value) <= 9999)
			? undefined
			: page.copy.validation.year;

	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<Link
				className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
				to="/admin/properties"
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				{page.copy.cancel}
			</Link>
			<header className="mt-5 max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
					Administration · {page.copy.progress.property}
				</p>
				<h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
					{page.copy.title}
				</h1>
				<p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
					{page.copy.ownerDescription}
				</p>
			</header>
			<div className="mt-7">
				<PropertySetupProgress copy={page.copy} />
			</div>

			<form
				className="mt-7 space-y-6"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void page.form.handleSubmit();
				}}
			>
				<section className="rounded-lg border bg-background">
					<div className="border-b p-5">
						<h2 className="font-heading text-lg font-semibold">
							{page.copy.owner}
						</h2>
						<p className="mt-1 text-sm leading-6 text-muted-foreground">
							{page.copy.ownerDescription}
						</p>
					</div>
					<div className="space-y-5 p-5">
						<page.form.Subscribe
							selector={(state) =>
								[
									state.values.propertySource,
									state.values.primaryContactId,
								] as const
							}
						>
							{([propertySource, primaryContactId]) => (
								<>
									<fieldset>
										<legend className="text-sm font-medium">
											{page.copy.owner}
										</legend>
										<div className="mt-2 grid gap-3 sm:grid-cols-2">
											<button
												aria-pressed={propertySource === "AGENCY_OWNED"}
												className={cn(
													"flex items-center gap-3 rounded-lg border p-4 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring",
													propertySource === "AGENCY_OWNED" &&
														"border-primary bg-primary/5 ring-1 ring-primary/15",
												)}
												onClick={() => page.setPropertySource("AGENCY_OWNED")}
												type="button"
											>
												<span className="grid size-9 place-items-center rounded-md bg-muted text-primary">
													<Building2 aria-hidden="true" className="size-4" />
												</span>
												<span className="font-semibold">
													{page.copy.agencyOwned}
												</span>
											</button>
											<button
												aria-pressed={propertySource === "EXTERNAL_CLIENT"}
												className={cn(
													"flex items-center gap-3 rounded-lg border p-4 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring",
													propertySource === "EXTERNAL_CLIENT" &&
														"border-primary bg-primary/5 ring-1 ring-primary/15",
												)}
												onClick={() =>
													page.setPropertySource("EXTERNAL_CLIENT")
												}
												type="button"
											>
												<span className="grid size-9 place-items-center rounded-md bg-muted text-primary">
													<UserRound aria-hidden="true" className="size-4" />
												</span>
												<span className="font-semibold">
													{page.copy.externalClient}
												</span>
											</button>
										</div>
									</fieldset>
									{propertySource === "EXTERNAL_CLIENT" ? (
										<page.form.Field
											name="primaryContactId"
											validators={{
												onDynamic: ({ value }) =>
													value ? undefined : page.copy.validation.contact,
											}}
										>
											{(field) => (
												<div className="space-y-3">
													<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
														<div>
															<label
																className="text-sm font-medium"
																htmlFor="owner-search"
															>
																{page.copy.contact.select}
															</label>
															<p className="mt-1 text-xs text-muted-foreground">
																{page.copy.contact.search}
															</p>
														</div>
														<CreateContactDialog
															copy={page.copy}
															onCreate={page.addContact}
														/>
													</div>
													<div className="relative">
														<Search
															aria-hidden="true"
															className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
														/>
														<Input
															className="h-10 pl-9"
															id="owner-search"
															onChange={(event) =>
																page.setContactSearch(event.target.value)
															}
															placeholder={page.copy.contact.search}
															value={page.contactSearch}
														/>
													</div>
													<div
														aria-label={page.copy.contact.select}
														className="max-h-52 space-y-1 overflow-y-auto rounded-lg border p-2"
														role="listbox"
													>
														{page.contacts.length ? (
															page.contacts.map((contact) => (
																<button
																	aria-selected={
																		primaryContactId === contact.id
																	}
																	className={cn(
																		"flex w-full items-start justify-between gap-4 rounded-md px-3 py-2.5 text-left outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
																		primaryContactId === contact.id &&
																			"bg-primary/7 text-foreground",
																	)}
																	key={contact.id}
																	onClick={() => {
																		field.handleChange(contact.id);
																		page.markDirty();
																	}}
																	role="option"
																	type="button"
																>
																	<span>
																		<span className="block text-sm font-semibold">
																			{contact.fullName}
																		</span>
																		<span className="mt-1 block text-xs text-muted-foreground">
																			{contact.company ??
																				contact.email ??
																				contact.phone}
																		</span>
																	</span>
																	{primaryContactId === contact.id ? (
																		<CheckCircle2
																			aria-hidden="true"
																			className="mt-1 size-4 shrink-0 text-primary"
																		/>
																	) : null}
																</button>
															))
														) : (
															<p className="px-3 py-6 text-center text-sm text-muted-foreground">
																{page.copy.contact.empty}
															</p>
														)}
													</div>
													{field.state.meta.errors[0] ? (
														<p className="text-sm text-destructive">
															{String(field.state.meta.errors[0])}
														</p>
													) : null}
													{page.contactSuccess ? (
														<p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
															<CheckCircle2
																aria-hidden="true"
																className="size-4"
															/>
															{page.copy.contact.created}
														</p>
													) : null}
												</div>
											)}
										</page.form.Field>
									) : null}
								</>
							)}
						</page.form.Subscribe>
					</div>
				</section>

				<section className="rounded-lg border bg-background">
					<div className="border-b p-5">
						<h2 className="font-heading text-lg font-semibold">
							{page.copy.address}
						</h2>
						<p className="mt-1 text-sm leading-6 text-muted-foreground">
							{page.copy.addressDescription}
						</p>
					</div>
					<div className="space-y-5 p-5">
						<page.form.Subscribe
							selector={(state) => state.values.propertyType}
						>
							{(propertyType) => (
								<fieldset>
									<legend className="text-sm font-medium">
										{page.copy.propertyType}
									</legend>
									<div className="mt-2 grid gap-3 sm:grid-cols-2">
										<button
											aria-pressed={propertyType === "APARTMENT"}
											className={cn(
												"flex items-center gap-3 rounded-lg border p-4 text-left outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring",
												propertyType === "APARTMENT" &&
													"border-primary bg-primary/5 ring-1 ring-primary/15",
											)}
											onClick={() => page.setPropertyType("APARTMENT")}
											type="button"
										>
											<Building2
												aria-hidden="true"
												className="size-5 text-primary"
											/>
											<span className="font-semibold">
												{page.copy.apartment}
											</span>
										</button>
										<button
											aria-pressed={propertyType === "HOUSE"}
											className={cn(
												"flex items-center gap-3 rounded-lg border p-4 text-left outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring",
												propertyType === "HOUSE" &&
													"border-primary bg-primary/5 ring-1 ring-primary/15",
											)}
											onClick={() => page.setPropertyType("HOUSE")}
											type="button"
										>
											<House
												aria-hidden="true"
												className="size-5 text-primary"
											/>
											<span className="font-semibold">{page.copy.house}</span>
										</button>
									</div>
								</fieldset>
							)}
						</page.form.Subscribe>
						<div className="grid gap-4 sm:grid-cols-[1fr_10rem_10rem]">
							<page.form.Field
								name="streetName"
								validators={{
									onDynamic: ({ value }) =>
										page.required(value, page.copy.validation.required),
								}}
							>
								{(field) => (
									<PropertyFormField
										autoComplete="address-line1"
										error={field.state.meta.errors[0]}
										id={field.name}
										label={page.copy.streetName}
										onBlur={field.handleBlur}
										onChange={change(field.handleChange)}
										value={field.state.value}
									/>
								)}
							</page.form.Field>
							<page.form.Field
								name="houseNumber"
								validators={{
									onDynamic: ({ value }) =>
										page.required(value, page.copy.validation.required),
								}}
							>
								{(field) => (
									<PropertyFormField
										error={field.state.meta.errors[0]}
										id={field.name}
										label={page.copy.houseNumber}
										onBlur={field.handleBlur}
										onChange={change(field.handleChange)}
										value={field.state.value}
									/>
								)}
							</page.form.Field>
							<page.form.Field name="unitNumber">
								{(field) => (
									<PropertyFormField
										id={field.name}
										label={page.copy.unit}
										onBlur={field.handleBlur}
										onChange={change(field.handleChange)}
										value={field.state.value}
									/>
								)}
							</page.form.Field>
						</div>
						<div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
							<page.form.Field
								name="postalCode"
								validators={{
									onDynamic: ({ value }) =>
										/^\d{5}$/.test(value)
											? undefined
											: page.copy.validation.postalCode,
								}}
							>
								{(field) => (
									<PropertyFormField
										autoComplete="postal-code"
										error={field.state.meta.errors[0]}
										id={field.name}
										inputMode="numeric"
										label={page.copy.postalCode}
										maxLength={5}
										onBlur={field.handleBlur}
										onChange={change(field.handleChange)}
										value={field.state.value}
									/>
								)}
							</page.form.Field>
							<page.form.Field
								name="city"
								validators={{
									onDynamic: ({ value }) =>
										page.required(value, page.copy.validation.required),
								}}
							>
								{(field) => (
									<PropertyFormField
										autoComplete="address-level2"
										error={field.state.meta.errors[0]}
										id={field.name}
										label={page.copy.city}
										onBlur={field.handleBlur}
										onChange={change(field.handleChange)}
										value={field.state.value}
									/>
								)}
							</page.form.Field>
						</div>
					</div>
				</section>

				<section className="rounded-lg border bg-background">
					<div className="border-b p-5">
						<h2 className="font-heading text-lg font-semibold">
							{page.copy.details}
						</h2>
						<p className="mt-1 text-sm leading-6 text-muted-foreground">
							{page.copy.detailsDescription}
						</p>
					</div>
					<div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
						<page.form.Field
							name="livingArea"
							validators={{
								onDynamic: ({ value }) =>
									page.positive(value, page.copy.validation.positive),
							}}
						>
							{(field) => (
								<PropertyFormField
									error={field.state.meta.errors[0]}
									id={field.name}
									inputMode="decimal"
									label={page.copy.livingArea}
									onBlur={field.handleBlur}
									onChange={change(field.handleChange)}
									unit="m²"
									value={field.state.value}
								/>
							)}
						</page.form.Field>
						<page.form.Field
							name="rooms"
							validators={{
								onDynamic: ({ value }) =>
									page.positive(value, page.copy.validation.positive),
							}}
						>
							{(field) => (
								<PropertyFormField
									error={field.state.meta.errors[0]}
									id={field.name}
									inputMode="decimal"
									label={page.copy.rooms}
									onBlur={field.handleBlur}
									onChange={change(field.handleChange)}
									value={field.state.value}
								/>
							)}
						</page.form.Field>
						<page.form.Field
							name="bedrooms"
							validators={{
								onDynamic: ({ value }) =>
									page.optionalInteger(value, page.copy.validation.integer),
							}}
						>
							{(field) => (
								<PropertyFormField
									error={field.state.meta.errors[0]}
									id={field.name}
									inputMode="numeric"
									label={page.copy.bedrooms}
									onBlur={field.handleBlur}
									onChange={change(field.handleChange)}
									value={field.state.value}
								/>
							)}
						</page.form.Field>
						<page.form.Field
							name="bathrooms"
							validators={{
								onDynamic: ({ value }) =>
									value
										? page.optionalInteger(
												value,
												page.copy.validation.integer,
												false,
											)
										: page.copy.validation.required,
							}}
						>
							{(field) => (
								<PropertyFormField
									error={field.state.meta.errors[0]}
									id={field.name}
									inputMode="numeric"
									label={page.copy.bathrooms}
									onBlur={field.handleBlur}
									onChange={change(field.handleChange)}
									value={field.state.value}
								/>
							)}
						</page.form.Field>
						<page.form.Subscribe
							selector={(state) => state.values.propertyType}
						>
							{(propertyType) =>
								propertyType === "HOUSE" ? (
									<page.form.Field
										name="plotArea"
										validators={{
											onDynamic: ({ value }) => optionalPositive(value),
										}}
									>
										{(field) => (
											<PropertyFormField
												error={field.state.meta.errors[0]}
												id={field.name}
												inputMode="decimal"
												label={page.copy.plotArea}
												onBlur={field.handleBlur}
												onChange={change(field.handleChange)}
												unit="m²"
												value={field.state.value}
											/>
										)}
									</page.form.Field>
								) : (
									<page.form.Field
										name="floorNumber"
										validators={{
											onDynamic: ({ value }) =>
												page.optionalInteger(
													value,
													page.copy.validation.integer,
												),
										}}
									>
										{(field) => (
											<PropertyFormField
												error={field.state.meta.errors[0]}
												id={field.name}
												inputMode="numeric"
												label={page.copy.floorNumber}
												onBlur={field.handleBlur}
												onChange={change(field.handleChange)}
												value={field.state.value}
											/>
										)}
									</page.form.Field>
								)
							}
						</page.form.Subscribe>
						<page.form.Field
							name="yearBuilt"
							validators={{ onDynamic: ({ value }) => optionalYear(value) }}
						>
							{(field) => (
								<PropertyFormField
									error={field.state.meta.errors[0]}
									id={field.name}
									inputMode="numeric"
									label={page.copy.yearBuilt}
									maxLength={4}
									onBlur={field.handleBlur}
									onChange={change(field.handleChange)}
									value={field.state.value}
								/>
							)}
						</page.form.Field>
						<page.form.Field
							name="totalFloors"
							validators={{
								onDynamic: ({ value }) =>
									page.optionalInteger(
										value,
										page.copy.validation.integer,
										false,
									),
							}}
						>
							{(field) => (
								<PropertyFormField
									error={field.state.meta.errors[0]}
									id={field.name}
									inputMode="numeric"
									label={page.copy.totalFloors}
									onBlur={field.handleBlur}
									onChange={change(field.handleChange)}
									value={field.state.value}
								/>
							)}
						</page.form.Field>
					</div>
				</section>

				{page.serverError ? (
					<p
						className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"
						role="alert"
					>
						<AlertCircle aria-hidden="true" className="mt-0.5 size-4" />
						{page.serverError}
					</p>
				) : null}
				<div className="sticky bottom-3 z-10 flex flex-col-reverse gap-3 rounded-lg border bg-background/92 p-3 shadow-sm backdrop-blur sm:flex-row sm:justify-end">
					<Button
						onClick={page.navigateToCollection}
						type="button"
						variant="outline"
					>
						{page.copy.cancel}
					</Button>
					<page.form.Subscribe selector={(state) => state.isSubmitting}>
						{(isSubmitting) => (
							<Button disabled={isSubmitting} type="submit">
								{isSubmitting ? (
									<LoaderCircle
										aria-hidden="true"
										className="animate-spin motion-reduce:animate-none"
									/>
								) : null}
								{isSubmitting ? page.copy.creating : page.copy.create}
							</Button>
						)}
					</page.form.Subscribe>
				</div>
			</form>

			<Dialog open={page.blocker.status === "blocked"}>
				<DialogContent showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>{page.copy.discardTitle}</DialogTitle>
						<DialogDescription>
							{page.copy.discardDescription}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							onClick={() =>
								page.blocker.status === "blocked" && page.blocker.reset()
							}
							type="button"
							variant="outline"
						>
							{page.copy.cancel}
						</Button>
						<Button
							onClick={() =>
								page.blocker.status === "blocked" && page.blocker.proceed()
							}
							type="button"
							variant="destructive"
						>
							{page.copy.discard}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
