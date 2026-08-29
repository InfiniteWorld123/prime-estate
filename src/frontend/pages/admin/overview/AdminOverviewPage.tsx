import { Link } from "@tanstack/react-router";
import { ArrowRight, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import { useAdminOverviewPage } from "@/frontend/hooks/pages/useAdminOverviewPage";

export function AdminOverviewPage() {
	const page = useAdminOverviewPage();
	const formatDate = (value: Date) =>
		new Intl.DateTimeFormat(page.copy.locale, {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(value));

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

			{page.hasError ? (
				<div className="mt-7 flex flex-col gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
					<p>{page.copy.error}</p>
					<Button
						onClick={() => void page.refetch()}
						size="sm"
						variant="outline"
					>
						<RefreshCw />
						{page.copy.retry}
					</Button>
				</div>
			) : null}

			<section
				className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
				aria-label={page.copy.title}
			>
				{page.isLoading
					? ["properties", "published", "draft", "unread"].map((key) => (
							<Skeleton className="h-28 w-full" key={key} />
						))
					: page.metrics.map((metric) => (
							<article
								className="relative overflow-hidden rounded-lg border bg-background p-5"
								key={metric.label}
							>
								<div
									className="absolute inset-y-0 left-0 w-1 bg-primary"
									aria-hidden="true"
								/>
								<p className="text-sm font-medium text-muted-foreground">
									{metric.label}
								</p>
								<p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">
									{metric.value}
								</p>
							</article>
						))}
			</section>

			<section className="mt-8 overflow-hidden rounded-lg border bg-background">
				<div className="flex items-center justify-between gap-4 border-b px-4 py-4 sm:px-5">
					<div className="flex items-center gap-3">
						<span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
							<Inbox className="size-4" />
						</span>
						<h2 className="font-heading text-lg font-semibold">
							{page.copy.latestInquiries}
						</h2>
					</div>
					<Button asChild size="sm" variant="ghost">
						<Link to="/admin/inquiries">
							{page.copy.inbox}
							<ArrowRight />
						</Link>
					</Button>
				</div>
				{page.isLoading ? (
					<div className="space-y-2 p-4">
						{["one", "two", "three", "four", "five"].map((key) => (
							<Skeleton className="h-16 w-full" key={key} />
						))}
					</div>
				) : page.latestInquiries.length === 0 ? (
					<p className="p-8 text-center text-sm text-muted-foreground">
						{page.copy.empty}
					</p>
				) : (
					<ul className="divide-y">
						{page.latestInquiries.map((inquiry) => (
							<li key={inquiry.id}>
								<Link
									className="flex items-start gap-3 px-4 py-4 outline-none transition-colors hover:bg-muted/35 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-5"
									search={{ inquiry: inquiry.id }}
									to="/admin/inquiries"
								>
									<span
										className={`mt-1 size-2 shrink-0 rounded-full ${inquiry.read_at ? "bg-muted-foreground/30" : "bg-primary"}`}
									/>
									<span className="min-w-0 flex-1">
										<span className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
											<span className="truncate font-medium">
												{inquiry.full_name}
											</span>
											<time className="shrink-0 text-xs text-muted-foreground">
												{formatDate(inquiry.created_at)}
											</time>
										</span>
										<span className="mt-1 line-clamp-1 block text-sm text-muted-foreground">
											{inquiry.inquiry_type === "LISTING"
												? `${page.copy.listing}: ${inquiry.listing?.reference_number ?? "—"}`
												: page.copy.general}{" "}
											· {inquiry.message}
										</span>
									</span>
								</Link>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
