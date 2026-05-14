"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Theme } from "@/shared/lib/storage";
import { computeInitialTheme, setStoredTheme } from "@/shared/lib/storage";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme(): ThemeContextType {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setThemeState(computeInitialTheme());
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		document.documentElement.dataset.theme = theme === "dark" ? "dark" : "";
		setStoredTheme(theme);
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) {
			meta.setAttribute("content", theme === "dark" ? "#0e0f1a" : "#f5f0e8");
		}
	}, [theme, mounted]);

	const toggleTheme = useCallback(() => {
		setThemeState((prev) => (prev === "light" ? "dark" : "light"));
	}, []);

	const setTheme = useCallback((t: Theme) => {
		setThemeState(t);
	}, []);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
