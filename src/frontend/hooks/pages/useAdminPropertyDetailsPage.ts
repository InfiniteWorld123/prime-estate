import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useState } from "react";

import type { AdminPropertyRecord } from "@/frontend/features/properties/admin-property.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { getDemoProperties } from "@/frontend/pages/admin/demo/admin-demo-workspace";
import { adminPropertyDetailsCopy } from "@/frontend/pages/admin/properties/details/property-details.copy";

const wait = (milliseconds: number) =>
	new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export function useAdminPropertyDetailsPage() {
	const { language } = useLanguage();
	const copy = adminPropertyDetailsCopy[language];
	const { propertyId } = useParams({ strict: false }) as { propertyId: string };
	const search = useSearch({ strict: false }) as { edit?: boolean };
	const navigate = useNavigate();
	const seed =
		getDemoProperties().find((property) => property.id === propertyId) ?? null;
	const [record, setRecord] = useState<AdminPropertyRecord | null>(seed);
	const [isEditing, setIsEditingState] = useState(search.edit === true);
	const [success, setSuccess] = useState(false);
	const [action, setAction] = useState<"archive" | "restore" | "delete" | null>(
		null,
	);

	const form = useForm({
		defaultValues: {
			bathrooms: String(seed?.bathrooms ?? ""),
			bedrooms: seed?.bedrooms == null ? "" : String(seed.bedrooms),
			city: seed?.city ?? "",
			floorNumber: seed?.propertyType === "APARTMENT" ? "2" : "",
			houseNumber: seed?.houseNumber ?? "",
			livingArea: String(seed?.livingArea ?? ""),
			plotArea: seed?.plotArea == null ? "" : String(seed.plotArea),
			postalCode: seed?.postalCode ?? "",
			primaryContactId: seed?.contactName ? "contact-katharina" : "",
			propertySource: seed?.propertySource ?? ("AGENCY_OWNED" as const),
			propertyType: seed?.propertyType ?? ("APARTMENT" as const),
			rooms: String(seed?.rooms ?? ""),
			streetName: seed?.streetName ?? "",
			totalFloors: "4",
			unitNumber: seed?.unitNumber ?? "",
			yearBuilt: seed?.yearBuilt == null ? "" : String(seed.yearBuilt),
		},
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmit: async ({ value }) => {
			if (!record) return;
			await wait(650);
			setRecord({
				...record,
				bathrooms: Number(value.bathrooms),
				bedrooms: value.bedrooms ? Number(value.bedrooms) : null,
				city: value.city.trim(),
				houseNumber: value.houseNumber.trim(),
				livingArea: Number(value.livingArea),
				plotArea:
					value.propertyType === "HOUSE" && value.plotArea
						? Number(value.plotArea)
						: null,
				postalCode: value.postalCode,
				contactCompany:
					value.propertySource === "EXTERNAL_CLIENT"
						? value.primaryContactId === "contact-miriam"
							? "Residenz Immobilien KG"
							: "Thüringer Wohnraum GmbH"
						: null,
				contactName:
					value.propertySource === "EXTERNAL_CLIENT"
						? value.primaryContactId === "contact-miriam"
							? "Miriam Koch"
							: "Katharina Vogel"
						: null,
				propertySource: value.propertySource,
				propertyType: value.propertyType,
				rooms: Number(value.rooms),
				streetName: value.streetName.trim(),
				unitNumber: value.unitNumber.trim() || null,
				updatedAt: new Date().toISOString(),
				yearBuilt: value.yearBuilt ? Number(value.yearBuilt) : null,
			});
			setIsEditingState(false);
			setSuccess(true);
			void navigate({
				params: { propertyId },
				replace: true,
				search: { edit: undefined },
				to: "/admin/properties/$propertyId",
			});
		},
	});

	const confirmAction = () => {
		if (!record || !action) return;
		if (action === "delete") {
			setRecord(null);
			setAction(null);
			void navigate({ to: "/admin/properties" });
			return;
		}
		setRecord({
			...record,
			archivedAt: action === "archive" ? new Date().toISOString() : null,
			updatedAt: new Date().toISOString(),
		});
		setAction(null);
	};

	return {
		action,
		confirmAction,
		copy,
		form,
		isEditing,
		language,
		propertyId,
		record,
		setAction,
		setIsEditing: (value: boolean) => {
			setIsEditingState(value);
			setSuccess(false);
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
