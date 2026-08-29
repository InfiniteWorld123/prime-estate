import { createFileRoute } from "@tanstack/react-router";
import type {
	InquiryArchiveStatusType,
	InquiryInterestType,
	InquiryLeadStatusType,
	InquirySortType,
	InquiryTypeType,
} from "#/shared/types/inquiry.type";
import type { AdminInquiriesSearch } from "@/frontend/features/inquiries/admin-inquiry.types";
import { AdminInquiriesPage } from "@/frontend/pages/admin/inquiries/AdminInquiriesPage";

const oneOf = <Value extends string>(
	values: readonly Value[],
	value: unknown,
) =>
	typeof value === "string" && values.includes(value as Value)
		? (value as Value)
		: undefined;
const positiveInteger = (value: unknown) => {
	const parsed = typeof value === "number" ? value : Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};
const optionalString = (value: unknown) =>
	typeof value === "string" && value.trim() ? value.trim() : undefined;

export const Route = createFileRoute("/admin/inquiries")({
	component: AdminInquiriesPage,
	validateSearch: (raw: Record<string, unknown>): AdminInquiriesSearch => {
		const pageSize = positiveInteger(raw.pageSize);
		return {
			archive: oneOf<InquiryArchiveStatusType>(
				["active", "archived", "all"],
				raw.archive,
			),
			inquiry: optionalString(raw.inquiry),
			interest: oneOf<InquiryInterestType>(
				["BUYING", "RENTING", "GENERAL"],
				raw.interest,
			),
			listingId: optionalString(raw.listingId),
			page: positiveInteger(raw.page),
			pageSize:
				pageSize === 20 || pageSize === 50 || pageSize === 100
					? pageSize
					: undefined,
			sort: oneOf<InquirySortType>(["newest", "oldest"], raw.sort),
			status: oneOf<InquiryLeadStatusType>(
				["NEW", "CONTACTED", "CLOSED"],
				raw.status,
			),
			type: oneOf<InquiryTypeType>(["GENERAL", "LISTING"], raw.type),
			unread:
				raw.unread === true || raw.unread === "true"
					? true
					: raw.unread === false || raw.unread === "false"
						? false
						: undefined,
		};
	},
});
