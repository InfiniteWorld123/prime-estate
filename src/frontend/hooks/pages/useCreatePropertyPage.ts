import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { useContactsQuery } from "@/frontend/features/contacts/hooks/useContactsQuery";
import { useCreateContactMutation } from "@/frontend/features/contacts/hooks/useCreateContactMutation";
import { useCreatePropertyMutation } from "@/frontend/features/properties/hooks/useCreatePropertyMutation";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { createPropertyCopy } from "@/frontend/pages/admin/properties/create/create-property.copy";

export type PropertyContactOption = {
	company: string | null;
	email: string | null;
	fullName: string;
	id: string;
	phone: string | null;
};

export type CreatePropertyContactInput = Omit<PropertyContactOption, "id">;

const required = (value: string, message: string) =>
	value.trim() ? undefined : message;
const positive = (value: string, message: string) =>
	Number(value) > 0 ? undefined : message;
const optionalInteger = (value: string, message: string, allowZero = true) => {
	if (!value) return undefined;
	const number = Number(value);
	return Number.isInteger(number) && (allowZero ? number >= 0 : number > 0)
		? undefined
		: message;
};

export function useCreatePropertyPage() {
	const { language } = useLanguage();
	const copy = createPropertyCopy[language];
	const navigate = useNavigate();
	const [contactSearch, setContactSearch] = useState("");
	const [contactQuery, setContactQuery] = useState("");
	const [isDirty, setIsDirty] = useState(false);
	const [contactSuccess, setContactSuccess] = useState(false);
	const allowNavigationRef = useRef(false);
	const contactsQuery = useContactsQuery(contactQuery);
	const createContactMutation = useCreateContactMutation();
	const createPropertyMutation = useCreatePropertyMutation();

	useEffect(() => {
		const timer = window.setTimeout(
			() => setContactQuery(contactSearch.trim()),
			250,
		);
		return () => window.clearTimeout(timer);
	}, [contactSearch]);

	const blocker = useBlocker({
		enableBeforeUnload: isDirty,
		shouldBlockFn: () => isDirty && !allowNavigationRef.current,
		withResolver: true,
	});

	const form = useForm({
		defaultValues: {
			bathrooms: "",
			bedrooms: "",
			city: "",
			floorNumber: "",
			houseNumber: "",
			livingArea: "",
			plotArea: "",
			postalCode: "",
			primaryContactId: "",
			propertySource: "AGENCY_OWNED" as "AGENCY_OWNED" | "EXTERNAL_CLIENT",
			propertyType: "APARTMENT" as "APARTMENT" | "HOUSE",
			rooms: "",
			streetName: "",
			totalFloors: "",
			unitNumber: "",
			yearBuilt: "",
		},
		validationLogic: revalidateLogic({
			mode: "submit",
			modeAfterSubmission: "change",
		}),
		onSubmitInvalid: () =>
			window.requestAnimationFrame(() =>
				document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
			),
		onSubmit: async ({ value }) => {
			createPropertyMutation.reset();
			try {
				const property = await createPropertyMutation.mutateAsync({
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
				});

				allowNavigationRef.current = true;
				setIsDirty(false);
				await navigate({
					params: { propertyId: property.id },
					to: "/admin/properties/$propertyId/images",
				});
			} catch {
				// The mutation error remains available to the form UI.
			}
		},
	});

	const markDirty = () => {
		setIsDirty(true);
		createPropertyMutation.reset();
	};
	const setPropertySource = (value: "AGENCY_OWNED" | "EXTERNAL_CLIENT") => {
		form.setFieldValue("propertySource", value);
		if (value === "AGENCY_OWNED") form.setFieldValue("primaryContactId", "");
		setContactSuccess(false);
		markDirty();
	};
	const setPropertyType = (value: "APARTMENT" | "HOUSE") => {
		form.setFieldValue("propertyType", value);
		if (value === "APARTMENT") form.setFieldValue("plotArea", "");
		else form.setFieldValue("floorNumber", "");
		markDirty();
	};
	const addContact = async (input: CreatePropertyContactInput) => {
		const contact = await createContactMutation.mutateAsync({
			company_name: input.company ?? undefined,
			email: input.email ?? undefined,
			full_name: input.fullName,
			phone: input.phone ?? undefined,
		});
		form.setFieldValue("primaryContactId", contact.id);
		setContactSearch("");
		setContactQuery("");
		setContactSuccess(true);
		markDirty();
	};

	return {
		addContact,
		blocker,
		contactSearch,
		contactSuccess,
		contacts:
			contactsQuery.data?.items.map((contact) => ({
				company: contact.company_name,
				email: contact.email,
				fullName: contact.full_name,
				id: contact.id,
				phone: contact.phone,
			})) ?? [],
		copy,
		form,
		markDirty,
		navigateToCollection: () => void navigate({ to: "/admin/properties" }),
		optionalInteger,
		positive,
		required,
		serverError: createPropertyMutation.error?.message ?? null,
		setContactSearch,
		setPropertySource,
		setPropertyType,
	};
}
