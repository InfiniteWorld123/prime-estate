import { Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	ArrowRight,
	Building2,
	Check,
	House,
	ImageOff,
	Search,
} from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { useSelectListingPropertyPage } from "@/frontend/hooks/pages/useSelectListingPropertyPage";
import { cn } from "@/frontend/lib/utils";

export function SelectListingPropertyPage() {
	const page = useSelectListingPropertyPage();
	const selectedProperty = page.properties.find(
		(property) => property.id === page.selectedPropertyId,
	);

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<header className="max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
					{page.copy.administration}
				</p>
				<h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
					{page.copy.title}
				</h1>
				<p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
					{page.copy.subtitle}
				</p>
			</header>

			<div className="relative mt-7 max-w-xl">
				<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					className="pl-9"
					onChange={(event) => page.setSearch(event.target.value)}
					placeholder={page.copy.search}
					type="search"
					value={page.search}
				/>
			</div>

			{page.properties.length === 0 ? (
				<div className="mt-5 grid min-h-64 place-items-center rounded-lg border bg-background p-6 text-center text-sm text-muted-foreground">
					{page.copy.empty}
				</div>
			) : (
				<div className="mt-5 grid gap-3 md:grid-cols-2">
					{page.properties.map((property) => {
						const availability = page.getAvailability(property.id);
						const canSelect = availability.sale || availability.rent;
						const isSelected = property.id === page.selectedPropertyId;
						const TypeIcon =
							property.propertyType === "HOUSE" ? House : Building2;
						return (
							<button
								aria-pressed={isSelected}
								className={cn(
									"relative flex w-full gap-4 rounded-lg border bg-background p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									canSelect &&
										"hover:border-primary/45 hover:bg-primary/[0.025]",
									isSelected &&
										"border-primary bg-primary/5 ring-1 ring-primary",
									!canSelect && "cursor-not-allowed opacity-60",
								)}
								disabled={!canSelect}
								key={property.id}
								onClick={() => page.setSelectedPropertyId(property.id)}
								type="button"
							>
								{property.coverImage ? (
									<img
										alt=""
										className="h-24 w-28 shrink-0 rounded-md object-cover"
										src={property.coverImage}
									/>
								) : (
									<div
										aria-label={page.copy.missingImage}
										className="grid h-24 w-28 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground"
										role="img"
									>
										<ImageOff className="size-5" />
									</div>
								)}
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-2">
										<p className="font-mono text-xs font-semibold text-primary">
											{property.referenceNumber}
										</p>
										{isSelected ? (
											<span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
												<Check className="size-3.5" />
											</span>
										) : null}
									</div>
									<p className="mt-2 flex items-center gap-1.5 text-sm font-semibold">
										<TypeIcon className="size-4 text-muted-foreground" />
										{property.propertyType === "HOUSE"
											? page.copy.house
											: page.copy.apartment}
									</p>
									<p className="mt-1 truncate text-sm text-muted-foreground">
										{property.streetName} {property.houseNumber},{" "}
										{property.postalCode} {property.city}
									</p>
									<div className="mt-3 flex flex-wrap gap-2 text-xs">
										{(["sale", "rent"] as const).map((type) => {
											const available = availability[type];
											return (
												<span
													className={cn(
														"rounded-full border px-2 py-1",
														available
															? "border-emerald-600/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300"
															: "bg-muted text-muted-foreground",
													)}
													key={type}
												>
													{type === "sale" ? page.copy.sale : page.copy.rent}:{" "}
													{available
														? page.copy.available
														: page.copy.activeListing}
												</span>
											);
										})}
									</div>
									{!canSelect ? (
										<p className="mt-2 text-xs text-muted-foreground">
											{page.copy.noTypeAvailable}
										</p>
									) : null}
								</div>
							</button>
						);
					})}
				</div>
			)}

			<footer className="mt-7 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
				<Button asChild variant="outline">
					<Link to="/admin/listings">
						<ArrowLeft />
						{page.copy.back}
					</Link>
				</Button>
				<Button
					asChild={Boolean(selectedProperty)}
					disabled={!selectedProperty}
				>
					{selectedProperty ? (
						<Link
							params={{ propertyId: selectedProperty.id }}
							to="/admin/properties/$propertyId/listings/new"
						>
							{page.copy.continue}
							<ArrowRight />
						</Link>
					) : (
						<span>{page.copy.continue}</span>
					)}
				</Button>
			</footer>
		</div>
	);
}
