import { fireEvent, render, screen } from "@testing-library/react";
import { CompletionOverlay } from "./CompletionOverlay";

const article = {
	id: "minsk",
	title: "Мінск",
	body: "Мінск — сталіца Беларусі.",
	source: "https://be.wikipedia.org/wiki/Мінск",
	retrieved: "2026-08-24",
};

const progress = {
	date: "2026-08-24",
	articleId: article.id,
	foundLemmas: ["мінск"],
	guesses: ["мінск"],
	won: true,
	givenUp: false,
	hintsUsed: 0,
};

describe("CompletionOverlay", () => {
	it("announces the result immediately and focuses it", () => {
		render(
			<CompletionOverlay
				open
				mode="win"
				article={article}
				progress={progress}
				onReadArticle={jest.fn()}
			/>
		);

		const dialog = screen.getByRole("dialog", { name: "Гульня выйграна" });
		expect(dialog).toHaveFocus();
		expect(screen.getByText("Мінск")).toBeInTheDocument();
	});

	it("keeps the article behind an explicit secondary action", () => {
		const onReadArticle = jest.fn();
		render(
			<CompletionOverlay
				open
				mode="lose"
				article={article}
				progress={{ ...progress, won: false, givenUp: true }}
				onReadArticle={onReadArticle}
			/>
		);

		fireEvent.click(
			screen.getByRole("button", {
				name: "Паглядзець расшыфраваны артыкул",
			})
		);
		expect(onReadArticle).toHaveBeenCalledTimes(1);
	});
});
