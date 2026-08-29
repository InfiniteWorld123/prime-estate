import { useAdminInquiriesQuery } from "@/frontend/features/inquiries/hooks/useAdminInquiriesQuery";
import { useAdminListingsQuery } from "@/frontend/features/listings/hooks/useAdminListingsQuery";
import { useAdminPropertiesQuery } from "@/frontend/features/properties/hooks/useAdminPropertiesQuery";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { adminOverviewCopy } from "@/frontend/pages/admin/overview/admin-overview.copy";

export function useAdminOverviewPage() {
	const { language } = useLanguage();
	const copy = adminOverviewCopy[language];
	const properties = useAdminPropertiesQuery({
		archive_status: "active",
		page: 1,
		page_size: 1,
		sort: "newest",
	});
	const publishedListings = useAdminListingsQuery({
		page: 1,
		page_size: 1,
		sort: "newest",
		status: "PUBLISHED",
	});
	const draftListings = useAdminListingsQuery({
		page: 1,
		page_size: 1,
		sort: "newest",
		status: "DRAFT",
	});
	const inquiries = useAdminInquiriesQuery({
		archive_status: "active",
		page: 1,
		page_size: 5,
		sort: "newest",
	});
	const unreadInquiries = useAdminInquiriesQuery({
		archive_status: "active",
		page: 1,
		page_size: 1,
		sort: "newest",
		unread: true,
	});
	const queries = [
		properties,
		publishedListings,
		draftListings,
		inquiries,
		unreadInquiries,
	];

	return {
		copy,
		hasError: queries.some((query) => query.isError),
		isLoading: queries.some((query) => query.isPending),
		latestInquiries: inquiries.data?.items ?? [],
		metrics: [
			{
				label: copy.activeProperties,
				value: properties.data?.total_items ?? 0,
			},
			{
				label: copy.publishedListings,
				value: publishedListings.data?.total_items ?? 0,
			},
			{
				label: copy.draftListings,
				value: draftListings.data?.total_items ?? 0,
			},
			{
				label: copy.unreadInquiries,
				value: unreadInquiries.data?.total_items ?? 0,
			},
		],
		refetch: async () => {
			await Promise.all(queries.map((query) => query.refetch()));
		},
	};
}
