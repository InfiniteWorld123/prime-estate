import { Link } from "@tanstack/react-router";
import {
	Archive,
	ArrowLeft,
	Building2,
	CheckCircle2,
	FileText,
	ImageIcon,
	Pencil,
	RotateCcw,
	Sparkles,
	Trash2,
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
import { useAdminPropertyDetailsPage } from "@/frontend/hooks/pages/useAdminPropertyDetailsPage";
import { cn } from "@/frontend/lib/utils";
import { PropertyFormField } from "../create/components/PropertyFormField";

export function AdminPropertyDetailsPage() {
	const page = useAdminPropertyDetailsPage();
	if (!page.record) {
		return (
			<div className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-4 py-10 text-center">
				<div>
					<h1 className="font-heading text-2xl font-semibold">
						{page.copy.notFound}
					</h1>
					<Button asChild className="mt-5" variant="outline">
						<Link to="/admin/properties">{page.copy.back}</Link>
					</Button>
				</div>
			</div>
		);
	}
	const record = page.record;
	const isArchived = record.archivedAt !== null;
	const actionCopy =
		page.action === "delete"
			? {
					title: page.copy.deleteTitle,
					description: page.copy.deleteDescription,
					label: page.copy.delete,
				}
			: page.action === "restore"
				? {
						title: page.copy.restoreTitle,
						description: page.copy.restoreDescription,
						label: page.copy.restore,
					}
				: {
						title: page.copy.archiveTitle,
						description: page.copy.archiveDescription,
						label: page.copy.archive,
					};
	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<Link
				className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
				to="/admin/properties"
			>
				<ArrowLeft className="size-4" />
				{page.copy.back}
			</Link>
			<header className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
				<div className="min-w-0">
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
						{page.copy.administration}
					</p>
					<div className="mt-2 flex flex-wrap items-center gap-3">
						<h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
							{record.referenceNumber}
						</h1>
						<span
							className={cn(
								"rounded-md border px-2 py-1 text-xs font-semibold",
								isArchived
									? "bg-muted text-muted-foreground"
									: "border-emerald-600/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300",
							)}
						>
							{isArchived ? page.copy.archived : page.copy.active}
						</span>
					</div>
					<p className="mt-2 text-sm text-muted-foreground">
						{record.streetName} {record.houseNumber}, {record.postalCode}{" "}
						{record.city}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					{!page.isEditing ? (
						<Button onClick={() => page.setIsEditing(true)}>
							<Pencil />
							{page.copy.edit}
						</Button>
					) : null}
					{isArchived ? (
						<Button onClick={() => page.setAction("restore")} variant="outline">
							<RotateCcw />
							{page.copy.restore}
						</Button>
					) : (
						<Button onClick={() => page.setAction("archive")} variant="outline">
							<Archive />
							{page.copy.archive}
						</Button>
					)}
					<Button
						onClick={() => page.setAction("delete")}
						variant="destructive"
					>
						<Trash2 />
						{page.copy.delete}
					</Button>
				</div>
			</header>

			{page.success ? (
				<output className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-600/20 bg-emerald-500/8 p-4 text-sm font-medium text-emerald-800 dark:text-emerald-300">
					<CheckCircle2 className="size-4" />
					{page.copy.success}
				</output>
			) : null}

			<nav
				aria-label={page.copy.title}
				className="mt-7 grid gap-3 sm:grid-cols-3"
			>
				<Button asChild className="h-auto justify-start p-4" variant="outline">
					<Link
						params={{ propertyId: page.propertyId }}
						to="/admin/properties/$propertyId/images"
					>
						<ImageIcon />
						{page.copy.images}
					</Link>
				</Button>
				<Button asChild className="h-auto justify-start p-4" variant="outline">
					<Link
						params={{ propertyId: page.propertyId }}
						to="/admin/properties/$propertyId/features"
					>
						<Sparkles />
						{page.copy.features}
					</Link>
				</Button>
				<Button asChild className="h-auto justify-start p-4" variant="outline">
					<Link to="/admin/listings">
						<FileText />
						{page.copy.listings}
					</Link>
				</Button>
			</nav>

			<div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
				<div>
					{page.isEditing ? (
						<EditPropertyForm page={page} />
					) : (
						<div className="space-y-6">
							<DetailSection title={page.copy.property}>
								<Detail
									label={page.copy.field.livingArea}
									value={`${record.livingArea} m²`}
								/>
								<Detail
									label={page.copy.field.rooms}
									value={String(record.rooms)}
								/>
								<Detail
									label={page.copy.field.bedrooms}
									value={
										record.bedrooms == null ? "—" : String(record.bedrooms)
									}
								/>
								<Detail
									label={page.copy.field.bathrooms}
									value={String(record.bathrooms)}
								/>
								<Detail
									label={page.copy.field.yearBuilt}
									value={
										record.yearBuilt == null ? "—" : String(record.yearBuilt)
									}
								/>
								<Detail
									label={
										record.propertyType === "HOUSE"
											? page.copy.field.plotArea
											: page.copy.field.floor
									}
									value={
										record.propertyType === "HOUSE"
											? record.plotArea
												? `${record.plotArea} m²`
												: "—"
											: "2"
									}
								/>
							</DetailSection>
							<DetailSection title={page.copy.listings}>
								<p className="col-span-full text-sm leading-6 text-muted-foreground">
									{page.copy.listingsDescription}
								</p>
							</DetailSection>
						</div>
					)}
				</div>
				<aside className="space-y-6">
					<section className="rounded-lg border bg-background p-5">
						<h2 className="font-heading font-semibold">{page.copy.contact}</h2>
						<div className="mt-4 flex items-start gap-3">
							<span className="grid size-9 place-items-center rounded-md bg-muted text-primary">
								{record.propertySource === "AGENCY_OWNED" ? (
									<Building2 className="size-4" />
								) : (
									<UserRound className="size-4" />
								)}
							</span>
							<div>
								<p className="text-sm font-semibold">
									{record.propertySource === "AGENCY_OWNED"
										? page.copy.agencyOwned
										: page.copy.external}
								</p>
								{record.contactName ? (
									<>
										<p className="mt-2 text-sm">{record.contactName}</p>
										<p className="text-xs text-muted-foreground">
											{record.contactCompany}
										</p>
									</>
								) : null}
							</div>
						</div>
					</section>
					<section className="rounded-lg border bg-background p-5">
						<h2 className="font-heading font-semibold">{page.copy.updated}</h2>
						<p className="mt-3 text-sm text-muted-foreground">
							{new Intl.DateTimeFormat(
								page.language === "de" ? "de-DE" : "en-GB",
								{
									dateStyle: "medium",
									timeStyle: "short",
								},
							).format(new Date(record.updatedAt))}
						</p>
					</section>
				</aside>
			</div>

			<Dialog
				open={page.action !== null}
				onOpenChange={(open) => !open && page.setAction(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{actionCopy.title}</DialogTitle>
						<DialogDescription>{actionCopy.description}</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => page.setAction(null)} variant="outline">
							{page.copy.cancel}
						</Button>
						<Button
							onClick={page.confirmAction}
							variant={page.action === "delete" ? "destructive" : "default"}
						>
							{actionCopy.label}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function DetailSection({
	children,
	title,
}: {
	children: React.ReactNode;
	title: string;
}) {
	return (
		<section className="rounded-lg border bg-background">
			<div className="border-b p-5">
				<h2 className="font-heading text-lg font-semibold">{title}</h2>
			</div>
			<dl className="grid gap-x-8 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
				{children}
			</dl>
		</section>
	);
}
function Detail({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
				{label}
			</dt>
			<dd className="mt-1.5 text-sm font-medium">{value}</dd>
		</div>
	);
}

function EditPropertyForm({
	page,
}: {
	page: ReturnType<typeof useAdminPropertyDetailsPage>;
}) {
	const required = (value: string) =>
		value.trim() ? undefined : page.copy.required;
	return (
		<form
			className="rounded-lg border bg-background"
			onSubmit={(event) => {
				event.preventDefault();
				void page.form.handleSubmit();
			}}
		>
			<div className="border-b p-5">
				<h2 className="font-heading text-lg font-semibold">{page.copy.edit}</h2>
			</div>
			<div className="space-y-6 p-5">
				<page.form.Subscribe
					selector={(state) =>
						[state.values.propertyType, state.values.propertySource] as const
					}
				>
					{([propertyType, propertySource]) => (
						<>
							<div className="grid gap-3 sm:grid-cols-2">
								<Button
									onClick={() => {
										page.form.setFieldValue("propertyType", "APARTMENT");
										page.form.setFieldValue("plotArea", "");
									}}
									type="button"
									variant={propertyType === "APARTMENT" ? "default" : "outline"}
								>
									{page.copy.typeApartment}
								</Button>
								<Button
									onClick={() => {
										page.form.setFieldValue("propertyType", "HOUSE");
										page.form.setFieldValue("floorNumber", "");
									}}
									type="button"
									variant={propertyType === "HOUSE" ? "default" : "outline"}
								>
									{page.copy.typeHouse}
								</Button>
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								<Button
									onClick={() => {
										page.form.setFieldValue("propertySource", "AGENCY_OWNED");
										page.form.setFieldValue("primaryContactId", "");
									}}
									type="button"
									variant={
										propertySource === "AGENCY_OWNED" ? "default" : "outline"
									}
								>
									{page.copy.agencyOwned}
								</Button>
								<Button
									onClick={() =>
										page.form.setFieldValue("propertySource", "EXTERNAL_CLIENT")
									}
									type="button"
									variant={
										propertySource === "EXTERNAL_CLIENT" ? "default" : "outline"
									}
								>
									{page.copy.external}
								</Button>
							</div>
							{propertySource === "EXTERNAL_CLIENT" ? (
								<page.form.Field
									name="primaryContactId"
									validators={{ onDynamic: ({ value }) => required(value) }}
								>
									{(field) => (
										<label
											className="block space-y-2 text-sm font-medium"
											htmlFor="details-contact"
										>
											{page.copy.contact}
											<select
												className="mt-2 h-10 w-full rounded-lg border bg-background px-3"
												id="details-contact"
												onChange={(event) =>
													field.handleChange(event.target.value)
												}
												value={field.state.value}
											>
												<option value="">—</option>
												<option value="contact-katharina">
													Katharina Vogel · Thüringer Wohnraum GmbH
												</option>
												<option value="contact-miriam">
													Miriam Koch · Residenz Immobilien KG
												</option>
											</select>
											{field.state.meta.errors[0] ? (
												<span className="block text-sm text-destructive">
													{String(field.state.meta.errors[0])}
												</span>
											) : null}
										</label>
									)}
								</page.form.Field>
							) : null}
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{(
									[
										"streetName",
										"houseNumber",
										"postalCode",
										"city",
										"livingArea",
										"rooms",
										"bedrooms",
										"bathrooms",
										"yearBuilt",
										"totalFloors",
									] as const
								).map((name) => (
									<page.form.Field
										key={name}
										name={name}
										validators={{
											onDynamic: ({ value }) =>
												[
													"streetName",
													"houseNumber",
													"postalCode",
													"city",
													"livingArea",
													"rooms",
													"bathrooms",
												].includes(name)
													? required(value)
													: undefined,
										}}
									>
										{(field) => (
											<PropertyFormField
												error={field.state.meta.errors[0]}
												id={`details-${name}`}
												inputMode={
													[
														"livingArea",
														"rooms",
														"bedrooms",
														"bathrooms",
														"yearBuilt",
														"totalFloors",
													].includes(name)
														? "decimal"
														: "text"
												}
												label={
													page.copy.field[
														name === "streetName"
															? "street"
															: name === "livingArea"
																? "livingArea"
																: name === "yearBuilt"
																	? "yearBuilt"
																	: name === "totalFloors"
																		? "totalFloors"
																		: name
													]
												}
												onBlur={field.handleBlur}
												onChange={field.handleChange}
												unit={name === "livingArea" ? "m²" : undefined}
												value={field.state.value}
											/>
										)}
									</page.form.Field>
								))}
								<page.form.Field
									name={propertyType === "HOUSE" ? "plotArea" : "floorNumber"}
								>
									{(field) => (
										<PropertyFormField
											id="details-conditional"
											inputMode="decimal"
											label={
												propertyType === "HOUSE"
													? page.copy.field.plotArea
													: page.copy.field.floor
											}
											onBlur={field.handleBlur}
											onChange={field.handleChange}
											unit={propertyType === "HOUSE" ? "m²" : undefined}
											value={field.state.value}
										/>
									)}
								</page.form.Field>
								<page.form.Field name="unitNumber">
									{(field) => (
										<PropertyFormField
											id="details-unit"
											label={page.copy.field.unit}
											onBlur={field.handleBlur}
											onChange={field.handleChange}
											value={field.state.value}
										/>
									)}
								</page.form.Field>
							</div>
						</>
					)}
				</page.form.Subscribe>
			</div>
			<div className="flex flex-col-reverse gap-3 border-t p-4 sm:flex-row sm:justify-end">
				<Button
					onClick={() => page.setIsEditing(false)}
					type="button"
					variant="outline"
				>
					{page.copy.cancel}
				</Button>
				<page.form.Subscribe selector={(state) => state.isSubmitting}>
					{(submitting) => (
						<Button disabled={submitting} type="submit">
							{submitting ? page.copy.saving : page.copy.save}
						</Button>
					)}
				</page.form.Subscribe>
			</div>
		</form>
	);
}
