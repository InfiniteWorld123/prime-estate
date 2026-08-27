import { Link } from "@tanstack/react-router";
import {
	AlertCircle,
	Archive,
	LoaderCircle,
	Plus,
	RefreshCw,
	X,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { useAdminPropertiesPage } from "@/frontend/hooks/pages/useAdminPropertiesPage";
import { AdminPropertiesCollection } from "./components/AdminPropertiesCollection";
import { AdminPropertiesPagination } from "./components/AdminPropertiesPagination";
import { AdminPropertiesToolbar } from "./components/AdminPropertiesToolbar";
import { AdminPropertyActionDialog } from "./components/AdminPropertyActionDialog";

export function AdminPropertiesPage() {
	const page = useAdminPropertiesPage();
	const hasSelection = page.selectedIds.length > 0;

	return (
		<div className="mx-auto w-full max-w-[96rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
				<div className="max-w-3xl">
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
						Administration
					</p>
					<h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
						{page.copy.title}
					</h1>
					<p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
						{page.copy.description}
					</p>
				</div>
				<Button asChild>
					<Link to="/admin/properties/new">
						<Plus aria-hidden="true" />
						{page.copy.create}
					</Link>
				</Button>
			</header>

			<AdminPropertiesToolbar
				activeAdvancedFilterCount={page.activeAdvancedFilterCount}
				archiveStatus={page.archiveStatus}
				contacts={page.contacts}
				copy={page.copy}
				draftFilters={page.draftFilters}
				filterError={page.filterError}
				onApplyAdvancedFilters={page.applyAdvancedFilters}
				onArchiveStatusChange={page.updateArchiveStatus}
				onDraftFilterChange={page.updateDraftFilter}
				onPropertyTypeChange={page.updatePropertyType}
				onResetAdvancedFilters={page.resetAdvancedFilters}
				onSearchChange={page.setSearchInput}
				onSortChange={page.updateSort}
				onViewChange={page.setView}
				propertyType={page.propertyType}
				search={page.searchInput}
				sort={page.sort}
				view={page.view}
			/>

			<div className="mt-5 min-h-9" aria-live="polite">
				{hasSelection ? (
					<div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
						<p className="mr-auto text-sm font-semibold text-primary">
							{page.copy.selected(page.selectedIds.length)}
						</p>
						<Button
							onClick={() => page.selectedIds.forEach(page.toggleSelection)}
							size="sm"
							type="button"
							variant="ghost"
						>
							<X aria-hidden="true" />
							{page.copy.clearSelection}
						</Button>
						<Button
							disabled={page.visibleProperties
								.filter((property) => page.selectedIds.includes(property.id))
								.some((property) => property.archivedAt !== null)}
							onClick={() => page.requestAction("archive", page.selectedIds)}
							size="sm"
							type="button"
						>
							<Archive aria-hidden="true" />
							{page.copy.bulkArchive}
						</Button>
					</div>
				) : (
					<div className="flex items-center justify-between gap-3">
						<p className="text-sm font-medium text-muted-foreground">
							{page.copy.results(page.totalItems)}
						</p>
						{page.activeAdvancedFilterCount > 0 || page.searchInput ? (
							<Button
								onClick={page.resetAllFilters}
								size="sm"
								type="button"
								variant="ghost"
							>
								{page.copy.advanced.reset}
							</Button>
						) : null}
					</div>
				)}
			</div>

			<div className="relative mt-3">
				{page.isUpdating ? (
					<output className="absolute -top-9 right-0 flex items-center gap-2 text-xs font-medium text-muted-foreground">
						<LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" />
						{page.copy.updating}
					</output>
				) : null}
				{page.loadError && page.visibleProperties.length === 0 ? (
					<div className="grid min-h-80 place-items-center rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
						<div>
							<AlertCircle className="mx-auto size-6 text-destructive" />
							<p className="mt-3 font-heading text-lg font-semibold">
								{page.copy.loadError}
							</p>
							<p className="mt-1 text-sm text-muted-foreground">
								{page.loadError}
							</p>
							<Button className="mt-4" onClick={() => void page.refetch()}>
								<RefreshCw />
								{page.copy.retry}
							</Button>
						</div>
					</div>
				) : !page.isInitialLoading && page.visibleProperties.length === 0 ? (
					<div className="grid min-h-80 place-items-center rounded-lg border bg-background p-6 text-center">
						<div>
							<p className="font-heading text-lg font-semibold">
								{page.copy.empty}
							</p>
							<Button
								className="mt-4"
								onClick={page.resetAllFilters}
								type="button"
								variant="outline"
							>
								{page.copy.advanced.reset}
							</Button>
						</div>
					</div>
				) : (
					<AdminPropertiesCollection
						allVisibleSelected={page.allVisibleSelected}
						copy={page.copy}
						isInitialLoading={page.isInitialLoading}
						onAction={page.requestAction}
						onSelectAll={page.toggleSelectAll}
						onSelectionChange={page.toggleSelection}
						properties={page.visibleProperties}
						selectedIds={page.selectedIds}
						view={page.view}
					/>
				)}
			</div>

			<AdminPropertiesPagination
				copy={page.copy}
				currentPage={page.currentPage}
				onPageChange={page.setPage}
				onPageSizeChange={page.updatePageSize}
				pageSize={page.pageSize}
				totalPages={page.totalPages}
			/>

			<AdminPropertyActionDialog
				action={page.pendingAction?.action ?? null}
				actionError={page.actionError}
				copy={page.copy}
				count={page.pendingAction?.ids.length ?? 0}
				onConfirm={page.confirmAction}
				onOpenChange={(open) => {
					if (!open) page.setPendingAction(null);
				}}
				isPending={page.isActionPending}
			/>
		</div>
	);
}
