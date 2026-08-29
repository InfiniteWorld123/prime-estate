import { useEffect, useState } from "react";
import type {
	InquiryArchiveStatusType,
	InquiryInterestType,
	InquiryLeadStatusType,
	InquirySortType,
	InquiryTypeType,
} from "#/shared/types/inquiry.type";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import type { AdminInquiriesCopy } from "../admin-inquiries.copy";

type Props = {
	archive: InquiryArchiveStatusType;
	copy: AdminInquiriesCopy;
	interest?: InquiryInterestType;
	listingId: string;
	onArchiveChange: (value: InquiryArchiveStatusType) => void;
	onInterestChange: (value: InquiryInterestType | undefined) => void;
	onListingIdChange: (value: string) => void;
	onReset: () => void;
	onSortChange: (value: InquirySortType) => void;
	onStatusChange: (value: InquiryLeadStatusType | undefined) => void;
	onTypeChange: (value: InquiryTypeType | undefined) => void;
	onUnreadChange: (value: boolean | undefined) => void;
	sort: InquirySortType;
	status?: InquiryLeadStatusType;
	type?: InquiryTypeType;
	unread?: boolean;
};

const optional = <Value extends string>(value: string) =>
	value === "ALL" ? undefined : (value as Value);

export function AdminInquiriesToolbar(props: Props) {
	const [listingId, setListingId] = useState(props.listingId);
	useEffect(() => setListingId(props.listingId), [props.listingId]);

	return (
		<section className="mt-7 rounded-lg border bg-background p-3 sm:p-4">
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<Select
					onValueChange={(value) =>
						props.onArchiveChange(value as InquiryArchiveStatusType)
					}
					value={props.archive}
				>
					<SelectTrigger
						aria-label={props.copy.archiveStatus}
						className="w-full"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="active">{props.copy.inbox}</SelectItem>
						<SelectItem value="archived">{props.copy.archived}</SelectItem>
						<SelectItem value="all">{props.copy.all}</SelectItem>
					</SelectContent>
				</Select>
				<Select
					onValueChange={(value) =>
						props.onStatusChange(optional<InquiryLeadStatusType>(value))
					}
					value={props.status ?? "ALL"}
				>
					<SelectTrigger aria-label={props.copy.status} className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">{props.copy.all}</SelectItem>
						<SelectItem value="NEW">{props.copy.new}</SelectItem>
						<SelectItem value="CONTACTED">{props.copy.contacted}</SelectItem>
						<SelectItem value="CLOSED">{props.copy.closed}</SelectItem>
					</SelectContent>
				</Select>
				<Select
					onValueChange={(value) =>
						props.onTypeChange(optional<InquiryTypeType>(value))
					}
					value={props.type ?? "ALL"}
				>
					<SelectTrigger aria-label={props.copy.type} className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">{props.copy.all}</SelectItem>
						<SelectItem value="GENERAL">{props.copy.general}</SelectItem>
						<SelectItem value="LISTING">{props.copy.listing}</SelectItem>
					</SelectContent>
				</Select>
				<Select
					onValueChange={(value) =>
						props.onUnreadChange(
							value === "ALL" ? undefined : value === "UNREAD",
						)
					}
					value={
						props.unread === undefined
							? "ALL"
							: props.unread
								? "UNREAD"
								: "READ"
					}
				>
					<SelectTrigger aria-label={props.copy.unread} className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">{props.copy.all}</SelectItem>
						<SelectItem value="UNREAD">{props.copy.unreadOnly}</SelectItem>
						<SelectItem value="READ">{props.copy.readOnly}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<details className="mt-3 border-t pt-3">
				<summary className="cursor-pointer text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
					{props.copy.interest} · {props.copy.filterListing} · {props.copy.sort}
				</summary>
				<div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					<Select
						onValueChange={(value) =>
							props.onInterestChange(optional<InquiryInterestType>(value))
						}
						value={props.interest ?? "ALL"}
					>
						<SelectTrigger aria-label={props.copy.interest} className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="ALL">{props.copy.all}</SelectItem>
							<SelectItem value="BUYING">{props.copy.buying}</SelectItem>
							<SelectItem value="RENTING">{props.copy.renting}</SelectItem>
							<SelectItem value="GENERAL">{props.copy.general}</SelectItem>
						</SelectContent>
					</Select>
					<Input
						aria-label={props.copy.filterListing}
						onBlur={() => props.onListingIdChange(listingId)}
						onChange={(event) => setListingId(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") props.onListingIdChange(listingId);
						}}
						placeholder={props.copy.filterListing}
						value={listingId}
					/>
					<Select onValueChange={props.onSortChange} value={props.sort}>
						<SelectTrigger aria-label={props.copy.sort} className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">{props.copy.newest}</SelectItem>
							<SelectItem value="oldest">{props.copy.oldest}</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Button
					className="mt-3"
					onClick={props.onReset}
					size="sm"
					variant="ghost"
				>
					{props.copy.reset}
				</Button>
			</details>
		</section>
	);
}
