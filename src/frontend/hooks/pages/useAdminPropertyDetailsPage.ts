import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PropertyType } from "#/shared/types/property.type";
import { ApiRequestError } from "@/frontend/api/utils";
import { useContactsQuery } from "@/frontend/features/contacts/hooks/useContactsQuery";
import { useAdminPropertyQuery } from "@/frontend/features/properties/hooks/useAdminPropertyQuery";
import {
	useArchivePropertyMutation,
	useDeletePropertyMutation,
	useRestorePropertyMutation,
} from "@/frontend/features/properties/hooks/usePropertyActions";
import { useUpdatePropertyMutation } from "@/frontend/features/properties/hooks/useUpdatePropertyMutation";
import { toAdminPropertyRecord } from "@/frontend/features/properties/property.mapper";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { adminPropertyDetailsCopy } from "@/frontend/pages/admin/properties/details/property-details.copy";

const formValuesFromProperty = (property?: PropertyType) => ({
	bathrooms: property ? String(property.bathrooms) : "",
	bedrooms: property?.bedrooms == null ? "" : String(property.bedrooms),
	city: property?.city ?? "",
	floorNumber:
		property?.floor_number == null ? "" : String(property.floor_number),
	houseNumber: property?.house_number ?? "",
	livingArea: property ? String(property.living_area_m2) : "",
	plotArea: property?.plot_area_m2 == null ? "" : String(property.plot_area_m2),
	postalCode: property?.postal_code ?? "",
	primaryContactId: property?.primary_contact?.id ?? "",
	propertySource:
		property?.property_source ??
		("AGENCY_OWNED" as "AGENCY_OWNED" | "EXTERNAL_CLIENT"),
	propertyType:
		property?.property_type ?? ("APARTMENT" as "APARTMENT" | "HOUSE"),
	rooms: property ? String(property.rooms) : "",
	streetName: property?.street_name ?? "",
	totalFloors:
		property?.total_floors == null ? "" : String(property.total_floors),
	unitNumber: property?.unit_number ?? "",
	yearBuilt: property?.year_built == null ? "" : String(property.year_built),
});

export function useAdminPropertyDetailsPage() {
	const { language } = useLanguage();
	const copy = adminPropertyDetailsCopy[language];
	const { propertyId } = useParams({ strict: false }) as { propertyId: string };
	const search = useSearch({ strict: false }) as { edit?: boolean };
	const navigate = useNavigate();
	const propertyQuery = useAdminPropertyQuery(propertyId);
	const contactsQuery = useContactsQuery("");
	const updateMutation = useUpdatePropertyMutation();
	const archiveMutation = useArchivePropertyMutation();
	const restoreMutation = useRestorePropertyMutation();
	const deleteMutation = useDeletePropertyMutation();
	const [isEditing, setIsEditingState] = useState(search.edit === true);
	const [success, setSuccess] = useState(false);
	const [action, setAction] = useState<"archive" | "restore" | "delete" | null>(
		null,
	);

	const form = useForm({
		defaultValues: formValuesFromProperty(),
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmit: async ({ value }) => {
			updateMutation.reset();
			try {
				await updateMutation.mutateAsync({
					input: {
						bathrooms: Number(value.bathrooms),
						bedrooms: value.bedrooms ? Number(value.bedrooms) : null,
						city: value.city.trim(),
						floor_number:
							value.propertyType === "APARTMENT" && value.floorNumber
								? Number(value.floorNumber)
								: null,
						house_number: value.houseNumber.trim(),
						living_area_m2: Number(value.livingArea),
						plot_area_m2:
							value.propertyType === "HOUSE" && value.plotArea
								? Number(value.plotArea)
								: null,
						postal_code: value.postalCode.trim(),
						primary_contact_id:
							value.propertySource === "EXTERNAL_CLIENT"
								? value.primaryContactId
								: null,
						property_source: value.propertySource,
						property_type: value.propertyType,
						rooms: Number(value.rooms),
						street_name: value.streetName.trim(),
						total_floors: value.totalFloors ? Number(value.totalFloors) : null,
						unit_number: value.unitNumber.trim() || null,
						year_built: value.yearBuilt ? Number(value.yearBuilt) : null,
					},
					propertyId,
				});
				setIsEditingState(false);
				setSuccess(true);
				void navigate({
					params: { propertyId },
					replace: true,
					search: { edit: undefined },
					to: "/admin/properties/$propertyId",
				});
			} catch {
				// The mutation exposes its error below the form.
			}
		},
	});

	useEffect(() => {
		if (propertyQuery.data)
			form.reset(formValuesFromProperty(propertyQuery.data));
	}, [form, propertyQuery.data]);

	const confirmAction = async () => {
		if (!action) return;
		const mutation =
			action === "archive"
				? archiveMutation
				: action === "restore"
					? restoreMutation
					: deleteMutation;
		mutation.reset();
		try {
			await mutation.mutateAsync(propertyId);
			setAction(null);
			if (action === "delete") {
				void navigate({ to: "/admin/properties" });
			}
		} catch {
			// Keep the dialog open and expose the server message.
		}
	};

	const actionMutation =
		action === "archive"
			? archiveMutation
			: action === "restore"
				? restoreMutation
				: deleteMutation;
	const record = propertyQuery.data
		? toAdminPropertyRecord(propertyQuery.data)
		: null;

	return {
		action,
		actionError: actionMutation.error?.message ?? null,
		confirmAction,
		contacts:
			contactsQuery.data?.items.map((contact) => ({
				id: contact.id,
				label: contact.company_name
					? `${contact.full_name} · ${contact.company_name}`
					: contact.full_name,
			})) ?? [],
		copy,
		form,
		formError: updateMutation.error?.message ?? null,
		isActionPending: actionMutation.isPending,
		isEditing,
		isLoading: propertyQuery.isPending,
		isNotFound:
			propertyQuery.error instanceof ApiRequestError &&
			propertyQuery.error.status === 404,
		language,
		loadError: propertyQuery.error?.message ?? null,
		propertyId,
		record,
		refetch: propertyQuery.refetch,
		setAction,
		setIsEditing: (value: boolean) => {
			if (!value && propertyQuery.data)
				form.reset(formValuesFromProperty(propertyQuery.data));
			setIsEditingState(value);
			setSuccess(false);
			updateMutation.reset();
			void navigate({
				params: { propertyId },
				replace: true,
				search: { edit: value ? true : undefined },
				to: "/admin/properties/$propertyId",
			});
		},
		success,
	};
}
