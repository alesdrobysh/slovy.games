import { belmorphMock } from "./belmorph.mock";

// `belmorph` only ships an ESM `import` export condition; virtual: true
// registers the mock without Jest trying to resolve the real package.
jest.mock("belmorph", () => belmorphMock, { virtual: true });

import { titleTranslationLemmas } from "./titleTranslations";
import { tokenize } from "./tokenize";

const lower = (word: string) => word.toLowerCase();

function translationsOf(title: string, body: string): string[] {
	return [
		...titleTranslationLemmas(tokenize(body, lower), tokenize(title, lower)),
	].sort();
}

describe("titleTranslationLemmas", () => {
	it("locks a foreign name from the lead and its relatives elsewhere", () => {
		const body = [
			"Вярблюды (Camelus) — род млекакормячых падатраду мазаляногія.",
			"## Назва",
			"Лацінская назва Camelus узыходзіць праз грэчаскае κάμηλος да «гамаль».",
		].join("\n");

		expect(translationsOf("Вярблюды", body)).toEqual(["camelus", "κάμηλος"]);
	});

	it("keeps the Belarusian gloss in the lead open", () => {
		const body =
			"Планктон (грэч. πλανκτον — тыя, што блукаюць) — дробныя арганізмы.";

		expect(translationsOf("Планктон", body)).toEqual(["πλανκτον"]);
	});

	it("locks a whole Russian title, even its Belarusian-looking words", () => {
		const body = "«Вайна і мір» (руск.: «Война и мир») — раман-эпапея.";

		expect(translationsOf("Вайна і мір", body)).toEqual(["война", "мир"]);
	});

	it("matches a foreign spelling of the title outside the lead", () => {
		const body = "Арганізмы дрэйфуюць.\nАнгл. plankton — тое самае.";

		expect(translationsOf("Планктон", body)).toEqual(["plankton"]);
	});

	it("ignores foreign words in later asides", () => {
		const body =
			"Сарока — птушка, якую любіць (лац. Corvus) і ворана (Corvus corax).";

		expect(translationsOf("Сарока", body)).toEqual([]);
	});
});
