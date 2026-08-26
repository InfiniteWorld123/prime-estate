import { Link } from "@tanstack/react-router";
import {
	Archive,
	Bath,
	BedDouble,
	Building2,
	Ellipsis,
	Eye,
	House,
	ImageOff,
	Pencil,
	RotateCcw,
	Ruler,
	Trash2,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import type {
	AdminPropertyRecord,
	AdminPropertyView,
} from "@/frontend/features/properties/admin-property.types";
import type { AdminPropertyAction } from "@/frontend/hooks/pages/useAdminPropertiesPage";
import { cn } from "@/frontend/lib/utils";
import type { AdminPropertiesCopy } from "../admin-properties.copy";

type AdminPropertiesCollectionProps = {
	allVisibleSelected: boolean;
	copy: AdminPropertiesCopy;
	isInitialLoading: boolean;
	onAction: (action: AdminPropertyAction, ids: string[]) => void;
	onSelectAll: () => void;
	onSelectionChange: (id: string) => void;
	properties: AdminPropertyRecord[];
	selectedIds: string[];
	view: AdminPropertyView;
};

function PropertyStatus({
	archived,
	copy,
}: {
	archived: boolean;
	copy: AdminPropertiesCopy;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium",
				archived
					? "border-border bg-muted text-muted-foreground"
					: "border-emerald-600/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400",
			)}
		>
			<span
				aria-hidden="true"
				className={cn(
					"size-1.5 rounded-full",
					archived ? "bg-muted-foreground" : "bg-emerald-500",
				)}
			/>
			{archived ? copy.archived : copy.active}
		</span>
	);
}

function PropertyCover({
	property,
	copy,
	className,
}: {
	property: AdminPropertyRecord;
	copy: AdminPropertiesCopy;
	className: string;
}) {
	if (!property.coverImage)
		return (
			<div
				aria-label={copy.imageMissing}
				className={cn(
					"grid place-items-center bg-muted text-muted-foreground",
					className,
				)}
				role="img"
			>
				<div className="flex flex-col items-center gap-1">
					<ImageOff aria-hidden="true" className="size-5" />
					<span className="text-[0.65rem] font-medium">
						{copy.imageMissing}
					</span>
				</div>
			</div>
		);
	return (
		<img
			alt=""
			className={cn("object-cover", className)}
			loading="lazy"
			src={property.coverImage}
		/>
	);
}

function PropertyActions({
	copy,
	onAction,
	property,
}: {
	copy: AdminPropertiesCopy;
	onAction: AdminPropertiesCollectionProps["onAction"];
	property: AdminPropertyRecord;
}) {
	const isArchived = property.archivedAt !== null;
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label={`${property.referenceNumber} actions`}
					size="icon"
					type="button"
					variant="ghost"
				>
					<Ellipsis aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem asChild>
					<Link
						params={{ propertyId: property.id }}
						search={{ edit: undefined }}
						to="/admin/properties/$propertyId"
					>
						<Eye aria-hidden="true" />
						{copy.actions.view}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						params={{ propertyId: property.id }}
						search={{ edit: true }}
						to="/admin/properties/$propertyId"
					>
						<Pencil aria-hidden="true" />
						{copy.actions.edit}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{isArchived ? (
					<DropdownMenuItem onSelect={() => onAction("restore", [property.id])}>
						<RotateCcw aria-hidden="true" />
						{copy.actions.restore}
					</DropdownMenuItem>
				) : (
					<DropdownMenuItem onSelect={() => onAction("archive", [property.id])}>
						<Archive aria-hidden="true" />
						{copy.actions.archive}
					</DropdownMenuItem>
				)}
				<DropdownMenuItem
					onSelect={() => onAction("delete", [property.id])}
					variant="destructive"
				>
					<Trash2 aria-hidden="true" />
					{copy.actions.delete}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function formatUpdated(value: string, language: "de" | "en") {
	return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}

function TableSkeleton() {
	const skeletonRows = ["one", "two", "three", "four", "five", "six", "seven"];
	return (
		<div className="space-y-2 p-3">
			{skeletonRows.map((row) => (
				<Skeleton className="h-16 w-full" key={row} />
			))}
		</div>
	);
}

function PropertyTable(props: AdminPropertiesCollectionProps) {
	return (
		<div className="hidden overflow-x-auto rounded-lg border bg-background lg:block">
			{props.isInitialLoading ? (
				<TableSkeleton />
			) : (
				<table className="w-full min-w-[68rem] border-collapse text-left text-sm">
					<thead className="border-b bg-muted/45 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
						<tr>
							<th className="w-12 px-4 py-3">
								<Checkbox
									aria-label="Select all visible properties"
									checked={props.allVisibleSelected}
									onCheckedChange={props.onSelectAll}
								/>
							</th>
							<th className="px-3 py-3">{props.copy.table.property}</th>
							<th className="px-3 py-3">{props.copy.table.address}</th>
							<th className="px-3 py-3">{props.copy.table.contact}</th>
							<th className="px-3 py-3">{props.copy.table.area}</th>
							<th className="px-3 py-3">{props.copy.table.status}</th>
							<th className="px-3 py-3">{props.copy.table.updated}</th>
							<th className="w-14 px-3 py-3">
								<span className="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y">
						{props.properties.map((property) => {
							const TypeIcon =
								property.propertyType === "HOUSE" ? House : Building2;
							return (
								<tr
									className="group transition-colors hover:bg-muted/25 motion-reduce:transition-none"
									key={property.id}
								>
									<td className="px-4 py-3">
										<Checkbox
											aria-label={`Select ${property.referenceNumber}`}
											checked={props.selectedIds.includes(property.id)}
											onCheckedChange={() =>
												props.onSelectionChange(property.id)
											}
										/>
									</td>
									<td className="px-3 py-3">
										<div className="flex items-center gap-3">
											<PropertyCover
												className="h-11 w-16 shrink-0 rounded-md"
												copy={props.copy}
												property={property}
											/>
											<div>
												<p className="font-semibold text-primary">
													{property.referenceNumber}
												</p>
												<p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
													<TypeIcon aria-hidden="true" className="size-3.5" />
													{property.propertyType === "HOUSE"
														? props.copy.house
														: props.copy.apartment}
												</p>
											</div>
										</div>
									</td>
									<td className="px-3 py-3">
										<p className="font-medium">
											{property.streetName} {property.houseNumber}
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{property.postalCode} {property.city}
										</p>
									</td>
									<td className="px-3 py-3">
										<p>{props.copy.source[property.propertySource]}</p>
										<p className="mt-1 max-w-52 truncate text-xs text-muted-foreground">
											{property.contactName ?? props.copy.noContact}
										</p>
									</td>
									<td className="px-3 py-3">
										<p className="font-medium tabular-nums">
											{property.livingArea} m²
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{property.rooms} {props.copy.advanced.rooms}
										</p>
									</td>
									<td className="px-3 py-3">
										<PropertyStatus
											archived={property.archivedAt !== null}
											copy={props.copy}
										/>
									</td>
									<td className="px-3 py-3 text-muted-foreground">
										{formatUpdated(
											property.updatedAt,
											props.copy.title === "Immobilien" ? "de" : "en",
										)}
									</td>
									<td className="px-3 py-3">
										<PropertyActions
											copy={props.copy}
											onAction={props.onAction}
											property={property}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</div>
	);
}

function PropertyCard({
	copy,
	onAction,
	onSelectionChange,
	property,
	selected,
}: {
	copy: AdminPropertiesCopy;
	onAction: AdminPropertiesCollectionProps["onAction"];
	onSelectionChange: (id: string) => void;
	property: AdminPropertyRecord;
	selected: boolean;
}) {
	const TypeIcon = property.propertyType === "HOUSE" ? House : Building2;
	return (
		<article
			className={cn(
				"group overflow-hidden rounded-lg border bg-background transition-colors motion-reduce:transition-none",
				selected && "border-primary ring-2 ring-primary/10",
			)}
		>
			<div className="relative aspect-[16/9] overflow-hidden">
				<PropertyCover
					className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
					copy={copy}
					property={property}
				/>
				<div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
					<Checkbox
						aria-label={`Select ${property.referenceNumber}`}
						checked={selected}
						className="bg-background shadow-sm"
						onCheckedChange={() => onSelectionChange(property.id)}
					/>
					<PropertyActions
						copy={copy}
						onAction={onAction}
						property={property}
					/>
				</div>
			</div>
			<div className="border-t-2 border-t-primary/70 p-4">
				<div className="flex items-start justify-between gap-3">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
							{property.referenceNumber}
						</p>
						<h2 className="mt-1 font-heading text-base font-semibold">
							{property.streetName} {property.houseNumber}
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							{property.postalCode} {property.city}
						</p>
					</div>
					<PropertyStatus archived={property.archivedAt !== null} copy={copy} />
				</div>
				<div className="mt-4 grid grid-cols-3 gap-2 border-y py-3 text-xs text-muted-foreground">
					<span className="flex items-center gap-1.5">
						<Ruler aria-hidden="true" className="size-3.5" />
						{property.livingArea} m²
					</span>
					<span className="flex items-center gap-1.5">
						<BedDouble aria-hidden="true" className="size-3.5" />
						{property.bedrooms ?? "—"}
					</span>
					<span className="flex items-center gap-1.5">
						<Bath aria-hidden="true" className="size-3.5" />
						{property.bathrooms}
					</span>
				</div>
				<div className="mt-3 flex items-center justify-between gap-3 text-xs">
					<span className="flex items-center gap-1.5 text-muted-foreground">
						<TypeIcon aria-hidden="true" className="size-3.5" />
						{property.propertyType === "HOUSE" ? copy.house : copy.apartment}
					</span>
					<span className="truncate text-muted-foreground">
						{property.contactName ?? copy.noContact}
					</span>
				</div>
			</div>
		</article>
	);
}

export function AdminPropertiesCollection(
	props: AdminPropertiesCollectionProps,
) {
	const skeletonCards = ["one", "two", "three", "four"];
	if (props.isInitialLoading)
		return (
			<>
				<PropertyTable {...props} />
				<div className="grid gap-4 lg:hidden">
					{skeletonCards.map((card) => (
						<Skeleton className="aspect-[4/3] w-full" key={card} />
					))}
				</div>
			</>
		);
	return (
		<>
			<div className="lg:hidden">
				<div className="grid gap-4 sm:grid-cols-2">
					{props.properties.map((property) => (
						<PropertyCard
							copy={props.copy}
							key={property.id}
							onAction={props.onAction}
							onSelectionChange={props.onSelectionChange}
							property={property}
							selected={props.selectedIds.includes(property.id)}
						/>
					))}
				</div>
			</div>
			{props.view === "table" ? (
				<PropertyTable {...props} />
			) : (
				<div className="hidden grid-cols-2 gap-5 lg:grid xl:grid-cols-3">
					{props.properties.map((property) => (
						<PropertyCard
							copy={props.copy}
							key={property.id}
							onAction={props.onAction}
							onSelectionChange={props.onSelectionChange}
							property={property}
							selected={props.selectedIds.includes(property.id)}
						/>
					))}
				</div>
			)}
		</>
	);
}
