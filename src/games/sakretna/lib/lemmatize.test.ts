import posthog from "posthog-js";
import { belmorphMock } from "./belmorph.mock";

const dictError = new RangeError(
	"Offset is outside the bounds of the DataView"
);

jest.mock(
	"belmorph",
	() => ({ ...belmorphMock, loadDictAsync: () => Promise.reject(dictError) }),
	{ virtual: true }
);
jest.mock("posthog-js", () => ({ captureException: jest.fn() }));

import { lemmaReady, lemmasOf } from "./lemmatize";

it("resolves lemmaReady and falls back to the lowercased word when the dictionary fails to load", async () => {
	jest.spyOn(console, "error").mockImplementation(() => {});

	await expect(lemmaReady).resolves.toBeUndefined();
	expect(posthog.captureException).toHaveBeenCalledWith(dictError);
	expect(lemmasOf("Слова")).toEqual(["слова"]);
});
