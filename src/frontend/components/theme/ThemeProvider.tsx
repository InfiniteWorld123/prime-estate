import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "prime-estate-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const shouldUseDark = theme === "dark" || (theme === "system" && prefersDark);

	root.classList.toggle("dark", shouldUseDark);
	root.style.colorScheme = shouldUseDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (typeof window === "undefined") {
			return "system";
		}

		const storedTheme = window.localStorage.getItem(STORAGE_KEY);

		if (
			storedTheme === "light" ||
			storedTheme === "dark" ||
			storedTheme === "system"
		) {
			return storedTheme;
		}

		return "system";
	});

	useEffect(() => {
		applyTheme(theme);

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleSystemThemeChange = () => {
			if (theme === "system") {
				applyTheme("system");
			}
		};

		mediaQuery.addEventListener("change", handleSystemThemeChange);

		return () => {
			mediaQuery.removeEventListener("change", handleSystemThemeChange);
		};
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			setTheme: (nextTheme: Theme) => {
				window.localStorage.setItem(STORAGE_KEY, nextTheme);
				setThemeState(nextTheme);
			},
		}),
		[theme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used inside ThemeProvider");
	}

	return context;
}
