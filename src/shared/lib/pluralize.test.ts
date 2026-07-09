import { pluralize } from "./pluralize";

// "belmorph" only ships an ESM "import" export condition, so it can't be
// `require()`d under ts-jest's CJS transform; `virtual: true` registers the
// mock without Jest trying to resolve the real package first.
jest.mock(
	"belmorph",
	() => {
		const pluralizeResult = jest.fn((count: number, targetCase: string) => ({
			word: `${targetCase}:${count}`,
		}));
		const parse = jest.fn(() => [{ pluralize: pluralizeResult }]);

		return {
			MorphAnalyzer: jest.fn().mockImplementation(() => ({ parse })),
			loadDictAsync: jest.fn(() => Promise.resolve({})),
			__mocks: { pluralizeResult, parse },
		};
	},
	{ virtual: true }
);

const { __mocks } = jest.requireMock("belmorph") as {
	__mocks: { pluralizeResult: jest.Mock; parse: jest.Mock };
};

// pluralize.ts loads the analyzer asynchronously on import (module-level
// `loadDictAsync(...).then(...)`); let that microtask settle before assertions.
const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("pluralize", () => {
	beforeAll(async () => {
		await flushMicrotasks();
	});

	it("delegates to the parsed word's pluralize(count, targetCase), defaulting to nominative", () => {
		expect(pluralize(31, "слова")).toBe("nominative:31");
		expect(__mocks.pluralizeResult).toHaveBeenCalledWith(31, "nominative");
	});

	it("forwards an explicit targetCase", () => {
		expect(pluralize(2, "слова", "instrumental")).toBe("instrumental:2");
		expect(__mocks.pluralizeResult).toHaveBeenCalledWith(2, "instrumental");
	});

	it("falls back to the original word when the analyzer has no parse for it", () => {
		__mocks.parse.mockReturnValueOnce([]);
		expect(pluralize(5, "невядомае-слова")).toBe("невядомае-слова");
	});

	it("falls back to the original word when pluralize() finds no matching form", () => {
		__mocks.pluralizeResult.mockReturnValueOnce(null);
		expect(pluralize(5, "слова")).toBe("слова");
	});
});
