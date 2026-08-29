import {
	Building2,
	FileText,
	Inbox,
	LayoutDashboard,
	type LucideIcon,
} from "lucide-react";

export type AdminNavigationDestination =
	| "/admin"
	| "/admin/properties"
	| "/admin/listings"
	| "/admin/inquiries";

export type AdminNavigationItem = {
	icon: LucideIcon;
	exact?: boolean;
	label: "overview" | "properties" | "listings" | "inquiries";
	to: AdminNavigationDestination;
};

export const adminNavigation: AdminNavigationItem[] = [
	{
		exact: true,
		icon: LayoutDashboard,
		label: "overview",
		to: "/admin",
	},
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
	{
		icon: Inbox,
		label: "inquiries",
		to: "/admin/inquiries",
	},
];
