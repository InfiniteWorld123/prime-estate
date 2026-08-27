import type * as v from "valibot";
import type {
	CreateInquirySchema,
	InquiryParamsSchema,
	ListInquiriesQuerySchema,
	UpdateInquiryStatusSchema,
} from "../validation/inquiry.validation";

export type InquiryTypeType = "GENERAL" | "LISTING";
export type InquiryInterestType = "BUYING" | "RENTING" | "GENERAL";
export type InquiryLeadStatusType = "NEW" | "CONTACTED" | "CLOSED";
export type InquiryArchiveStatusType = "active" | "archived" | "all";

export type CreateInquiryBodyType = v.InferInput<typeof CreateInquirySchema>;
export type CreateInquiryDataType = v.InferOutput<typeof CreateInquirySchema>;
export type InquiryParamsType = v.InferInput<typeof InquiryParamsSchema>;
export type ListInquiriesQueryType = v.InferOutput<
	typeof ListInquiriesQuerySchema
>;
export type ListInquiriesDataType = v.InferOutput<
	typeof ListInquiriesQuerySchema
>;
export type UpdateInquiryStatusBodyType = v.InferInput<
	typeof UpdateInquiryStatusSchema
>;
export type UpdateInquiryStatusDataType = v.InferOutput<
	typeof UpdateInquiryStatusSchema
>;

export type InquirySortType = NonNullable<ListInquiriesDataType["sort"]>;
export type InquiryFiltersType = Omit<
	ListInquiriesDataType,
	"page" | "page_size" | "sort"
>;

export type InquiryListingSummaryType = {
	id: string;
	title: string;
	slug: string;
	reference_number: string;
	listing_type: "SALE" | "RENT";
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	archive_outcome: "SOLD" | "RENTED" | "WITHDRAWN" | null;
	is_available: boolean;
};

export type InquiryType = {
	id: string;
	inquiry_type: InquiryTypeType;
	interest: InquiryInterestType | null;
	full_name: string;
	email: string;
	phone: string | null;
	message: string;
	lead_status: InquiryLeadStatusType;
	read_at: Date | null;
	archived_at: Date | null;
	privacy_policy_version: string;
	privacy_accepted_at: Date;
	listing: InquiryListingSummaryType | null;
	created_at: Date;
	updated_at: Date;
};

export type InquiriesPageType = {
	items: InquiryType[];
	page: number;
	page_size: number;
	total_items: number;
	total_pages: number;
	has_previous_page: boolean;
	has_next_page: boolean;
	sort: InquirySortType;
	filters: InquiryFiltersType;
};

export type CreateInquiryResultType = {
	received: true;
};
