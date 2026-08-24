import { Skeleton } from "@/frontend/components/ui/skeleton";

export function PropertyCardSkeleton() {
	return (
		<article
			aria-hidden="true"
			className="flex h-full flex-col overflow-hidden rounded-lg border bg-card"
		>
			<Skeleton className="aspect-[4/3] w-full rounded-none" />

			<div className="flex flex-1 flex-col p-5">
				<Skeleton className="h-4 w-28" />

				<div className="mt-3 space-y-2">
					<Skeleton className="h-5 w-full" />
					<Skeleton className="h-5 w-3/4" />
				</div>

				<Skeleton className="mt-5 h-6 w-36" />

				<div className="mt-5 grid grid-cols-3 gap-2 border-t pt-4">
					<Skeleton className="h-4 w-12" />
					<Skeleton className="h-4 w-14" />
					<Skeleton className="ml-auto h-4 w-16" />
				</div>
			</div>
		</article>
	);
}
