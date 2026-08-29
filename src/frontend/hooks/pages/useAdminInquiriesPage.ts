import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import type {
	InquiryArchiveStatusType,
	InquiryInterestType,
	InquiryLeadStatusType,
	InquirySortType,
	InquiryTypeType,
	ListInquiriesQueryType,
} from "#/shared/types/inquiry.type";
import { ApiRequestError } from "@/frontend/api/utils";
import type { AdminInquiriesSearch } from "@/frontend/features/inquiries/admin-inquiry.types";
import { useAdminInquiriesQuery } from "@/frontend/features/inquiries/hooks/useAdminInquiriesQuery";
import { useAdminInquiryQuery } from "@/frontend/features/inquiries/hooks/useAdminInquiryQuery";
import {
	useArchiveInquiryMutation,
	useMarkInquiryReadMutation,
	useUnarchiveInquiryMutation,
	useUpdateInquiryStatusMutation,
} from "@/frontend/features/inquiries/hooks/useInquiryMutations";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { adminInquiriesCopy } from "@/frontend/pages/admin/inquiries/admin-inquiries.copy";

const toApiQuery = (search: AdminInquiriesSearch): ListInquiriesQueryType => ({
	archive_status: search.archive ?? "active",
	inquiry_type: search.type,
	interest: search.interest,
	lead_status: search.status,
	listing_id: search.listingId,
	page: search.page ?? 1,
	page_size: search.pageSize ?? 20,
	sort: search.sort ?? "newest",
	unread: search.unread,
});

export function useAdminInquiriesPage() {
	const { language } = useLanguage();
	const copy = adminInquiriesCopy[language];
	const search = useSearch({ from: "/admin/inquiries" });
	const navigate = useNavigate({ from: "/admin/inquiries" });
	const apiQuery = useMemo(() => toApiQuery(search), [search]);
	const inquiriesQuery = useAdminInquiriesQuery(apiQuery);
	const detailQuery = useAdminInquiryQuery(search.inquiry ?? null);
	const markReadMutation = useMarkInquiryReadMutation();
	const statusMutation = useUpdateInquiryStatusMutation();
	const archiveMutation = useArchiveInquiryMutation();
	const unarchiveMutation = useUnarchiveInquiryMutation();

	useEffect(() => {
		const inquiry = detailQuery.data;
		if (!inquiry || inquiry.read_at || markReadMutation.isPending) return;
		markReadMutation.mutate(inquiry.id);
	}, [detailQuery.data, markReadMutation]);

	useEffect(() => {
		const totalPages = inquiriesQuery.data?.total_pages;
		if (!totalPages || !search.page || search.page <= totalPages) return;
		void navigate({
			replace: true,
			search: (current) => ({ ...current, page: totalPages }),
		});
	}, [inquiriesQuery.data?.total_pages, navigate, search.page]);

	const setSearch = (patch: Partial<AdminInquiriesSearch>, resetPage = true) =>
		void navigate({
			search: (current) => ({
				...current,
				...patch,
				...(resetPage ? { page: undefined } : {}),
			}),
		});

	const resetMutationErrors = () => {
		statusMutation.reset();
		archiveMutation.reset();
		unarchiveMutation.reset();
	};

	const loadError = inquiriesQuery.error;
	const detailError = detailQuery.error;
	const mutationError =
		statusMutation.error ?? archiveMutation.error ?? unarchiveMutation.error;
	const hasAuthorizationError = [loadError, detailError, mutationError].some(
		(error) =>
			error instanceof ApiRequestError &&
			(error.status === 401 || error.status === 403),
	);

	return {
		archive: search.archive ?? "active",
		archiveInquiry: async (id: string) => {
			resetMutationErrors();
			await archiveMutation.mutateAsync(id);
		},
		closeDetail: () => setSearch({ inquiry: undefined }, false),
		copy,
		currentPage: inquiriesQuery.data?.page ?? search.page ?? 1,
		detail: detailQuery.data ?? null,
		detailError: detailQuery.error?.message ?? null,
		hasAuthorizationError,
		interest: search.interest,
		isDetailLoading: detailQuery.isPending && Boolean(search.inquiry),
		isDetailOpen: Boolean(search.inquiry),
		isInitialLoading: inquiriesQuery.isPending,
		isMarkingRead: markReadMutation.isPending,
		isMutationPending:
			statusMutation.isPending ||
			archiveMutation.isPending ||
			unarchiveMutation.isPending,
		isUpdating: inquiriesQuery.isFetching && !inquiriesQuery.isPending,
		items: inquiriesQuery.data?.items ?? [],
		listingId: search.listingId ?? "",
		loadError: inquiriesQuery.error?.message ?? null,
		mutationError: mutationError ? copy.mutationError : null,
		openDetail: (id: string) => {
			resetMutationErrors();
			setSearch({ inquiry: id }, false);
		},
		pageSize: search.pageSize ?? 20,
		refetch: inquiriesQuery.refetch,
		refetchDetail: detailQuery.refetch,
		resetFilters: () => void navigate({ search: {} }),
		restoreInquiry: async (id: string) => {
			resetMutationErrors();
			await unarchiveMutation.mutateAsync(id);
		},
		setArchive: (archive: InquiryArchiveStatusType) =>
			setSearch({ archive: archive === "active" ? undefined : archive }),
		setInterest: (interest: InquiryInterestType | undefined) =>
			setSearch({ interest }),
		setListingId: (listingId: string) =>
			setSearch({ listingId: listingId.trim() || undefined }),
		setPage: (page: number) => setSearch({ page }, false),
		setPageSize: (pageSize: 20 | 50 | 100) =>
			setSearch({ pageSize: pageSize === 20 ? undefined : pageSize }),
		setSort: (sort: InquirySortType) =>
			setSearch({ sort: sort === "newest" ? undefined : sort }),
		setStatus: (status: InquiryLeadStatusType | undefined) =>
			setSearch({ status }),
		setType: (type: InquiryTypeType | undefined) => setSearch({ type }),
		setUnread: (unread: boolean | undefined) => setSearch({ unread }),
		sort: search.sort ?? "newest",
		status: search.status,
		totalItems: inquiriesQuery.data?.total_items ?? 0,
		totalPages: Math.max(1, inquiriesQuery.data?.total_pages ?? 1),
		type: search.type,
		unread: search.unread,
		updateStatus: async (id: string, leadStatus: InquiryLeadStatusType) => {
			resetMutationErrors();
			await statusMutation.mutateAsync({
				inquiryId: id,
				input: { lead_status: leadStatus },
			});
		},
	};
}
