import { Grid2X2, ListFilter, Search, TableProperties } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import type {
	AdminPropertyAdvancedFilters,
	AdminPropertyArchiveFilter,
	AdminPropertySort,
	AdminPropertyTypeFilter,
	AdminPropertyView,
} from "@/frontend/features/properties/admin-property.types";
import { cn } from "@/frontend/lib/utils";
import type { AdminPropertiesCopy } from "../admin-properties.copy";
import { AdminPropertyFiltersSheet } from "./AdminPropertyFiltersSheet";

type AdminPropertiesToolbarProps = {
	activeAdvancedFilterCount: number;
	archiveStatus: AdminPropertyArchiveFilter;
	contacts: Array<{ id: string; label: string }>;
	copy: AdminPropertiesCopy;
	draftFilters: AdminPropertyAdvancedFilters;
	filterError: string;
	onApplyAdvancedFilters: () => boolean;
	onArchiveStatusChange: (value: AdminPropertyArchiveFilter) => void;
	onDraftFilterChange: <Key extends keyof AdminPropertyAdvancedFilters>(
		key: Key,
		value: AdminPropertyAdvancedFilters[Key],
	) => void;
	onPropertyTypeChange: (value: AdminPropertyTypeFilter) => void;
	onResetAdvancedFilters: () => void;
	onSearchChange: (value: string) => void;
	onSortChange: (value: AdminPropertySort) => void;
	onViewChange: (value: AdminPropertyView) => void;
	propertyType: AdminPropertyTypeFilter;
	search: string;
	sort: AdminPropertySort;
	view: AdminPropertyView;
};

const sortValues: AdminPropertySort[] = [
	"newest",
	"oldest",
	"recently_updated",
	"reference_asc",
	"reference_desc",
	"living_area_asc",
	"living_area_desc",
	"rooms_asc",
	"rooms_desc",
	"year_built_asc",
	"year_built_desc",
	"city_asc",
	"city_desc",
];

export function AdminPropertiesToolbar(props: AdminPropertiesToolbarProps) {
	const { copy } = props;
	return (
		<section
			aria-label={copy.moreFilters}
			className="mt-7 rounded-lg border bg-background p-3 sm:p-4"
		>
			<div className="grid gap-3 xl:grid-cols-[minmax(18rem,1fr)_auto_auto_auto]">
				<div className="relative">
					<Search
						aria-hidden="true"
						className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						className="h-9 pl-9"
						placeholder={copy.search}
						type="search"
						value={props.search}
						onChange={(event) => props.onSearchChange(event.target.value)}
					/>
				</div>
				<Select
					value={props.archiveStatus}
					onValueChange={(value) =>
						props.onArchiveStatusChange(value as AdminPropertyArchiveFilter)
					}
				>
					<SelectTrigger className="h-9 w-full xl:w-36">
						<ListFilter aria-hidden="true" />
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="active">{copy.active}</SelectItem>
						<SelectItem value="archived">{copy.archived}</SelectItem>
						<SelectItem value="all">{copy.all}</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={props.propertyType}
					onValueChange={(value) =>
						props.onPropertyTypeChange(value as AdminPropertyTypeFilter)
					}
				>
					<SelectTrigger className="h-9 w-full xl:w-40">
						<SelectValue placeholder={copy.type} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">{copy.all}</SelectItem>
						<SelectItem value="APARTMENT">{copy.apartment}</SelectItem>
						<SelectItem value="HOUSE">{copy.house}</SelectItem>
					</SelectContent>
				</Select>
				<AdminPropertyFiltersSheet
					activeCount={props.activeAdvancedFilterCount}
					contacts={props.contacts}
					copy={copy}
					filters={props.draftFilters}
					filterError={props.filterError}
					onApply={props.onApplyAdvancedFilters}
					onChange={props.onDraftFilterChange}
					onReset={props.onResetAdvancedFilters}
				/>
			</div>

			<div className="mt-3 flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
				<Select
					value={props.sort}
					onValueChange={(value) =>
						props.onSortChange(value as AdminPropertySort)
					}
				>
					<SelectTrigger className="h-9 w-full sm:w-64">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{sortValues.map((value) => (
							<SelectItem key={value} value={value}>
								{copy.sort[value]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<fieldset
					aria-label={copy.view.label}
					className="hidden items-center rounded-lg border p-0.5 lg:flex"
				>
					<legend className="sr-only">{copy.view.label}</legend>
					<Button
						aria-label={copy.view.table}
						aria-pressed={props.view === "table"}
						className={cn(
							"h-7",
							props.view === "table" && "bg-muted text-foreground",
						)}
						onClick={() => props.onViewChange("table")}
						size="sm"
						type="button"
						variant="ghost"
					>
						<TableProperties aria-hidden="true" />
						{copy.view.table}
					</Button>
					<Button
						aria-label={copy.view.grid}
						aria-pressed={props.view === "grid"}
						className={cn(
							"h-7",
							props.view === "grid" && "bg-muted text-foreground",
						)}
						onClick={() => props.onViewChange("grid")}
						size="sm"
						type="button"
						variant="ghost"
					>
						<Grid2X2 aria-hidden="true" />
						{copy.view.grid}
					</Button>
				</fieldset>
			</div>
		</section>
	);
}
