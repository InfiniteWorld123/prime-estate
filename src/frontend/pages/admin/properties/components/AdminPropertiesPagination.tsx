import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import type { AdminPropertiesCopy } from "../admin-properties.copy";

type AdminPropertiesPaginationProps = {
	copy: AdminPropertiesCopy;
	currentPage: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	pageSize: number;
	totalPages: number;
};

function pageItems(currentPage: number, totalPages: number) {
	if (totalPages <= 5)
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	const items: Array<number | "ellipsis-left" | "ellipsis-right"> = [1];
	if (currentPage > 3) items.push("ellipsis-left");
	for (
		let page = Math.max(2, currentPage - 1);
		page <= Math.min(totalPages - 1, currentPage + 1);
		page += 1
	)
		items.push(page);
	if (currentPage < totalPages - 2) items.push("ellipsis-right");
	items.push(totalPages);
	return items;
}

export function AdminPropertiesPagination({
	copy,
	currentPage,
	onPageChange,
	onPageSizeChange,
	pageSize,
	totalPages,
}: AdminPropertiesPaginationProps) {
	return (
		<div className="mt-5 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<span>{copy.pageSize}</span>
				<Select
					value={String(pageSize)}
					onValueChange={(value) => onPageSizeChange(Number(value))}
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
			<nav aria-label="Pagination">
				<div className="flex items-center gap-1">
					<Button
						aria-label={copy.previous}
						disabled={currentPage === 1}
						onClick={() => onPageChange(currentPage - 1)}
						size="icon"
						type="button"
						variant="outline"
					>
						<ChevronLeft aria-hidden="true" />
					</Button>
					{pageItems(currentPage, totalPages).map((item) =>
						typeof item === "number" ? (
							<Button
								aria-current={item === currentPage ? "page" : undefined}
								className="hidden sm:inline-flex"
								key={item}
								onClick={() => onPageChange(item)}
								size="icon"
								type="button"
								variant={item === currentPage ? "outline" : "ghost"}
							>
								{item}
							</Button>
						) : (
							<span
								className="hidden size-8 place-items-center sm:grid"
								key={item}
							>
								<MoreHorizontal aria-hidden="true" className="size-4" />
							</span>
						),
					)}
					<Button
						aria-label={copy.next}
						disabled={currentPage === totalPages}
						onClick={() => onPageChange(currentPage + 1)}
						size="icon"
						type="button"
						variant="outline"
					>
						<ChevronRight aria-hidden="true" />
					</Button>
				</div>
			</nav>
		</div>
	);
}
