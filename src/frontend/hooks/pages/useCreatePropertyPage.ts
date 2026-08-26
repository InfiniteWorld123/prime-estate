import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { addDemoProperty } from "@/frontend/pages/admin/demo/admin-demo-workspace";
import { createPropertyCopy } from "@/frontend/pages/admin/properties/create/create-property.copy";

export type MockPropertyContact = {
	company: string | null;
	email: string | null;
	fullName: string;
	id: string;
	phone: string | null;
};

const initialContacts: MockPropertyContact[] = [
	{
		company: "Thüringer Wohnraum GmbH",
		email: "k.vogel@thueringer-wohnraum.de",
		fullName: "Katharina Vogel",
		id: "contact-katharina",
		phone: null,
	},
	{
		company: "Residenz Immobilien KG",
		email: "m.koch@residenz.immo",
		fullName: "Miriam Koch",
		id: "contact-miriam",
		phone: "+49 361 555 0184",
	},
	{
		company: null,
		email: "jonas.richter@example.de",
		fullName: "Jonas Richter",
		id: "contact-jonas",
		phone: "+49 176 555 0129",
	},
];

const wait = (milliseconds: number) =>
	new Promise((resolve) => window.setTimeout(resolve, milliseconds));
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
	const [contacts, setContacts] = useState(initialContacts);
	const [contactSearch, setContactSearch] = useState("");
	const [isDirty, setIsDirty] = useState(false);
	const [serverError, setServerError] = useState(false);
	const [contactSuccess, setContactSuccess] = useState(false);
	const allowNavigationRef = useRef(false);

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
			setServerError(false);
			await wait(750);
			if (value.streetName.trim().toLocaleLowerCase() === "error") {
				setServerError(true);
				return;
			}
			const propertyId = `property-${crypto.randomUUID()}`;
			const referenceNumber = `PE-${String(Date.now()).slice(-6)}`;
			const contact = contacts.find(
				(item) => item.id === value.primaryContactId,
			);
			addDemoProperty({
				archivedAt: null,
				bathrooms: Number(value.bathrooms),
				bedrooms: value.bedrooms ? Number(value.bedrooms) : null,
				city: value.city.trim(),
				contactCompany: contact?.company ?? null,
				contactName: contact?.fullName ?? null,
				coverImage: null,
				houseNumber: value.houseNumber.trim(),
				id: propertyId,
				livingArea: Number(value.livingArea),
				plotArea: value.plotArea ? Number(value.plotArea) : null,
				postalCode: value.postalCode.trim(),
				propertySource: value.propertySource,
				propertyType: value.propertyType,
				referenceNumber,
				rooms: Number(value.rooms),
				streetName: value.streetName.trim(),
				unitNumber: value.unitNumber.trim() || null,
				updatedAt: new Date().toISOString(),
				yearBuilt: value.yearBuilt ? Number(value.yearBuilt) : null,
			});
			allowNavigationRef.current = true;
			setIsDirty(false);
			await navigate({
				params: { propertyId },
				to: "/admin/properties/$propertyId/images",
			});
		},
	});

	const markDirty = () => {
		setIsDirty(true);
		setServerError(false);
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
	const addContact = (contact: MockPropertyContact) => {
		setContacts((current) => [...current, contact]);
		form.setFieldValue("primaryContactId", contact.id);
		setContactSearch("");
		setContactSuccess(true);
		markDirty();
	};

	const filteredContacts = contacts.filter((contact) =>
		`${contact.fullName} ${contact.company ?? ""} ${contact.email ?? ""}`
			.toLocaleLowerCase()
			.includes(contactSearch.toLocaleLowerCase()),
	);

	return {
		addContact,
		blocker,
		contactSearch,
		contactSuccess,
		contacts: filteredContacts,
		copy,
		form,
		markDirty,
		navigateToCollection: () => void navigate({ to: "/admin/properties" }),
		optionalInteger,
		positive,
		required,
		serverError,
		setContactSearch,
		setPropertySource,
		setPropertyType,
	};
}
