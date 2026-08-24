import { Skeleton } from "@/frontend/components/ui/skeleton";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

const FACT_SKELETON_IDS = [
	"fact-rooms",
	"fact-area",
	"fact-baths",
	"fact-type",
];

export function PropertyDetailsSkeleton() {
	const { copy } = useLanguage();

	return (
		<div aria-busy="true">
			<span className="sr-only">{copy.propertyDetails.states.loading}</span>
			<Skeleton className="h-5 w-64" />
			<Skeleton className="mt-6 aspect-[4/3] w-full rounded-xl md:aspect-[16/7]" />
			<div className="py-8 sm:py-10">
				<Skeleton className="h-6 w-24 rounded-full" />
				<Skeleton className="mt-4 h-11 w-full max-w-3xl" />
				<Skeleton className="mt-3 h-6 w-72 max-w-full" />
				<div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-4">
					{FACT_SKELETON_IDS.map((id) => (
						<div className="bg-card p-5" key={id}>
							<Skeleton className="size-5" />
							<Skeleton className="mt-4 h-6 w-16" />
							<Skeleton className="mt-2 h-4 w-24" />
						</div>
					))}
				</div>
			</div>
			<div className="grid gap-10 border-t py-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
				<div className="space-y-10">
					<div>
						<Skeleton className="h-8 w-44" />
						<Skeleton className="mt-5 h-5 w-full" />
						<Skeleton className="mt-3 h-5 w-11/12" />
						<Skeleton className="mt-3 h-5 w-4/5" />
					</div>
					<Skeleton className="h-56 w-full rounded-xl" />
				</div>
				<Skeleton className="h-80 w-full rounded-xl" />
			</div>
		</div>
	);
}
