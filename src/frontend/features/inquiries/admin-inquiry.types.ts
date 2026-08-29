import type {
	InquiryArchiveStatusType,
	InquiryInterestType,
	InquiryLeadStatusType,
	InquirySortType,
	InquiryTypeType,
} from "#/shared/types/inquiry.type";

export type AdminInquiriesSearch = {
	archive?: InquiryArchiveStatusType;
	inquiry?: string;
	interest?: InquiryInterestType;
	listingId?: string;
	page?: number;
	pageSize?: 20 | 50 | 100;
	sort?: InquirySortType;
	status?: InquiryLeadStatusType;
	type?: InquiryTypeType;
	unread?: boolean;
};
