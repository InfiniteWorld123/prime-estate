import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { type Language, translations } from "./translations";

type LanguageContextValue = {
	language: Language;
	setLanguage: (language: Language) => void;
	copy: (typeof translations)[Language];
};

const STORAGE_KEY = "prime-estate-language";
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguageState] = useState<Language>("de");

	useEffect(() => {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		const detected = window.navigator.language.toLowerCase().startsWith("de")
			? "de"
			: "en";
		setLanguageState(stored === "de" || stored === "en" ? stored : detected);
	}, []);

	useEffect(() => {
		document.documentElement.lang = language;
		document.title = translations[language].meta.title;
		const description = document.querySelector<HTMLMetaElement>(
			'meta[name="description"]',
		);
		description?.setAttribute(
			"content",
			translations[language].meta.description,
		);
	}, [language]);

	const value = useMemo(
		() => ({
			language,
			copy: translations[language],
			setLanguage: (nextLanguage: Language) => {
				window.localStorage.setItem(STORAGE_KEY, nextLanguage);
				setLanguageState(nextLanguage);
			},
		}),
		[language],
	);

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context)
		throw new Error("useLanguage must be used inside LanguageProvider");
	return context;
}
