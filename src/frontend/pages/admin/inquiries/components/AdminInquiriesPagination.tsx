import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import type { AdminInquiriesCopy } from "../admin-inquiries.copy";

type Props = {
	copy: AdminInquiriesCopy;
	page: number;
	pageSize: number;
	setPage: (page: number) => void;
	setPageSize: (pageSize: 20 | 50 | 100) => void;
	totalPages: number;
};

export function AdminInquiriesPagination(props: Props) {
	return (
		<div className="mt-5 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span>{props.copy.pageSize}</span>
				<Select
					value={String(props.pageSize)}
					onValueChange={(value) =>
						props.setPageSize(Number(value) as 20 | 50 | 100)
					}
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
			<nav
				aria-label="Pagination"
				className="flex items-center gap-2 self-end sm:self-auto"
			>
				<Button
					aria-label={props.copy.previous}
					disabled={props.page <= 1}
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
					disabled={props.page >= props.totalPages}
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
