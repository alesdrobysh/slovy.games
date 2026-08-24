import {
	DEFAULT_GAMEPLAY_SETTINGS,
	loadGameplaySettings,
	saveGameplaySettings,
} from "./gameplaySettings";

describe("gameplay settings", () => {
	beforeEach(() => localStorage.clear());

	it("persists all mobile gameplay preferences", () => {
		const settings = {
			stickyTitle: false,
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
