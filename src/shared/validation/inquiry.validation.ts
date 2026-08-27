import * as v from "valibot";

const RequiredTextSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(1, "This field is required"),
);

const EmailSchema = v.pipe(
	v.string(),
	v.trim(),
	v.toLowerCase(),
	v.email("Please enter a valid email address"),
);

const OptionalTextSchema = v.optional(
	v.pipe(
		v.string(),
		v.trim(),
		v.transform((value) => (value === "" ? undefined : value)),
	),
);

const HoneypotSchema = v.optional(v.pipe(v.string(), v.trim()), "");

const PrivacyConsentSchema = v.literal(
	true,
	"Privacy policy consent is required",
);

const InquiryContactFields = {
	full_name: RequiredTextSchema,
	email: EmailSchema,
	phone: OptionalTextSchema,
	message: RequiredTextSchema,
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
	listing_slug: RequiredTextSchema,
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
