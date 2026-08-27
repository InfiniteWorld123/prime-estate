import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useBlocker, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

import {
	useCreateFeatureMutation,
	useFeatureOptionsQuery,
	usePropertyFeaturesQuery,
	useReplacePropertyFeaturesMutation,
} from "@/frontend/features/properties/hooks/usePropertyFeatures";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { propertySetupCopy } from "@/frontend/pages/admin/properties/setup/property-setup.copy";

export type PropertyFeatureOption = { code: string; id: string; name: string };

export function usePropertyFeaturesSetupPage() {
	const { language } = useLanguage();
	const copy = propertySetupCopy[language];
	const { propertyId } = useParams({ strict: false }) as { propertyId: string };
	const navigate = useNavigate();
	const allowNavigationRef = useRef(false);
	const featureOptionsQuery = useFeatureOptionsQuery();
	const propertyFeaturesQuery = usePropertyFeaturesQuery(propertyId);
	const createFeatureMutation = useCreateFeatureMutation();
	const replaceFeaturesMutation = useReplacePropertyFeaturesMutation();
	const catalog: PropertyFeatureOption[] =
		featureOptionsQuery.data?.map(({ code, id, name }) => ({
			code,
			id,
			name,
		})) ?? [];
	const serverSelectedIds = useMemo(
		() =>
			new Set(propertyFeaturesQuery.data?.map((feature) => feature.id) ?? []),
		[propertyFeaturesQuery.data],
	);
	const [selectedIds, setSelectedIds] = useState<Set<string> | null>(null);
	const currentSelectedIds = selectedIds ?? serverSelectedIds;
	const [search, setSearch] = useState("");
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [createOpen, setCreateOpen] = useState(false);
	const [createConflict, setCreateConflict] = useState(false);

	const createForm = useForm({
		defaultValues: { name: "" },
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmit: async ({ value }) => {
			setCreateConflict(false);
			createFeatureMutation.reset();
			const normalized = value.name.trim().toLocaleLowerCase();
			if (
				catalog.some(
					(feature) => feature.name.toLocaleLowerCase() === normalized,
				)
			) {
				setCreateConflict(true);
				return;
			}
			try {
				const feature = await createFeatureMutation.mutateAsync(
					value.name.trim(),
				);
				setSelectedIds(
					(current) => new Set([...(current ?? serverSelectedIds), feature.id]),
				);
				createForm.reset();
				setCreateOpen(false);
			} catch {
				// The mutation message is rendered in the create dialog.
			}
		},
	});

	const filteredFeatures = useMemo(() => {
		const query = search.trim().toLocaleLowerCase();
		if (!query) return catalog;
		return catalog.filter((feature) =>
			`${feature.name} ${feature.code}`.toLocaleLowerCase().includes(query),
		);
	}, [catalog, search]);

	const isDirty =
		currentSelectedIds.size !== serverSelectedIds.size ||
		[...currentSelectedIds].some((id) => !serverSelectedIds.has(id));
	const blocker = useBlocker({
		enableBeforeUnload: isDirty,
		shouldBlockFn: () => isDirty && !allowNavigationRef.current,
		withResolver: true,
	});

	const saveAndContinue = async () => {
		setSaveSuccess(false);
		replaceFeaturesMutation.reset();
		try {
			const features = await replaceFeaturesMutation.mutateAsync({
				featureIds: [...currentSelectedIds],
				propertyId,
			});
			setSelectedIds(new Set(features.map((feature) => feature.id)));
			setSaveSuccess(true);
			allowNavigationRef.current = true;
			void navigate({
				params: { propertyId },
				to: "/admin/properties/$propertyId/listings/new",
			});
		} catch {
			// The mutation message remains visible on the page.
		}
	};

	return {
		catalog,
		blocker,
		clearSelection: () => {
			setSelectedIds(new Set());
			setSaveSuccess(false);
		},
		copy,
		createConflict,
		createError: createFeatureMutation.error?.message ?? null,
		createForm,
		createOpen,
		filteredFeatures,
		finishLater: () => void navigate({ to: "/admin/properties" }),
		isDirty,
		isLoading: featureOptionsQuery.isPending || propertyFeaturesQuery.isPending,
		isSaving: replaceFeaturesMutation.isPending,
		loadError:
			featureOptionsQuery.error?.message ??
			propertyFeaturesQuery.error?.message ??
			null,
		propertyId,
		refetch: async () => {
			await Promise.all([
				featureOptionsQuery.refetch(),
				propertyFeaturesQuery.refetch(),
			]);
		},
		saveAndContinue,
		saveError: replaceFeaturesMutation.error?.message ?? null,
		saveSuccess,
		search,
		selectedIds: currentSelectedIds,
		setCreateConflict,
		setCreateOpen,
		setSearch,
		toggleFeature: (id: string) => {
			setSelectedIds((current) => {
				const next = new Set(current ?? serverSelectedIds);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				return next;
			});
			setSaveSuccess(false);
		},
	};
}
