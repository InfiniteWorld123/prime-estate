import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/frontend/components/ui/sheet";
import type { AdminPropertyAdvancedFilters } from "@/frontend/features/properties/admin-property.types";
import type { AdminPropertiesCopy } from "../admin-properties.copy";

type AdminPropertyFiltersSheetProps = {
	activeCount: number;
	contacts: Array<{ id: string; label: string }>;
	copy: AdminPropertiesCopy;
	filters: AdminPropertyAdvancedFilters;
	filterError: string;
	onApply: () => boolean;
	onChange: <Key extends keyof AdminPropertyAdvancedFilters>(
		key: Key,
		value: AdminPropertyAdvancedFilters[Key],
	) => void;
	onReset: () => void;
};

const rangeFields = [
	["livingArea", "minLivingArea", "maxLivingArea"],
	["plotArea", "minPlotArea", "maxPlotArea"],
	["rooms", "minRooms", "maxRooms"],
	["bedrooms", "minBedrooms", "maxBedrooms"],
	["bathrooms", "minBathrooms", "maxBathrooms"],
	["yearBuilt", "minYearBuilt", "maxYearBuilt"],
] as const;

export function AdminPropertyFiltersSheet({
	activeCount,
	contacts,
	copy,
	filters,
	filterError,
	onApply,
	onChange,
	onReset,
}: AdminPropertyFiltersSheetProps) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet onOpenChange={setOpen} open={open}>
			<SheetTrigger asChild>
				<Button className="relative" type="button" variant="outline">
					<SlidersHorizontal aria-hidden="true" />
					{copy.moreFilters}
					{activeCount > 0 ? (
						<span className="ml-1 grid size-5 place-items-center rounded-full bg-primary text-[0.65rem] font-semibold text-primary-foreground">
							{activeCount}
						</span>
					) : null}
				</Button>
			</SheetTrigger>

			<SheetContent
				className="w-[94%] overflow-y-auto sm:max-w-xl"
				side="right"
			>
				<SheetHeader className="border-b">
					<SheetTitle>{copy.advanced.heading}</SheetTitle>
					<SheetDescription>{copy.description}</SheetDescription>
				</SheetHeader>

				<div className="grid gap-5 px-4 pb-5 sm:grid-cols-2">
					<div className="grid gap-2">
						<Label htmlFor="admin-filter-source">{copy.advanced.source}</Label>
						<Select
							value={filters.propertySource}
							onValueChange={(value) =>
								onChange(
									"propertySource",
									value as AdminPropertyAdvancedFilters["propertySource"],
								)
							}
						>
							<SelectTrigger className="w-full" id="admin-filter-source">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">{copy.all}</SelectItem>
								<SelectItem value="AGENCY_OWNED">
									{copy.source.AGENCY_OWNED}
								</SelectItem>
								<SelectItem value="EXTERNAL_CLIENT">
									{copy.source.EXTERNAL_CLIENT}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="admin-filter-contact">
							{copy.advanced.contact}
						</Label>
						<Select
							value={filters.primaryContactId || "ALL"}
							onValueChange={(value) =>
								onChange("primaryContactId", value === "ALL" ? "" : value)
							}
						>
							<SelectTrigger className="w-full" id="admin-filter-contact">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">{copy.all}</SelectItem>
								{contacts.map((contact) => (
									<SelectItem key={contact.id} value={contact.id}>
										{contact.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="admin-filter-city">{copy.advanced.city}</Label>
						<Input
							id="admin-filter-city"
							value={filters.city}
							onChange={(event) => onChange("city", event.target.value)}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="admin-filter-postal-code">
							{copy.advanced.postalCode}
						</Label>
						<Input
							id="admin-filter-postal-code"
							inputMode="numeric"
							maxLength={5}
							value={filters.postalCode}
							onChange={(event) => onChange("postalCode", event.target.value)}
						/>
					</div>

					{rangeFields.map(([labelKey, minimumKey, maximumKey]) => (
						<fieldset className="grid gap-2" key={labelKey}>
							<legend className="text-sm font-medium">
								{copy.advanced[labelKey]}
							</legend>
							<div className="grid grid-cols-2 gap-2">
								<Input
									aria-label={`${copy.advanced[labelKey]} ${copy.advanced.min}`}
									inputMode="decimal"
									placeholder={copy.advanced.min}
									value={filters[minimumKey]}
									onChange={(event) => onChange(minimumKey, event.target.value)}
								/>
								<Input
									aria-label={`${copy.advanced[labelKey]} ${copy.advanced.max}`}
									inputMode="decimal"
									placeholder={copy.advanced.max}
									value={filters[maximumKey]}
									onChange={(event) => onChange(maximumKey, event.target.value)}
								/>
							</div>
						</fieldset>
					))}

					{filterError ? (
						<p
							className="sm:col-span-2 text-sm font-medium text-destructive"
							role="alert"
						>
							{filterError}
						</p>
					) : null}
				</div>

				<SheetFooter className="sticky bottom-0 border-t bg-background sm:flex-row sm:justify-between">
					<Button onClick={onReset} type="button" variant="ghost">
						{copy.advanced.reset}
					</Button>
					<Button
						onClick={() => {
							if (onApply()) setOpen(false);
						}}
						type="button"
					>
						{copy.advanced.apply}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
