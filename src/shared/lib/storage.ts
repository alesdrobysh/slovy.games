const THEME_KEY = "theme";

export type Theme = "light" | "dark";

export function getStoredTheme(): Theme | null {
	if (typeof window === "undefined") return null;
	const stored = localStorage.getItem(THEME_KEY);
	if (stored === "light" || stored === "dark") return stored;
	return null;
}

export function setStoredTheme(theme: Theme): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(THEME_KEY, theme);
}

export function getSystemTheme(): Theme {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function computeInitialTheme(): Theme {
	const stored = getStoredTheme();
	if (stored) return stored;
	return getSystemTheme();
}
