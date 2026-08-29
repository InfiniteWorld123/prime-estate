import * as v from "valibot";

export const INQUIRY_FIELD_LIMITS = {
	fullName: 120,
	email: 254,
	phone: 40,
	message: 2000,
	listingSlug: 200,
	honeypot: 200,
} as const;

export const INQUIRY_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const INQUIRY_PHONE_PATTERN = /^[+\d][\d\s()./-]{5,39}$/;

const RequiredTextSchema = (maximumLength: number, fieldName: string) =>
	v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, "This field is required"),
		v.maxLength(maximumLength, `${fieldName} is too long`),
	);

const EmailSchema = v.pipe(
	v.string(),
	v.trim(),
	v.toLowerCase(),
	v.regex(INQUIRY_EMAIL_PATTERN, "Please enter a valid email address"),
	v.maxLength(INQUIRY_FIELD_LIMITS.email, "Email address is too long"),
);

const OptionalPhoneSchema = v.optional(
	v.pipe(
		v.string(),
		v.trim(),
		v.maxLength(INQUIRY_FIELD_LIMITS.phone, "Phone number is too long"),
		v.check(
			(value) => value === "" || INQUIRY_PHONE_PATTERN.test(value),
			"Please enter a valid phone number",
		),
		v.transform((value) => (value === "" ? undefined : value)),
	),
);

const HoneypotSchema = v.optional(
	v.pipe(
		v.string(),
		v.trim(),
		v.maxLength(INQUIRY_FIELD_LIMITS.honeypot, "Invalid form value"),
	),
	"",
);

const PrivacyConsentSchema = v.literal(
	true,
	"Privacy policy consent is required",
);

const InquiryContactFields = {
	full_name: RequiredTextSchema(INQUIRY_FIELD_LIMITS.fullName, "Full name"),
	email: EmailSchema,
	phone: OptionalPhoneSchema,
	message: RequiredTextSchema(INQUIRY_FIELD_LIMITS.message, "Message"),
	privacy_accepted: PrivacyConsentSchema,
	website: HoneypotSchema,
};

export const GeneralInquirySchema = v.object({
	inquiry_type: v.literal("GENERAL"),
	interest: v.picklist(
		["BUYING", "RENTING", "GENERAL"],
		"Invalid inquiry interest",
	),
	...InquiryContactFields,
});

export const ListingInquirySchema = v.object({
	inquiry_type: v.literal("LISTING"),
	listing_slug: RequiredTextSchema(
		INQUIRY_FIELD_LIMITS.listingSlug,
		"Listing slug",
	),
	...InquiryContactFields,
});

export const CreateInquirySchema = v.variant("inquiry_type", [
	GeneralInquirySchema,
	ListingInquirySchema,
]);

const UuidSchema = v.pipe(v.string(), v.uuid("Invalid inquiry ID"));

const PositiveIntegerSchema = v.pipe(
	v.string(),
	v.regex(/^\d+$/, "Must be a positive integer"),
	v.transform(Number),
	v.minValue(1, "Must be at least 1"),
);

const QueryBooleanSchema = v.pipe(
	v.picklist(["true", "false"], "Must be true or false"),
	v.transform((value) => value === "true"),
);

export const InquiryParamsSchema = v.object({
	id: UuidSchema,
});

export const ListInquiriesQuerySchema = v.object({
	inquiry_type: v.optional(v.picklist(["GENERAL", "LISTING"])),
	interest: v.optional(v.picklist(["BUYING", "RENTING", "GENERAL"])),
	lead_status: v.optional(v.picklist(["NEW", "CONTACTED", "CLOSED"])),
	listing_id: v.optional(v.pipe(v.string(), v.uuid("Invalid listing ID"))),
	unread: v.optional(QueryBooleanSchema),
	archive_status: v.optional(
		v.picklist(["active", "archived", "all"], "Invalid archive status"),
	),
	page: v.optional(PositiveIntegerSchema),
	page_size: v.optional(
		v.pipe(
			PositiveIntegerSchema,
			v.maxValue(100, "Page size cannot exceed 100"),
		),
	),
	sort: v.optional(v.picklist(["newest", "oldest"], "Invalid sort option")),
});

export const UpdateInquiryStatusSchema = v.object({
	lead_status: v.picklist(
		["NEW", "CONTACTED", "CLOSED"],
		"Invalid lead status",
	),
});
