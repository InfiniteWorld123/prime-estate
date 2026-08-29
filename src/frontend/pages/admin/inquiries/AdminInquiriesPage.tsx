import { AlertCircle, LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import { useAdminInquiriesPage } from "@/frontend/hooks/pages/useAdminInquiriesPage";
import { AdminInquiriesCollection } from "./components/AdminInquiriesCollection";
import { AdminInquiriesPagination } from "./components/AdminInquiriesPagination";
import { AdminInquiriesToolbar } from "./components/AdminInquiriesToolbar";
import { AdminInquiryDetailDialog } from "./components/AdminInquiryDetailDialog";

export function AdminInquiriesPage() {
	const page = useAdminInquiriesPage();
	return (
		<div className="mx-auto w-full max-w-[96rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<header className="max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
					{page.copy.administration}
				</p>
				<h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
					{page.copy.title}
				</h1>
				<p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
					{page.copy.description}
				</p>
			</header>

			<AdminInquiriesToolbar
				archive={page.archive}
				copy={page.copy}
				interest={page.interest}
				listingId={page.listingId}
				onArchiveChange={page.setArchive}
				onInterestChange={page.setInterest}
				onListingIdChange={page.setListingId}
				onReset={page.resetFilters}
				onSortChange={page.setSort}
				onStatusChange={page.setStatus}
				onTypeChange={page.setType}
				onUnreadChange={page.setUnread}
				sort={page.sort}
				status={page.status}
				type={page.type}
				unread={page.unread}
			/>

			<div className="mt-5 flex min-h-7 items-center justify-between gap-3">
				<p className="text-sm font-medium text-muted-foreground">
					{page.copy.results(page.totalItems)}
				</p>
				{page.isUpdating ? (
					<output className="flex items-center gap-2 text-xs text-muted-foreground">
						<LoaderCircle className="size-3.5 animate-spin motion-reduce:animate-none" />
						{page.copy.updating}
					</output>
				) : null}
			</div>

			<div className="mt-3">
				{page.isInitialLoading ? (
					<output
						className="space-y-2 rounded-lg border bg-background p-4"
						aria-label={page.copy.loading}
					>
						{["one", "two", "three", "four", "five", "six"].map((key) => (
							<Skeleton className="h-16 w-full" key={key} />
						))}
					</output>
				) : page.loadError ? (
					<div className="grid min-h-72 place-items-center rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
						<div>
							<AlertCircle className="mx-auto size-6 text-destructive" />
							<h2 className="mt-3 font-heading text-lg font-semibold">
								{page.hasAuthorizationError
									? page.copy.unauthorized
									: page.copy.error}
							</h2>
							<p className="mt-2 text-sm text-muted-foreground">
								{page.loadError}
							</p>
							<Button className="mt-4" onClick={() => void page.refetch()}>
								<RefreshCw />
								{page.copy.retry}
							</Button>
						</div>
					</div>
				) : page.items.length === 0 ? (
					<div className="grid min-h-72 place-items-center rounded-lg border bg-background p-6 text-center">
						<div>
							<h2 className="font-heading text-lg font-semibold">
								{page.copy.empty}
							</h2>
							<Button
								className="mt-4"
								onClick={page.resetFilters}
								variant="outline"
							>
								{page.copy.reset}
							</Button>
						</div>
					</div>
				) : (
					<AdminInquiriesCollection
						copy={page.copy}
						items={page.items}
						onOpen={page.openDetail}
					/>
				)}
			</div>

			<AdminInquiriesPagination
				copy={page.copy}
				page={page.currentPage}
				pageSize={page.pageSize}
				setPage={page.setPage}
				setPageSize={page.setPageSize}
				totalPages={page.totalPages}
			/>
			<AdminInquiryDetailDialog
				copy={page.copy}
				detail={page.detail}
				error={page.detailError}
				isLoading={page.isDetailLoading}
				isMarkingRead={page.isMarkingRead}
				isOpen={page.isDetailOpen}
				isPending={page.isMutationPending}
				mutationError={page.mutationError}
				onArchive={page.archiveInquiry}
				onClose={page.closeDetail}
				onRestore={page.restoreInquiry}
				onRetry={page.refetchDetail}
				onStatusChange={page.updateStatus}
			/>
		</div>
	);
}
