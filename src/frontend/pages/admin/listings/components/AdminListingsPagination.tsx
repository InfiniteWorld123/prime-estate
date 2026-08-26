import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import type { AdminListingsCopy } from "../admin-listings.copy";

type AdminListingsPaginationProps = {
	copy: AdminListingsCopy;
	page: number;
	pageSize: number;
	setPage: (page: number) => void;
	setPageSize: (pageSize: number) => void;
	totalPages: number;
};

export function AdminListingsPagination(props: AdminListingsPaginationProps) {
	return (
		<div className="mt-5 flex items-center justify-between border-t pt-5">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span>{props.copy.pageSize}</span>
				<Select
					value={String(props.pageSize)}
					onValueChange={(value) => props.setPageSize(Number(value))}
				>
					<SelectTrigger className="w-20">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="20">20</SelectItem>
						<SelectItem value="50">50</SelectItem>
						<SelectItem value="100">100</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<nav aria-label="Pagination" className="flex items-center gap-2">
				<Button
					aria-label={props.copy.previous}
					disabled={props.page === 1}
					onClick={() => props.setPage(props.page - 1)}
					size="icon"
					variant="outline"
				>
					<ChevronLeft />
				</Button>
				<span className="min-w-16 text-center text-sm tabular-nums">
					{props.page} / {props.totalPages}
				</span>
				<Button
					aria-label={props.copy.next}
					disabled={props.page === props.totalPages}
					onClick={() => props.setPage(props.page + 1)}
					size="icon"
					variant="outline"
				>
					<ChevronRight />
				</Button>
			</nav>
		</div>
	);
}
