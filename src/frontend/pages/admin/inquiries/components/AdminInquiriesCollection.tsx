import { Mail, MailOpen } from "lucide-react";
import type {
	InquiryLeadStatusType,
	InquiryType,
} from "#/shared/types/inquiry.type";
import { Button } from "@/frontend/components/ui/button";
import { cn } from "@/frontend/lib/utils";
import type { AdminInquiriesCopy } from "../admin-inquiries.copy";

type Props = {
	copy: AdminInquiriesCopy;
	items: InquiryType[];
	onOpen: (id: string) => void;
};

const statusClass: Record<InquiryLeadStatusType, string> = {
	NEW: "border-primary/25 bg-primary/8 text-primary",
	CONTACTED:
		"border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300",
	CLOSED: "border-border bg-muted text-muted-foreground",
};

const formatDate = (value: Date, locale: string) =>
	new Intl.DateTimeFormat(locale, {
		dateStyle: "medium",
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

export function AdminInquiriesCollection({ copy, items, onOpen }: Props) {
	return (
		<>
			<div className="hidden overflow-hidden rounded-lg border bg-background md:block">
				<table className="w-full table-fixed text-left text-sm">
					<thead className="border-b bg-muted/45 text-xs uppercase tracking-[0.08em] text-muted-foreground">
						<tr>
							<th className="w-12 px-4 py-3">
								<span className="sr-only">{copy.read}</span>
							</th>
							<th className="w-[22%] px-3 py-3">{copy.contact}</th>
							<th className="px-3 py-3">{copy.message}</th>
							<th className="w-[18%] px-3 py-3">{copy.type}</th>
							<th className="w-36 px-3 py-3">{copy.status}</th>
							<th className="w-44 px-4 py-3">{copy.createdAt}</th>
						</tr>
					</thead>
					<tbody className="divide-y">
						{items.map((inquiry) => (
							<tr
								className={cn(
									"hover:bg-muted/30",
									!inquiry.read_at && "bg-primary/[0.035]",
								)}
								key={inquiry.id}
							>
								<td className="px-4 py-4 text-muted-foreground">
									{inquiry.read_at ? (
										<MailOpen className="size-4" />
									) : (
										<Mail className="size-4 text-primary" />
									)}
								</td>
								<td className="px-3 py-4">
									<button
										className="w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
										onClick={() => onOpen(inquiry.id)}
										type="button"
									>
										<span
											className={cn(
												"block truncate",
												!inquiry.read_at && "font-semibold",
											)}
										>
											{inquiry.full_name}
										</span>
										<span className="mt-1 block truncate text-xs text-muted-foreground">
											{inquiry.email}
										</span>
									</button>
								</td>
								<td className="px-3 py-4">
									<button
										className="line-clamp-2 w-full text-left leading-5 text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
										onClick={() => onOpen(inquiry.id)}
										type="button"
									>
										{inquiry.message}
									</button>
								</td>
								<td className="px-3 py-4 text-xs">
									<p className="font-medium">
										{inquiry.inquiry_type === "LISTING"
											? copy.listing
											: copy.general}
									</p>
									<p className="mt-1 truncate text-muted-foreground">
										{inquiry.listing?.reference_number ??
											(inquiry.interest ? inquiry.interest : "—")}
									</p>
								</td>
								<td className="px-3 py-4">
									<span
										className={cn(
											"inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
											statusClass[inquiry.lead_status],
										)}
									>
										{statusLabel(inquiry.lead_status, copy)}
									</span>
								</td>
								<td className="px-4 py-4 text-xs text-muted-foreground">
									{formatDate(inquiry.created_at, copy.locale)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="grid gap-3 md:hidden">
				{items.map((inquiry) => (
					<Button
						className={cn(
							"h-auto w-full items-start justify-start whitespace-normal border bg-background p-4 text-left text-foreground",
							!inquiry.read_at && "border-primary/25 bg-primary/[0.035]",
						)}
						key={inquiry.id}
						onClick={() => onOpen(inquiry.id)}
						variant="outline"
					>
						<span className="flex w-full min-w-0 gap-3">
							{inquiry.read_at ? (
								<MailOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
							) : (
								<Mail className="mt-0.5 size-4 shrink-0 text-primary" />
							)}
							<span className="min-w-0 flex-1">
								<span className="flex items-start justify-between gap-3">
									<span
										className={cn(
											"truncate",
											!inquiry.read_at && "font-semibold",
										)}
									>
										{inquiry.full_name}
									</span>
									<span className="shrink-0 text-xs text-muted-foreground">
										{formatDate(inquiry.created_at, copy.locale)}
									</span>
								</span>
								<span className="mt-2 line-clamp-2 block text-sm font-normal leading-5 text-muted-foreground">
									{inquiry.message}
								</span>
								<span className="mt-3 flex flex-wrap items-center gap-2 text-xs">
									<span
										className={cn(
											"rounded-full border px-2 py-0.5 font-semibold",
											statusClass[inquiry.lead_status],
										)}
									>
										{statusLabel(inquiry.lead_status, copy)}
									</span>
									<span className="text-muted-foreground">
										{inquiry.inquiry_type === "LISTING"
											? inquiry.listing?.reference_number
											: copy.general}
									</span>
								</span>
							</span>
						</span>
					</Button>
				))}
			</div>
		</>
	);
}
