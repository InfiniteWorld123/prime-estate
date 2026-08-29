import { Link } from "@tanstack/react-router";
import { Archive, LoaderCircle, RefreshCw, RotateCcw } from "lucide-react";
import type {
	InquiryLeadStatusType,
	InquiryType,
} from "#/shared/types/inquiry.type";
import { Button } from "@/frontend/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/frontend/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import type { AdminInquiriesCopy } from "../admin-inquiries.copy";

type Props = {
	copy: AdminInquiriesCopy;
	detail: InquiryType | null;
	error: string | null;
	isLoading: boolean;
	isMarkingRead: boolean;
	isOpen: boolean;
	isPending: boolean;
	mutationError: string | null;
	onArchive: (id: string) => Promise<void>;
	onClose: () => void;
	onRestore: (id: string) => Promise<void>;
	onRetry: () => unknown;
	onStatusChange: (id: string, status: InquiryLeadStatusType) => Promise<void>;
};

const allowedStatuses: Record<InquiryLeadStatusType, InquiryLeadStatusType[]> =
	{
		NEW: ["NEW", "CONTACTED", "CLOSED"],
		CONTACTED: ["CONTACTED", "CLOSED"],
		CLOSED: ["CLOSED", "CONTACTED"],
	};

const formatDate = (value: Date, locale: string) =>
	new Intl.DateTimeFormat(locale, {
		dateStyle: "long",
		timeStyle: "short",
	}).format(new Date(value));

const statusLabel = (
	status: InquiryLeadStatusType,
	copy: AdminInquiriesCopy,
) =>
	status === "NEW"
		? copy.new
		: status === "CONTACTED"
			? copy.contacted
			: copy.closed;

export function AdminInquiryDetailDialog(props: Props) {
	const inquiry = props.detail;
	return (
		<Dialog
			open={props.isOpen}
			onOpenChange={(open) => {
				if (!open) props.onClose();
			}}
		>
			<DialogContent
				className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl"
				closeLabel={props.copy.close}
			>
				<DialogHeader>
					<DialogTitle className="text-xl">{props.copy.detail}</DialogTitle>
					<DialogDescription>
						{inquiry
							? `${inquiry.full_name} · ${formatDate(inquiry.created_at, props.copy.locale)}`
							: props.copy.description}
					</DialogDescription>
				</DialogHeader>

				{props.isLoading ? (
					<output className="space-y-4 py-3" aria-label={props.copy.loading}>
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-36 w-full" />
						<Skeleton className="h-24 w-full" />
					</output>
				) : props.error ? (
					<div className="rounded-lg border border-destructive/20 bg-destructive/5 p-5 text-center">
						<p className="text-sm text-destructive">{props.error}</p>
						<Button
							className="mt-4"
							onClick={() => void props.onRetry()}
							variant="outline"
						>
							<RefreshCw />
							{props.copy.retry}
						</Button>
					</div>
				) : inquiry ? (
					<div className="space-y-5">
						{props.isMarkingRead ? (
							<p className="text-xs text-muted-foreground" aria-live="polite">
								{props.copy.markingRead}
							</p>
						) : null}
						<section className="grid gap-4 rounded-lg border bg-muted/25 p-4 sm:grid-cols-2">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
									{props.copy.email}
								</p>
								<a
									className="mt-1 block break-all font-medium text-primary underline underline-offset-4"
									href={`mailto:${inquiry.email}`}
								>
									{inquiry.email}
								</a>
							</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
									{props.copy.phone}
								</p>
								{inquiry.phone ? (
									<a
										className="mt-1 block font-medium text-primary underline underline-offset-4"
										href={`tel:${inquiry.phone}`}
									>
										{inquiry.phone}
									</a>
								) : (
									<p className="mt-1 text-muted-foreground">
										{props.copy.noPhone}
									</p>
								)}
							</div>
						</section>

						<section>
							<h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
								{props.copy.message}
							</h2>
							<p className="mt-2 whitespace-pre-wrap rounded-lg border bg-background p-4 leading-7">
								{inquiry.message}
							</p>
						</section>

						{inquiry.listing ? (
							<section className="rounded-lg border p-4">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
											{props.copy.listing}
										</p>
										<p className="mt-1 font-semibold">
											{inquiry.listing.title}
										</p>
										<p className="mt-1 text-sm text-muted-foreground">
											{props.copy.listingReference}:{" "}
											{inquiry.listing.reference_number}
										</p>
										{!inquiry.listing.is_available ? (
											<p className="mt-2 text-sm font-medium text-amber-700 dark:text-amber-300">
												{props.copy.unavailableListing}
											</p>
										) : null}
									</div>
									<Button asChild size="sm" variant="outline">
										<Link
											params={{ listingId: inquiry.listing.id }}
											to="/admin/listings/$listingId"
										>
											{props.copy.listing}
										</Link>
									</Button>
								</div>
							</section>
						) : inquiry.interest ? (
							<section className="rounded-lg border p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
									{props.copy.interest}
								</p>
								<p className="mt-1 font-medium">
									{inquiry.interest === "BUYING"
										? props.copy.buying
										: inquiry.interest === "RENTING"
											? props.copy.renting
											: props.copy.general}
								</p>
							</section>
						) : null}

						<section className="grid gap-4 border-t pt-5 sm:grid-cols-2">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
									{props.copy.privacy}
								</p>
								<p className="mt-1 text-sm leading-6">
									{props.copy.privacyAccepted(
										inquiry.privacy_policy_version,
										formatDate(inquiry.privacy_accepted_at, props.copy.locale),
									)}
								</p>
							</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
									{props.copy.createdAt}
								</p>
								<p className="mt-1 text-sm">
									{formatDate(inquiry.created_at, props.copy.locale)}
								</p>
								{inquiry.archived_at ? (
									<p className="mt-1 text-sm text-muted-foreground">
										{props.copy.archivedAt}:{" "}
										{formatDate(inquiry.archived_at, props.copy.locale)}
									</p>
								) : null}
							</div>
						</section>

						<div className="border-t pt-5">
							<label className="text-sm font-medium" htmlFor="inquiry-status">
								{props.copy.status}
							</label>
							<Select
								disabled={props.isPending}
								value={inquiry.lead_status}
								onValueChange={(value) =>
									void props
										.onStatusChange(inquiry.id, value as InquiryLeadStatusType)
										.catch(() => undefined)
								}
							>
								<SelectTrigger
									className="mt-2 w-full sm:w-56"
									id="inquiry-status"
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{allowedStatuses[inquiry.lead_status].map((status) => (
										<SelectItem key={status} value={status}>
											{statusLabel(status, props.copy)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{props.mutationError ? (
								<p className="mt-3 text-sm text-destructive" role="alert">
									{props.mutationError}
								</p>
							) : null}
						</div>
					</div>
				) : null}

				{inquiry ? (
					<DialogFooter>
						<Button onClick={props.onClose} variant="outline">
							{props.copy.close}
						</Button>
						{inquiry.archived_at ? (
							<Button
								disabled={props.isPending}
								onClick={() =>
									void props.onRestore(inquiry.id).catch(() => undefined)
								}
							>
								<RotateCcw />
								{props.isPending ? props.copy.saving : props.copy.restore}
							</Button>
						) : (
							<Button
								disabled={props.isPending}
								onClick={() =>
									void props.onArchive(inquiry.id).catch(() => undefined)
								}
								variant="outline"
							>
								{props.isPending ? (
									<LoaderCircle className="animate-spin motion-reduce:animate-none" />
								) : (
									<Archive />
								)}
								{props.isPending ? props.copy.saving : props.copy.archive}
							</Button>
						)}
					</DialogFooter>
				) : null}
			</DialogContent>
		</Dialog>
	);
}
