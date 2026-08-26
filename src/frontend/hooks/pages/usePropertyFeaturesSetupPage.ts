import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useBlocker, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";

import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { setDemoPropertyFeatures } from "@/frontend/pages/admin/demo/admin-demo-workspace";
import { propertySetupCopy } from "@/frontend/pages/admin/properties/setup/property-setup.copy";

export type PropertyFeatureOption = { code: string; id: string; name: string };

const initialFeatures: PropertyFeatureOption[] = [
	{ code: "BALCONY", id: "feature-balcony", name: "Balcony" },
	{ code: "GARDEN", id: "feature-garden", name: "Garden" },
	{ code: "ELEVATOR", id: "feature-elevator", name: "Elevator" },
	{ code: "PARKING", id: "feature-parking", name: "Parking space" },
	{ code: "FITTED_KITCHEN", id: "feature-kitchen", name: "Fitted kitchen" },
	{ code: "BASEMENT", id: "feature-basement", name: "Basement" },
	{ code: "ACCESSIBLE", id: "feature-accessible", name: "Accessible" },
	{ code: "GUEST_WC", id: "feature-guest-wc", name: "Guest WC" },
];

const wait = (milliseconds: number) =>
	new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function usePropertyFeaturesSetupPage() {
	const { language } = useLanguage();
	const copy = propertySetupCopy[language];
	const { propertyId } = useParams({ strict: false }) as { propertyId: string };
	const navigate = useNavigate();
	const allowNavigationRef = useRef(false);
	const [catalog, setCatalog] = useState(initialFeatures);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());
	const [search, setSearch] = useState("");
	const [isSaving, setIsSaving] = useState(false);
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
			await wait(500);
			const normalized = value.name.trim().toLocaleLowerCase();
			if (
				catalog.some(
					(feature) => feature.name.toLocaleLowerCase() === normalized,
				)
			) {
				setCreateConflict(true);
				return;
			}
			const feature = {
				code: value.name
					.trim()
					.toUpperCase()
					.replace(/[^A-Z0-9]+/g, "_"),
				id: `feature-${crypto.randomUUID()}`,
				name: value.name.trim(),
			};
			setCatalog((current) => [...current, feature]);
			setSelectedIds((current) => new Set([...current, feature.id]));
			createForm.reset();
			setCreateOpen(false);
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
		selectedIds.size !== confirmedIds.size ||
		[...selectedIds].some((id) => !confirmedIds.has(id));
	const blocker = useBlocker({
		enableBeforeUnload: isDirty,
		shouldBlockFn: () => isDirty && !allowNavigationRef.current,
		withResolver: true,
	});

	const saveAndContinue = async () => {
		setIsSaving(true);
		setSaveSuccess(false);
		await wait(700);
		setDemoPropertyFeatures(
			propertyId,
			catalog
				.filter((feature) => selectedIds.has(feature.id))
				.map(({ id, name }) => ({ id, name })),
		);
		setConfirmedIds(new Set(selectedIds));
		setIsSaving(false);
		setSaveSuccess(true);
		await wait(350);
		allowNavigationRef.current = true;
		void navigate({
			params: { propertyId },
			to: "/admin/properties/$propertyId/listings/new",
		});
	};

	return {
		catalog,
		blocker,
		clearSelection: () => setSelectedIds(new Set()),
		copy,
		createConflict,
		createForm,
		createOpen,
		filteredFeatures,
		finishLater: () => void navigate({ to: "/admin/properties" }),
		isDirty,
		isSaving,
		propertyId,
		saveAndContinue,
		saveSuccess,
		search,
		selectedIds,
		setCreateConflict,
		setCreateOpen,
		setSearch,
		toggleFeature: (id: string) =>
			setSelectedIds((current) => {
				const next = new Set(current);
				if (next.has(id)) next.delete(id);
				else next.add(id);
				setSaveSuccess(false);
				return next;
			}),
	};
}
