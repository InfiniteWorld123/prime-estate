export const authCopy = {
	de: {
		common: {
			brandLabel: "Prime Estate Startseite",
			location: "Erfurt · Thüringen",
			mediaEyebrow: "Geschützter Verwaltungszugang",
			mediaTitle: "Der Arbeitsbereich für Prime Estate.",
			mediaDescription:
				"Dieser Zugang ist ausschließlich für den verifizierten Administrator der Agentur bestimmt.",
			email: "Admin-E-Mail-Adresse",
			emailPlaceholder: "admin@beispiel.de",
			password: "Passwort",
			showPassword: "Passwort anzeigen",
			hidePassword: "Passwort ausblenden",
			submitting: "Bitte warten",
			backHome: "Zur Startseite",
			validation: {
				email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
				passwordRequired: "Bitte geben Sie Ihr Passwort ein.",
				confirmPassword: "Die Passwörter stimmen nicht überein.",
				otp: "Bitte geben Sie den sechsstelligen Code ein.",
			},
			passwordRules: [
				"Mindestens 12 Zeichen",
				"Mindestens ein Großbuchstabe",
				"Mindestens eine Zahl",
				"Mindestens ein Sonderzeichen",
			],
		},
		signIn: {
			title: "Admin-Anmeldung",
			description:
				"Melden Sie sich mit dem verifizierten Prime Estate Administratorkonto an.",
			remember: "Angemeldet bleiben",
			forgot: "Passwort vergessen?",
			submit: "Als Admin anmelden",
			error: "Die Anmeldung war nicht erfolgreich. Prüfen Sie Ihre Angaben.",
			unverified:
				"Das Administratorkonto ist noch nicht verifiziert. Schließen Sie zuerst die kontrollierte Bereitstellung ab.",
		},
		forgot: {
			title: "Admin-Passwort zurücksetzen",
			description:
				"Geben Sie die E-Mail-Adresse des Administratorkontos ein. Wir senden einen sechsstelligen Code.",
			submit: "Code anfordern",
			back: "Zurück zur Admin-Anmeldung",
			error:
				"Die Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.",
			sentTitle: "Prüfen Sie Ihr Postfach",
			sentDescription:
				"Wenn die Adresse zum Administratorkonto gehört, wurde ein Zurücksetzungscode gesendet.",
			continue: "Code eingeben",
		},
		reset: {
			title: "Neues Admin-Passwort festlegen",
			description:
				"Geben Sie den Code aus Ihrer E-Mail ein und wählen Sie ein neues Passwort.",
			code: "Zurücksetzungscode",
			newPassword: "Neues Passwort",
			confirmPassword: "Neues Passwort bestätigen",
			submit: "Passwort speichern",
			error:
				"Der Code ist ungültig oder abgelaufen. Fordern Sie einen neuen Code an.",
			newCode: "Neuen Code anfordern",
			successTitle: "Passwort aktualisiert",
			successDescription:
				"Ihr neues Admin-Passwort wurde gespeichert. Sie können sich jetzt anmelden.",
			signIn: "Zur Admin-Anmeldung",
		},
	},
	en: {
		common: {
			brandLabel: "Prime Estate home",
			location: "Erfurt · Thuringia",
			mediaEyebrow: "Protected administration access",
			mediaTitle: "The Prime Estate workspace.",
			mediaDescription:
				"This access is reserved for the agency's verified administrator.",
			email: "Admin email address",
			emailPlaceholder: "admin@example.com",
			password: "Password",
			showPassword: "Show password",
			hidePassword: "Hide password",
			submitting: "Please wait",
			backHome: "Back to home",
			validation: {
				email: "Enter a valid email address.",
				passwordRequired: "Enter your password.",
				confirmPassword: "The passwords do not match.",
				otp: "Enter the six-digit code.",
			},
			passwordRules: [
				"At least 12 characters",
				"At least one uppercase letter",
				"At least one number",
				"At least one special character",
			],
		},
		signIn: {
			title: "Admin sign in",
			description:
				"Sign in with the verified Prime Estate administrator account.",
			remember: "Keep me signed in",
			forgot: "Forgot password?",
			submit: "Sign in as admin",
			error: "We couldn't sign you in. Check your details and try again.",
			unverified:
				"The administrator account is not verified. Complete controlled provisioning first.",
		},
		forgot: {
			title: "Reset the admin password",
			description:
				"Enter the administrator account email and we'll send a six-digit code.",
			submit: "Request code",
			back: "Back to admin sign in",
			error: "We couldn't process the request. Please try again.",
			sentTitle: "Check your inbox",
			sentDescription:
				"If the address belongs to the administrator account, a password-reset code was sent.",
			continue: "Enter the code",
		},
		reset: {
			title: "Set a new admin password",
			description: "Enter the code from your email and choose a new password.",
			code: "Reset code",
			newPassword: "New password",
			confirmPassword: "Confirm new password",
			submit: "Save password",
			error: "The code is invalid or expired. Request a new code.",
			newCode: "Request a new code",
			successTitle: "Password updated",
			successDescription:
				"Your new admin password is saved. You can now sign in.",
			signIn: "Go to admin sign in",
		},
	},
} as const;
