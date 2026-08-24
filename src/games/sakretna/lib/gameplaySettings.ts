export interface GameplaySettings {
	stickyTitle: boolean;
	autoScroll: boolean;
	letterCounts: boolean;
}

export const DEFAULT_GAMEPLAY_SETTINGS: GameplaySettings = {
	stickyTitle: true,
	autoScroll: true,
	letterCounts: true,
};

const SETTINGS_KEY = "sakretna:gameplay-settings:v1";

export function loadGameplaySettings(): GameplaySettings {
	if (typeof window === "undefined") return DEFAULT_GAMEPLAY_SETTINGS;
	try {
		const stored = JSON.parse(
			window.localStorage.getItem(SETTINGS_KEY) ?? "{}"
		) as Partial<GameplaySettings>;
		return { ...DEFAULT_GAMEPLAY_SETTINGS, ...stored };
	} catch {
		return DEFAULT_GAMEPLAY_SETTINGS;
	}
}

export function saveGameplaySettings(settings: GameplaySettings): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	} catch {
		// Settings remain active for this session if storage is unavailable.
	}
}
