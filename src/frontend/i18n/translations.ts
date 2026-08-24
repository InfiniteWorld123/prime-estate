export type Language = "de" | "en";

export const translations = {
	de: {
		meta: {
			title: "Prime Estate | Immobilien in Thüringen kaufen und mieten",
			description:
				"Entdecken Sie Immobilien zum Kauf und zur Miete in Erfurt, Thüringen und ganz Deutschland.",
		},
		language: {
			label: "Sprache wählen",
			german: "Deutsch",
			english: "Englisch",
		},
		theme: {
			label: "Farbschema wählen",
			heading: "Darstellung",
			light: "Hell",
			dark: "Dunkel",
			system: "System",
		},
		header: {
			home: "Prime Estate Startseite",
			location: "Erfurt · Thüringen",
			properties: "Immobilien",
			findProperty: "Immobilie finden",
			browseAll: "Alle Immobilien",
			browseAllDescription: "Alle verfügbaren Immobilien ansehen",
			forSale: "Immobilien zum Kauf",
			forSaleDescription: "Aktuell zum Verkauf stehende Immobilien",
			forRent: "Immobilien zur Miete",
			forRentDescription: "Aktuell verfügbare Mietimmobilien",
			about: "Über uns",
			contact: "Kontakt",
			signIn: "Anmelden",
			signUp: "Konto erstellen",
			openNavigation: "Navigation öffnen",
			mainNavigation: "Hauptnavigation",
			mobileNavigation: "Mobile Navigation",
			mobileDescription: "Immobilienberatung aus Erfurt für Thüringen.",
			disabledTitle: "Diese Seite wird in einem späteren Schritt ergänzt",
			pagesLater:
				"Weitere Seiten folgen in den nächsten Entwicklungsschritten.",
		},
		hero: {
			eyebrow: "Erfurt & Thüringen",
			heading: "Finden Sie ein Zuhause für Ihren",
			headingAccent: "nächsten Schritt.",
			description:
				"Entdecken Sie Immobilien zum Kauf und zur Miete in Erfurt, Thüringen und darüber hinaus – mit klaren Angaben und persönlicher Beratung.",
			buy: "Kaufen",
			rent: "Mieten",
			locationLabel: "Stadt oder Postleitzahl",
			locationPlaceholder: "Stadt oder Postleitzahl",
			search: "Immobilien suchen",
			searchTitle: "Die Immobiliensuche wird mit der Ergebnisseite verbunden",
			hint: "Suchen Sie zum Beispiel nach Erfurt oder einer fünfstelligen Postleitzahl.",
			recentlyAdded: "Neu eingestellt",
		},
		property: {
			forSale: "Zum Kauf",
			forRent: "Zur Miete",
			month: "Monat",
			rooms: "Zimmer",
			house: "Haus",
			apartment: "Wohnung",
			imageUnavailable: "Bild nicht verfügbar",
		},
		propertyDetails: {
			breadcrumb: {
				home: "Startseite",
				properties: "Immobilien",
				label: "Brotkrümelnavigation",
			},
			gallery: {
				label: "Bildergalerie der Immobilie",
				openImage: "Bild öffnen",
				previous: "Vorheriges Bild",
				next: "Nächstes Bild",
				close: "Galerie schließen",
				photos: "Fotos",
				imageUnavailable: "Bilder nicht verfügbar",
			},
			summary: {
				forSale: "Zum Kauf",
				forRent: "Zur Miete",
				sold: "Verkauft",
				rented: "Vermietet",
				month: "Monat",
				exactAddressOnRequest: "Genaue Adresse auf Anfrage",
				unit: "Einheit",
				rooms: "Zimmer",
				livingArea: "Wohnfläche",
				bathrooms: "Bäder",
				propertyType: "Immobilientyp",
				house: "Haus",
				apartment: "Wohnung",
			},
			sections: {
				description: "Beschreibung",
				features: "Ausstattung",
				details: "Immobiliendetails",
				location: "Lage",
				reference: "Referenznummer",
				bedrooms: "Schlafzimmer",
				plotArea: "Grundstücksfläche",
				yearBuilt: "Baujahr",
				floor: "Etage",
				totalFloors: "Etagen insgesamt",
				addressOnRequest:
					"Die genaue Adresse teilen wir gerne im persönlichen Gespräch mit.",
			},
			contact: {
				eyebrow: "Persönlicher Kontakt",
				team: "Prime Estate Team",
				description:
					"Sie haben Fragen zu dieser Immobilie? Senden Sie uns eine Nachricht und wir melden uns persönlich bei Ihnen.",
				requestInformation: "Informationen anfragen",
				bookViewing: "Besichtigung anfragen",
				bookingLater: "Die Terminplanung folgt in einem späteren Schritt.",
				unavailableTitle: "Diese Immobilie ist nicht mehr verfügbar",
				soldMessage:
					"Diese Immobilie wurde verkauft. Anfragen sind nicht mehr möglich.",
				rentedMessage:
					"Diese Immobilie wurde vermietet. Anfragen sind nicht mehr möglich.",
			},
			inquiry: {
				title: "Informationen zur Immobilie anfragen",
				description: "Senden Sie Ihre Frage direkt an das Prime Estate Team.",
				fullName: "Vollständiger Name",
				fullNamePlaceholder: "Vor- und Nachname",
				email: "E-Mail-Adresse",
				emailPlaceholder: "name@beispiel.de",
				phone: "Telefonnummer",
				phoneOptional: "Optional",
				phonePlaceholder: "+49 170 1234567",
				message: "Nachricht",
				messageTemplate:
					"Ich interessiere mich für die Immobilie mit der Referenz {reference} und wünsche weitere Informationen.",
				privacyPrefix: "Ich habe die",
				privacyLink: "Datenschutzerklärung",
				privacySuffix: "gelesen und stimme der Verarbeitung meiner Angaben zu.",
				privacyLater: "Die Datenschutzseite wird später ergänzt.",
				submit: "Anfrage senden",
				submitting: "Anfrage wird gesendet",
				serverError:
					"Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
				successTitle: "Ihre Anfrage wurde übermittelt",
				successDescription:
					"Das Prime Estate Team wird sich mit Ihnen in Verbindung setzen.",
				close: "Schließen",
				validation: {
					fullName: "Bitte geben Sie Ihren vollständigen Namen ein.",
					email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
					phone: "Bitte geben Sie eine gültige Telefonnummer ein.",
					message: "Bitte geben Sie eine Nachricht ein.",
					messageLength: "Die Nachricht darf höchstens 2000 Zeichen enthalten.",
					privacy: "Bitte stimmen Sie der Datenschutzerklärung zu.",
				},
			},
			states: {
				loading: "Immobiliendetails werden geladen",
				errorTitle: "Immobilie konnte nicht geladen werden",
				errorDescription:
					"Versuchen Sie es erneut. Ihre Navigation bleibt unverändert.",
				retry: "Erneut versuchen",
				notFoundTitle: "Immobilie nicht gefunden",
				notFoundDescription:
					"Die Immobilie wurde entfernt oder die Adresse ist nicht mehr gültig.",
				backToProperties: "Alle Immobilien ansehen",
				updateError:
					"Die neuesten Immobiliendaten konnten nicht geladen werden.",
			},
		},
		latest: {
			eyebrow: "Neu am Markt",
			heading: "Neueste Immobilien",
			description:
				"Ein erster Blick auf Immobilien in Erfurt, Thüringen und weiteren deutschen Städten.",
			browse: "Alle Immobilien ansehen",
			browseTitle: "Die Immobilienseite wird in einem späteren Schritt ergänzt",
		},
		properties: {
			eyebrow: "Immobiliensuche",
			heading: "Immobilien in Erfurt und Thüringen",
			description:
				"Durchsuchen Sie Häuser und Wohnungen zum Kauf oder zur Miete und grenzen Sie die Auswahl nach Ihren Anforderungen ein.",
			defaultLocation: "Erfurt und Thüringen",
			tabs: { all: "Alle Immobilien", buy: "Kaufen", rent: "Mieten" },
			filters: {
				heading: "Suche verfeinern",
				selected: "{count} ausgewählt",
				clear: "Zurücksetzen",
				clearAll: "Alle löschen",
				location: "Ort",
				locationPlaceholder: "Stadt oder Postleitzahl",
				postalCodeError: "Eine Postleitzahl muss genau fünf Ziffern enthalten.",
				propertyType: "Immobilientyp",
				purchasePrice: "Kaufpreis",
				monthlyRent: "Monatliche Miete",
				price: "Preis",
				livingArea: "Wohnfläche",
				rooms: "Zimmer",
				bedrooms: "Mindestens Schlafzimmer",
				features: "Ausstattung",
				minimum: "Minimum",
				maximum: "Maximum",
				any: "Beliebig",
				showMore: "Mehr anzeigen",
				showLess: "Weniger anzeigen",
				showResults: "Ergebnisse anzeigen",
			},
			results: {
				count: "{count} Immobilien gefunden",
				sortLabel: "Sortieren",
				emptyHeading: "Keine passenden Immobilien gefunden",
				emptyDescription:
					"Entfernen Sie einige Filter oder suchen Sie nach einem anderen Ort.",
				resetFilters: "Filter zurücksetzen",
				errorHeading: "Immobilien konnten nicht geladen werden",
				errorDescription:
					"Versuchen Sie es erneut. Ihre Suchkriterien bleiben erhalten.",
				retry: "Erneut versuchen",
				updateError: "Die Ergebnisse konnten nicht aktualisiert werden.",
			},
			sort: {
				newest: "Neueste zuerst",
				priceAsc: "Preis: aufsteigend",
				priceDesc: "Preis: absteigend",
				areaAsc: "Wohnfläche: aufsteigend",
				areaDesc: "Wohnfläche: absteigend",
			},
			pagination: {
				label: "Ergebnisseiten",
				previous: "Zurück",
				next: "Weiter",
			},
			chips: {
				minPrice: "Preis ab",
				maxPrice: "Preis bis",
				minLivingArea: "Fläche ab",
				maxLivingArea: "Fläche bis",
				minRooms: "Zimmer ab",
				maxRooms: "Zimmer bis",
				minBedrooms: "Schlafzimmer ab",
			},
		},
		why: {
			eyebrow: "Warum Prime Estate",
			heading: "Ein klarerer Weg zu Ihrer nächsten Immobilie.",
			description:
				"Wir konzentrieren uns auf hilfreiche Informationen, lokale Einordnung und persönliche Gespräche, die Ihre Entscheidung unterstützen.",
			items: [
				{
					title: "Klare Immobilienangaben",
					description:
						"Alle wesentlichen Fakten zu Preis, Wohnfläche, Lage und Immobilientyp auf einen Blick.",
				},
				{
					title: "Lokale Marktperspektive",
					description:
						"Starten Sie Ihre Suche mit einem klaren Fokus auf Erfurt und Thüringen.",
				},
				{
					title: "Persönliche Begleitung",
					description:
						"Stellen Sie Fragen und besprechen Sie direkt, was für Ihre Suche wirklich wichtig ist.",
				},
			],
		},
		how: {
			eyebrow: "So funktioniert es",
			heading: "Von der ersten Suche bis zur Besichtigung.",
			description:
				"Jeder Schritt bleibt verständlich, damit Sie jederzeit wissen, wie es weitergeht.",
			steps: [
				{
					title: "Suchen",
					description:
						"Wählen Sie Kauf oder Miete und starten Sie mit einer Stadt oder Postleitzahl.",
				},
				{
					title: "Details prüfen",
					description:
						"Vergleichen Sie die Angaben, die zu Ihren Anforderungen und Ihrem Budget passen.",
				},
				{
					title: "Kontakt aufnehmen",
					description:
						"Teilen Sie Ihre Fragen und sagen Sie uns, was Sie genauer wissen möchten.",
				},
				{
					title: "Besichtigung planen",
					description:
						"Vereinbaren Sie einen passenden Termin, um die Immobilie persönlich kennenzulernen.",
				},
			],
		},
		local: {
			eyebrow: "Lokale Kompetenz",
			heading: "In Erfurt verwurzelt, deutschlandweit offen.",
			description:
				"Prime Estate startet mit einem klaren Fokus auf Erfurt und Thüringen und bleibt gleichzeitig offen für Immobilien in ganz Deutschland.",
			regions: [
				{
					name: "Erfurt",
					description: "Unser Ausgangspunkt und lokaler Schwerpunkt.",
				},
				{
					name: "Thüringen",
					description: "Immobiliensuche in Städten und Gemeinden der Region.",
				},
				{
					name: "Deutschlandweit",
					description:
						"Eine Plattform, die auch Immobilien außerhalb der Region unterstützt.",
				},
			],
		},
		cta: {
			eyebrow: "Gespräch beginnen",
			heading: "Planen Sie Ihren nächsten Schritt?",
			description:
				"Erzählen Sie uns, wonach Sie suchen, und lassen Sie sich beim nächsten Schritt begleiten.",
			action: "Prime Estate kontaktieren",
			title: "Die Kontaktseite wird in einem späteren Schritt ergänzt",
		},
		footer: {
			description:
				"Immobilien zum Kauf und zur Miete in Erfurt, Thüringen und ganz Deutschland klar entdecken.",
			navigation: "Navigation im Seitenfuß",
			groups: [
				{
					title: "Immobilien",
					items: ["Alle Immobilien", "Zum Kauf", "Zur Miete"],
				},
				{ title: "Agentur", items: ["Über uns", "Kontakt"] },
				{ title: "Konto", items: ["Anmelden", "Konto erstellen"] },
				{ title: "Rechtliches", items: ["Impressum", "Datenschutz"] },
			],
			disabledTitle: "{item} wird in einem späteren Schritt ergänzt",
			copyright: "Prime Estate.",
			disclaimer: "Portfolio-Projekt · Immobilienangaben sind beispielhaft.",
		},
	},
	en: {
		meta: {
			title: "Prime Estate | Homes for Sale and Rent in Thuringia",
			description:
				"Explore homes for sale and rent across Erfurt, Thuringia, and Germany.",
		},
		language: {
			label: "Choose language",
			german: "German",
			english: "English",
		},
		theme: {
			label: "Choose color theme",
			heading: "Appearance",
			light: "Light",
			dark: "Dark",
			system: "System",
		},
		header: {
			home: "Prime Estate home",
			location: "Erfurt · Thuringia",
			properties: "Properties",
			findProperty: "Find a property",
			browseAll: "Browse all",
			browseAllDescription: "View every available property",
			forSale: "Properties for sale",
			forSaleDescription: "Homes currently offered for sale",
			forRent: "Properties for rent",
			forRentDescription: "Homes currently available to rent",
			about: "About",
			contact: "Contact",
			signIn: "Sign in",
			signUp: "Sign up",
			openNavigation: "Open navigation",
			mainNavigation: "Main navigation",
			mobileNavigation: "Mobile navigation",
			mobileDescription: "Property guidance from Erfurt across Thuringia.",
			disabledTitle: "This page will be added in a later frontend slice",
			pagesLater:
				"More pages will become available as we build each frontend slice.",
		},
		hero: {
			eyebrow: "Erfurt & Thuringia",
			heading: "Find a home that fits your",
			headingAccent: "next move.",
			description:
				"Explore homes for sale and rent across Erfurt, Thuringia, and beyond—with clear details and personal local guidance.",
			buy: "Buy",
			rent: "Rent",
			locationLabel: "City or postal code",
			locationPlaceholder: "City or postal code",
			search: "Search properties",
			searchTitle: "Property search will be connected in the listings slice",
			hint: "Try a city such as Erfurt or a five-digit German postal code.",
			recentlyAdded: "Recently added",
		},
		property: {
			forSale: "For sale",
			forRent: "For rent",
			month: "month",
			rooms: "rooms",
			house: "House",
			apartment: "Apartment",
			imageUnavailable: "Image unavailable",
		},
		propertyDetails: {
			breadcrumb: {
				home: "Home",
				properties: "Properties",
				label: "Breadcrumb",
			},
			gallery: {
				label: "Property image gallery",
				openImage: "Open image",
				previous: "Previous image",
				next: "Next image",
				close: "Close gallery",
				photos: "photos",
				imageUnavailable: "Images unavailable",
			},
			summary: {
				forSale: "For sale",
				forRent: "For rent",
				sold: "Sold",
				rented: "Rented",
				month: "month",
				exactAddressOnRequest: "Exact address on request",
				unit: "Unit",
				rooms: "Rooms",
				livingArea: "Living area",
				bathrooms: "Bathrooms",
				propertyType: "Property type",
				house: "House",
				apartment: "Apartment",
			},
			sections: {
				description: "Description",
				features: "Features",
				details: "Property details",
				location: "Location",
				reference: "Reference number",
				bedrooms: "Bedrooms",
				plotArea: "Plot area",
				yearBuilt: "Year built",
				floor: "Floor",
				totalFloors: "Total floors",
				addressOnRequest:
					"We will gladly share the exact address during a personal conversation.",
			},
			contact: {
				eyebrow: "Personal contact",
				team: "Prime Estate Team",
				description:
					"Have a question about this property? Send us a message and our team will contact you personally.",
				requestInformation: "Request information",
				bookViewing: "Request a viewing",
				bookingLater: "Viewing appointments will be added in a later step.",
				unavailableTitle: "This property is no longer available",
				soldMessage:
					"This property has been sold. New inquiries are no longer available.",
				rentedMessage:
					"This property has been rented. New inquiries are no longer available.",
			},
			inquiry: {
				title: "Request property information",
				description: "Send your question directly to the Prime Estate team.",
				fullName: "Full name",
				fullNamePlaceholder: "First and last name",
				email: "Email address",
				emailPlaceholder: "name@example.com",
				phone: "Phone number",
				phoneOptional: "Optional",
				phonePlaceholder: "+49 170 1234567",
				message: "Message",
				messageTemplate:
					"I am interested in the property with reference {reference} and would like more information.",
				privacyPrefix: "I have read the",
				privacyLink: "Privacy Policy",
				privacySuffix: "and agree to the processing of my information.",
				privacyLater: "The Privacy Policy page will be added later.",
				submit: "Send inquiry",
				submitting: "Sending inquiry",
				serverError: "The inquiry could not be sent. Please try again.",
				successTitle: "Your inquiry was submitted",
				successDescription:
					"The Prime Estate team will contact you about this property.",
				close: "Close",
				validation: {
					fullName: "Enter your full name.",
					email: "Enter a valid email address.",
					phone: "Enter a valid phone number.",
					message: "Enter a message.",
					messageLength: "The message must not exceed 2,000 characters.",
					privacy: "Accept the Privacy Policy to continue.",
				},
			},
			states: {
				loading: "Loading property details",
				errorTitle: "The property could not be loaded",
				errorDescription:
					"Try again. Your current navigation will remain unchanged.",
				retry: "Try again",
				notFoundTitle: "Property not found",
				notFoundDescription:
					"The property may have been removed or this address is no longer valid.",
				backToProperties: "Browse all properties",
				updateError: "The latest property information could not be loaded.",
			},
		},
		latest: {
			eyebrow: "New on the market",
			heading: "Latest properties",
			description:
				"A first look at homes available across Erfurt, Thuringia, and nearby German cities.",
			browse: "Browse all properties",
			browseTitle: "The properties page will be added in a later slice",
		},
		properties: {
			eyebrow: "Property search",
			heading: "Properties in Erfurt and Thuringia",
			description:
				"Explore homes and apartments to buy or rent, then narrow the selection around what matters to your next move.",
			defaultLocation: "Erfurt and Thuringia",
			tabs: { all: "All properties", buy: "Buy", rent: "Rent" },
			filters: {
				heading: "Refine your search",
				selected: "{count} selected",
				clear: "Reset",
				clearAll: "Clear all",
				location: "Location",
				locationPlaceholder: "City or postal code",
				postalCodeError: "A postal code must contain exactly five digits.",
				propertyType: "Property type",
				purchasePrice: "Purchase price",
				monthlyRent: "Monthly rent",
				price: "Price",
				livingArea: "Living area",
				rooms: "Rooms",
				bedrooms: "Minimum bedrooms",
				features: "Features",
				minimum: "Minimum",
				maximum: "Maximum",
				any: "Any",
				showMore: "Show more",
				showLess: "Show less",
				showResults: "Show results",
			},
			results: {
				count: "{count} properties found",
				sortLabel: "Sort",
				emptyHeading: "No properties match your search",
				emptyDescription:
					"Try removing some filters or searching another location.",
				resetFilters: "Reset filters",
				errorHeading: "We couldn't load the properties",
				errorDescription:
					"Try again. Your search criteria have been preserved.",
				retry: "Try again",
				updateError: "The results couldn't be updated.",
			},
			sort: {
				newest: "Newest first",
				priceAsc: "Price: low to high",
				priceDesc: "Price: high to low",
				areaAsc: "Living area: low to high",
				areaDesc: "Living area: high to low",
			},
			pagination: {
				label: "Result pages",
				previous: "Previous",
				next: "Next",
			},
			chips: {
				minPrice: "Price from",
				maxPrice: "Price to",
				minLivingArea: "Area from",
				maxLivingArea: "Area to",
				minRooms: "Rooms from",
				maxRooms: "Rooms to",
				minBedrooms: "Bedrooms from",
			},
		},
		why: {
			eyebrow: "Why Prime Estate",
			heading: "A clearer way to approach your property search.",
			description:
				"We keep the experience focused on useful information, local context, and conversations that help you make your next decision.",
			items: [
				{
					title: "Clear property information",
					description:
						"Review essential facts without unnecessary noise, from price and living area to location and property type.",
				},
				{
					title: "Local market perspective",
					description:
						"Start your search with a focus on Erfurt and Thuringia, supported by an understanding of the local area.",
				},
				{
					title: "Personal guidance",
					description:
						"Ask questions, discuss what matters to you, and move forward with direct support from the agency.",
				},
			],
		},
		how: {
			eyebrow: "How it works",
			heading: "From first search to first viewing.",
			description:
				"Each step keeps the process understandable, so you always know what comes next.",
			steps: [
				{
					title: "Search",
					description:
						"Choose whether you want to buy or rent, then begin with a city or postal code.",
				},
				{
					title: "Explore details",
					description:
						"Compare the property information that matters to your needs and budget.",
				},
				{
					title: "Contact the agency",
					description:
						"Share your questions and tell us what you would like to understand.",
				},
				{
					title: "Arrange a viewing",
					description:
						"Choose a suitable time to experience the property beyond the listing.",
				},
			],
		},
		local: {
			eyebrow: "Local expertise",
			heading: "Rooted in Erfurt, ready to look further.",
			description:
				"Prime Estate begins with a clear focus on Erfurt and Thuringia while staying ready for properties elsewhere in Germany.",
			regions: [
				{
					name: "Erfurt",
					description: "Our starting point and primary local focus.",
				},
				{
					name: "Thuringia",
					description:
						"Regional property searches across nearby cities and communities.",
				},
				{
					name: "Across Germany",
					description:
						"A structure ready to support opportunities beyond the region.",
				},
			],
		},
		cta: {
			eyebrow: "Start a conversation",
			heading: "Planning your next move?",
			description:
				"Tell us what you are looking for and let Prime Estate help you take the next step.",
			action: "Contact Prime Estate",
			title: "The contact page will be added in a later slice",
		},
		footer: {
			description:
				"A clear and local way to explore homes for sale and rent across Erfurt, Thuringia, and Germany.",
			navigation: "Footer navigation",
			groups: [
				{ title: "Properties", items: ["Browse all", "For sale", "For rent"] },
				{ title: "Agency", items: ["About", "Contact"] },
				{ title: "Account", items: ["Sign in", "Create account"] },
				{ title: "Legal", items: ["Imprint", "Privacy"] },
			],
			disabledTitle: "{item} will be added in a later frontend slice",
			copyright: "Prime Estate.",
			disclaimer: "Portfolio project · Property information is illustrative.",
		},
	},
} as const;

export type Translation = (typeof translations)[Language];
