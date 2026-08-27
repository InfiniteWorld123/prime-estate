import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/frontend/components/ui/carousel";
import { PropertyCard } from "@/frontend/features/listings/components/PropertyCard";
import { PropertyCardSkeleton } from "@/frontend/features/listings/components/PropertyCardSkeleton";
import { PropertyResultsError } from "@/frontend/features/listings/components/PropertyResultsError";
import type { PropertyCardListing } from "@/frontend/features/listings/listing.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type LatestPropertiesSectionProps = {
	isError: boolean;
	isLoading: boolean;
	listings: PropertyCardListing[];
	onRetry: () => void;
};

export function LatestPropertiesSection({
	listings,
	isError,
	isLoading,
	onRetry,
}: LatestPropertiesSectionProps) {
	const { copy } = useLanguage();
	return (
		<section
			aria-labelledby="latest-properties-heading"
			className="py-16 sm:py-20"
		>
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<Carousel
					opts={{
						align: "start",
						loop: false,
					}}
				>
					<div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
								{copy.latest.eyebrow}
							</p>

							<h2
								className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
								id="latest-properties-heading"
							>
								{copy.latest.heading}
							</h2>

							<p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
								{copy.latest.description}
							</p>
						</div>

						<div className="flex items-center gap-2">
							<Button
								asChild
								className="mr-2 hidden gap-2 sm:inline-flex"
								variant="ghost"
							>
								<Link to="/properties">
									{copy.latest.browse}
									<ArrowRight aria-hidden="true" />
								</Link>
							</Button>

							<CarouselPrevious className="static translate-y-0" />
							<CarouselNext className="static translate-y-0" />
						</div>
					</div>

					{isError ? (
						<PropertyResultsError onRetry={onRetry} />
					) : (
						<CarouselContent className="-ml-4">
							{isLoading
								? ["latest-1", "latest-2", "latest-3"].map((id) => (
										<CarouselItem
											className="basis-full pl-4 md:basis-1/2 lg:basis-1/3"
											key={id}
										>
											<PropertyCardSkeleton />
										</CarouselItem>
									))
								: listings.map((listing) => (
										<CarouselItem
											className="basis-full pl-4 md:basis-1/2 lg:basis-1/3"
											key={listing.id}
										>
											<PropertyCard listing={listing} />
										</CarouselItem>
									))}
						</CarouselContent>
					)}

					<Button
						asChild
						className="mt-6 w-full gap-2 sm:hidden"
						variant="outline"
					>
						<Link to="/properties">
							{copy.latest.browse}
							<ArrowRight aria-hidden="true" />
						</Link>
					</Button>
				</Carousel>
			</div>
		</section>
	);
}
