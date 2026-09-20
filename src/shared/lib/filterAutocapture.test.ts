import { isNoisyAutocapture } from "./filterAutocapture";

describe("isNoisyAutocapture", () => {
	it("drops only marked interaction events", () => {
		expect(
			isNoisyAutocapture({
				event: "$autocapture",
				properties: {
					$elements_chain: "path > g > svg.ph-no-autocapture > div",
				},
			})
		).toBe(true);
		expect(
			isNoisyAutocapture({
				event: "$autocapture",
				properties: { $elements_chain: "button.btn > div" },
			})
		).toBe(false);
	});

	it("keeps explicit game events even when their properties contain the marker", () => {
		expect(
			isNoisyAutocapture({
				event: "valoshka_word_found",
				properties: { $elements_chain: "svg.ph-no-autocapture" },
			})
		).toBe(false);
	});
});
