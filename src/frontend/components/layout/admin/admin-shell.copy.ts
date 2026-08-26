export const adminShellCopy = {
	de: {
		account: "Administratorkonto",
		administration: "Administration",
		collapseNavigation: "Navigation einklappen",
		expandNavigation: "Navigation ausklappen",
		listings: "Inserate",
		listingsDescription:
			"Entwürfe, veröffentlichte und archivierte Inserate verwalten.",
		mainNavigation: "Admin-Navigation",
		mobileDescription: "Verwaltungsbereich von Prime Estate",
		openNavigation: "Navigation öffnen",
		properties: "Immobilien",
		propertiesDescription:
			"Den internen Immobilienbestand der Agentur verwalten.",
		region: "Erfurt · Thüringen",
		signOut: "Abmelden",
		workspaceDescription:
			"Die Verwaltungsoberfläche ist vorbereitet. Der fachliche Seiteninhalt folgt im nächsten Arbeitsschritt.",
		workspaceReady: "Arbeitsbereich vorbereitet",
	},
	en: {
		account: "Administrator account",
		administration: "Administration",
		collapseNavigation: "Collapse navigation",
		expandNavigation: "Expand navigation",
		listings: "Listings",
		listingsDescription:
			"Manage draft, published, and archived property listings.",
		mainNavigation: "Admin navigation",
		mobileDescription: "Prime Estate administration area",
		openNavigation: "Open navigation",
		properties: "Properties",
		propertiesDescription: "Manage the agency's internal property inventory.",
		region: "Erfurt · Thuringia",
		signOut: "Sign out",
		workspaceDescription:
			"The administration workspace is ready. The domain page content follows in the next implementation slice.",
		workspaceReady: "Workspace ready",
	},
} as const;

export type AdminShellCopy =
	(typeof adminShellCopy)[keyof typeof adminShellCopy];
