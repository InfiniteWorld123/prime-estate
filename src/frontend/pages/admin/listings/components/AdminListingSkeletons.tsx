import { Skeleton } from "@/frontend/components/ui/skeleton";

const ROWS = ["listing-a", "listing-b", "listing-c", "listing-d", "listing-e"];
const CARDS = ["property-a", "property-b", "property-c", "property-d"];

export function AdminListingsPageSkeleton({ label }: { label: string }) {
	return (
		<section aria-busy="true" className="mt-8" aria-label={label}>
			<output className="sr-only">{label}</output>
			<div aria-hidden="true">
				<div className="grid gap-3 rounded-lg border bg-background p-4 lg:grid-cols-[minmax(15rem,1fr)_repeat(3,11rem)_auto]">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-24" />
				</div>
				<div className="mt-5 flex items-center justify-between">
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-4 w-20" />
				</div>
				<div className="mt-3 overflow-hidden rounded-lg border bg-background">
					<div className="hidden grid-cols-[minmax(16rem,1.5fr)_9rem_9rem_8rem_3rem] gap-4 border-b bg-muted/35 p-4 md:grid">
						{["head-a", "head-b", "head-c", "head-d"].map((item) => (
							<Skeleton className="h-3 w-20" key={item} />
						))}
					</div>
					{ROWS.map((row) => (
						<div
							className="grid gap-4 border-b p-4 last:border-b-0 md:grid-cols-[minmax(16rem,1.5fr)_9rem_9rem_8rem_3rem] md:items-center"
							key={row}
						>
							<div className="flex items-center gap-3">
								<Skeleton className="size-12 shrink-0" />
								<div className="min-w-0 flex-1 space-y-2">
									<Skeleton className="h-4 w-4/5" />
									<Skeleton className="h-3 w-2/5" />
								</div>
							</div>
							<Skeleton className="h-5 w-20" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-6 w-16" />
							<Skeleton className="size-8" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export function ListingSelectionSkeleton({ label }: { label: string }) {
	return (
		<section
			aria-busy="true"
			aria-label={label}
			className="mt-5 grid gap-3 md:grid-cols-2"
		>
			<output className="sr-only">{label}</output>
			{CARDS.map((card) => (
				<div
					aria-hidden="true"
					className="flex gap-4 rounded-lg border bg-background p-4"
					key={card}
				>
					<Skeleton className="h-24 w-28 shrink-0" />
					<div className="flex-1 space-y-3">
						<Skeleton className="h-3 w-20" />
						<Skeleton className="h-4 w-4/5" />
						<Skeleton className="h-3 w-3/5" />
					</div>
				</div>
			))}
		</section>
	);
}

export function ListingWorkspaceSkeleton({ label }: { label: string }) {
	return (
		<section
			aria-busy="true"
			aria-label={label}
			className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8"
		>
			<output className="sr-only">{label}</output>
			<div aria-hidden="true">
				<Skeleton className="h-4 w-28" />
				<Skeleton className="mt-4 h-9 w-72 max-w-full" />
				<Skeleton className="mt-3 h-4 w-[32rem] max-w-full" />
				<div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
					<div className="space-y-6 rounded-lg border bg-background p-4 sm:p-6">
						<Skeleton className="h-5 w-32" />
						<div className="grid gap-3 sm:grid-cols-2">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-28 w-full" />
						<Skeleton className="h-20 w-full" />
					</div>
					<div className="space-y-4 rounded-lg border bg-background p-4">
						<Skeleton className="aspect-[4/3] w-full" />
						<Skeleton className="h-5 w-28" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>
			</div>
		</section>
	);
}

export function ListingPreviewSkeleton({ label }: { label: string }) {
	return (
		<section
			aria-busy="true"
			aria-label={label}
			className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8"
		>
			<output className="sr-only">{label}</output>
			<div aria-hidden="true">
				<Skeleton className="h-20 w-full" />
				<div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.7fr)]">
					<Skeleton className="aspect-[4/3] w-full" />
					<div className="space-y-4 rounded-lg border p-5">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-8 w-4/5" />
						<Skeleton className="h-5 w-2/3" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
			</div>
		</section>
	);
}
