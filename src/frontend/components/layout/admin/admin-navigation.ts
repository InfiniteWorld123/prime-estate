import { Building2, FileText, type LucideIcon } from "lucide-react";

export type AdminNavigationDestination =
	| "/admin/properties"
	| "/admin/listings";

export type AdminNavigationItem = {
	icon: LucideIcon;
	label: "properties" | "listings";
	to: AdminNavigationDestination;
};

export const adminNavigation: AdminNavigationItem[] = [
	{
		icon: Building2,
		label: "properties",
		to: "/admin/properties",
	},
	{
		icon: FileText,
		label: "listings",
		to: "/admin/listings",
	},
];
