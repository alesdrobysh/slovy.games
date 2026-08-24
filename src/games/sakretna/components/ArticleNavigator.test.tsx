import { fireEvent, render, screen } from "@testing-library/react";
import { ArticleNavigator } from "./ArticleNavigator";

describe("ArticleNavigator", () => {
	it("moves between every occurrence and returns to the article title", () => {
		const scrollIntoView = jest.fn();
		Element.prototype.scrollIntoView = scrollIntoView;
		document.body.innerHTML = `
			<div id="sakretna-article-top"></div>
			<span data-sakretna-lemma="мінск">Мінск</span>
			<span data-sakretna-lemma="мінск">Мінску</span>
		`;
		render(<ArticleNavigator highlighted="мінск" />);

		expect(screen.getByText("1 / 2")).toBeInTheDocument();
		fireEvent.click(
			screen.getByRole("button", { name: "Наступнае супадзенне" })
		);
		expect(screen.getByText("2 / 2")).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: "Да назвы артыкула" }));
		expect(scrollIntoView).toHaveBeenCalledTimes(2);
	});
});
