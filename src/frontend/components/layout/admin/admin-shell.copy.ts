export const adminShellCopy = {
	de: {
		account: "Administratorkonto",
		administration: "Administration",
		collapseNavigation: "Navigation einklappen",
		expandNavigation: "Navigation ausklappen",
		listings: "Inserate",
		listingsDescription:
			"Entwürfe, veröffentlichte und archivierte Inserate verwalten.",
		inquiries: "Anfragen",
		inquiriesDescription: "Eingehende Anfragen lesen und bearbeiten.",
		mainNavigation: "Admin-Navigation",
		mobileDescription: "Verwaltungsbereich von Prime Estate",
		openNavigation: "Navigation öffnen",
		overview: "Übersicht",
		overviewDescription: "Aktuellen Bestand und neue Anfragen überblicken.",
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
		inquiries: "Inquiries",
		inquiriesDescription: "Read and process incoming inquiries.",
		mainNavigation: "Admin navigation",
		mobileDescription: "Prime Estate administration area",
		openNavigation: "Open navigation",
		overview: "Overview",
		overviewDescription: "Review current inventory and new inquiries.",
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
