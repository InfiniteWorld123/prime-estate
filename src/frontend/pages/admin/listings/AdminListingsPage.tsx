import { Link } from "@tanstack/react-router";
import { AlertTriangle, Building2, ListPlus, LoaderCircle } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { useAdminListingsPage } from "@/frontend/hooks/pages/useAdminListingsPage";
import { AdminListingsPageSkeleton } from "./components/AdminListingSkeletons";
import { AdminListingsCollection } from "./components/AdminListingsCollection";
import { AdminListingsPagination } from "./components/AdminListingsPagination";
import { AdminListingsToolbar } from "./components/AdminListingsToolbar";

export function AdminListingsPage() {
	const page = useAdminListingsPage();
	return (
		<div className="mx-auto w-full max-w-[96rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div className="max-w-3xl">
					<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
						{page.copy.administration}
					</p>
					<h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
						{page.copy.title}
					</h1>
					<p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
						{page.copy.subtitle}
					</p>
				</div>
				<Button asChild>
					<Link
						to={
							page.hasAnyProperties
								? "/admin/listings/new"
								: "/admin/properties/new"
						}
					>
						{page.hasAnyProperties ? <ListPlus /> : <Building2 />}
						{page.hasAnyProperties
							? page.copy.create
							: page.copy.createFirstProperty}
					</Link>
				</Button>
			</header>

			{page.isInitialLoading ? (
				<AdminListingsPageSkeleton label={page.copy.loading} />
			) : page.loadError ? (
				<section className="mt-8 grid min-h-80 place-items-center rounded-lg border border-destructive/25 bg-destructive/5 p-6 text-center">
					<div className="max-w-md">
						<AlertTriangle className="mx-auto size-8 text-destructive" />
						<h2 className="mt-4 font-heading text-xl font-semibold">
							{page.copy.loadError}
						</h2>
						<p className="mt-2 text-sm text-muted-foreground">
							{page.loadError}
						</p>
						<Button className="mt-5" onClick={() => void page.refetch()}>
							{page.copy.retry}
						</Button>
					</div>
				</section>
			) : !page.hasAnyProperties || !page.hasAnyListings ? (
				<section className="mt-8 grid min-h-80 place-items-center rounded-lg border bg-background p-6 text-center">
					<div className="max-w-md">
						<div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary/8 text-primary">
							{page.hasAnyProperties ? <ListPlus /> : <Building2 />}
						</div>
						<h2 className="mt-5 font-heading text-xl font-semibold">
							{page.hasAnyProperties
								? page.copy.emptyListingsTitle
								: page.copy.emptyPropertiesTitle}
						</h2>
						<p className="mt-2 text-sm leading-6 text-muted-foreground">
							{page.hasAnyProperties
								? page.copy.emptyListingsDescription
								: page.copy.emptyPropertiesDescription}
						</p>
						<Button asChild className="mt-5">
							<Link
								to={
									page.hasAnyProperties
										? "/admin/listings/new"
										: "/admin/properties/new"
								}
							>
								{page.hasAnyProperties ? <ListPlus /> : <Building2 />}
								{page.hasAnyProperties
									? page.copy.createFirstListing
									: page.copy.createFirstProperty}
							</Link>
						</Button>
					</div>
				</section>
			) : (
				<>
					<AdminListingsToolbar
						copy={page.copy}
						filters={page.filters}
						onFilterChange={page.updateFilter}
						onReset={page.resetFilters}
						onSortChange={page.setSort}
						sort={page.sort}
					/>
					<div className="mt-5 flex items-center justify-between">
						<p className="text-sm font-medium" aria-live="polite">
							{page.copy.resultCount(page.totalItems)}
						</p>
						{page.isUpdating ? (
							<p className="flex items-center gap-2 text-xs text-muted-foreground">
								<LoaderCircle className="size-3.5 animate-spin" />
								{page.copy.updating}
							</p>
						) : null}
					</div>
					<AdminListingsCollection copy={page.copy} listings={page.listings} />
					<AdminListingsPagination
						copy={page.copy}
						page={page.page}
						pageSize={page.pageSize}
						setPage={page.setPage}
						setPageSize={page.setPageSize}
						totalPages={page.totalPages}
					/>
				</>
			)}
		</div>
	);
}
