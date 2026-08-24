jest.mock("belmorph", () => ({}), { virtual: true });

import type { Article, SavedProgress } from "../types";
import { buildShareText } from "./FinishCard";

describe("Sakretna share payload", () => {
	it("is spoiler-safe and identifies the daily puzzle", () => {
		const article = { id: "мінск", title: "Мінск" } as Article;
		const progress = {
			date: "2026-07-11",
			articleId: article.id,
			guesses: ["горад", "сталіца"],
			foundLemmas: ["горад"],
			hintsUsed: 1,
			startedAt: "2026-07-11T10:00:00Z",
			finishedAt: "2026-07-11T10:02:03Z",
		} as SavedProgress;
		const text = buildShareText("win", article, progress);

		expect(text).toContain("Сакрэтна #1 · 2026-07-11");
		expect(text).toContain("🟧🟧🟩");
		expect(text).toContain("2 спроб · падказка: так · 2:03");
		expect(text).toContain("/sakretna/day/2026-07-11");
		expect(text).not.toContain("Мінск");
	});
});
