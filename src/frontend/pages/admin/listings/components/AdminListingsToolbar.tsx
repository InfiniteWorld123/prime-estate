import { ListFilter, Search } from "lucide-react";

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
	AdminListingArchiveOutcome,
	AdminListingFilters,
	AdminListingSort,
	AdminListingStatus,
	AdminListingType,
} from "@/frontend/features/listings/admin-listing.types";
import type { AdminListingsCopy } from "../admin-listings.copy";

type AdminListingsToolbarProps = {
	copy: AdminListingsCopy;
	filters: AdminListingFilters;
	onFilterChange: <Key extends keyof AdminListingFilters>(
		key: Key,
		value: AdminListingFilters[Key],
	) => void;
	onReset: () => void;
	onSortChange: (value: AdminListingSort) => void;
	sort: AdminListingSort;
};

const sortValues: AdminListingSort[] = [
	"newest",
	"oldest",
	"recently_updated",
	"price_asc",
	"price_desc",
	"published_newest",
	"title_asc",
	"title_desc",
];

export function AdminListingsToolbar(props: AdminListingsToolbarProps) {
	return (
		<section className="mt-7 rounded-lg border bg-background p-3 sm:p-4">
			<div className="grid gap-3 xl:grid-cols-[minmax(18rem,1fr)_10rem_10rem_14rem]">
				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="h-9 pl-9"
						onChange={(event) =>
							props.onFilterChange("search", event.target.value)
						}
						placeholder={props.copy.search}
						type="search"
						value={props.filters.search}
					/>
				</div>
				<Select
					onValueChange={(value) =>
						props.onFilterChange("status", value as "ALL" | AdminListingStatus)
					}
					value={props.filters.status}
				>
					<SelectTrigger className="h-9 w-full">
						<SelectValue placeholder={props.copy.status} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">{props.copy.all}</SelectItem>
						<SelectItem value="DRAFT">{props.copy.draft}</SelectItem>
						<SelectItem value="PUBLISHED">{props.copy.published}</SelectItem>
						<SelectItem value="ARCHIVED">{props.copy.archived}</SelectItem>
					</SelectContent>
				</Select>
				<Select
					onValueChange={(value) =>
						props.onFilterChange(
							"listingType",
							value as "ALL" | AdminListingType,
						)
					}
					value={props.filters.listingType}
				>
					<SelectTrigger className="h-9 w-full">
						<SelectValue placeholder={props.copy.listingType} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">{props.copy.all}</SelectItem>
						<SelectItem value="SALE">{props.copy.sale}</SelectItem>
						<SelectItem value="RENT">{props.copy.rent}</SelectItem>
					</SelectContent>
				</Select>
				<Select
					onValueChange={(value) =>
						props.onSortChange(value as AdminListingSort)
					}
					value={props.sort}
				>
					<SelectTrigger className="h-9 w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{sortValues.map((value) => (
							<SelectItem key={value} value={value}>
								{props.copy.sort[value]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<details className="mt-3 border-t pt-3">
				<summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
					<ListFilter className="size-4" />
					{props.copy.minPrice} · {props.copy.maxPrice} · {props.copy.city}
				</summary>
				<div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					<Input
						aria-label={props.copy.city}
						onChange={(event) =>
							props.onFilterChange("city", event.target.value)
						}
						placeholder={props.copy.city}
						value={props.filters.city}
					/>
					<Input
						aria-label={props.copy.minPrice}
						inputMode="decimal"
						onChange={(event) =>
							props.onFilterChange("minPrice", event.target.value)
						}
						placeholder={props.copy.minPrice}
						value={props.filters.minPrice}
					/>
					<Input
						aria-label={props.copy.maxPrice}
						inputMode="decimal"
						onChange={(event) =>
							props.onFilterChange("maxPrice", event.target.value)
						}
						placeholder={props.copy.maxPrice}
						value={props.filters.maxPrice}
					/>
					<Select
						onValueChange={(value) =>
							props.onFilterChange(
								"archiveOutcome",
								value as "ALL" | AdminListingArchiveOutcome,
							)
						}
						value={props.filters.archiveOutcome}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={props.copy.archiveOutcome} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">{props.copy.all}</SelectItem>
							<SelectItem value="SOLD">{props.copy.sold}</SelectItem>
							<SelectItem value="RENTED">{props.copy.rented}</SelectItem>
							<SelectItem value="WITHDRAWN">{props.copy.withdrawn}</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Button
					className="mt-3"
					onClick={props.onReset}
					size="sm"
					variant="ghost"
				>
					{props.copy.reset}
				</Button>
			</details>
		</section>
	);
}
