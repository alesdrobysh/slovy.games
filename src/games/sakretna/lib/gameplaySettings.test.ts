import {
	DEFAULT_GAMEPLAY_SETTINGS,
	loadGameplaySettings,
	saveGameplaySettings,
} from "./gameplaySettings";

describe("gameplay settings", () => {
	beforeEach(() => localStorage.clear());

	it("persists the available gameplay preferences", () => {
		const settings = {
			autoScroll: false,
			letterCounts: true,
		};
		saveGameplaySettings(settings);
		expect(loadGameplaySettings()).toEqual(settings);
	});

	it("uses low-friction defaults", () => {
		expect(loadGameplaySettings()).toEqual(DEFAULT_GAMEPLAY_SETTINGS);
	});
});
