import { fireEvent, render, screen } from "@testing-library/react";
import { HowToPlay } from "./HowToPlay";

describe("HowToPlay", () => {
	it("explains the complete first-run loop without a skip button", () => {
		const onClose = jest.fn();
		render(<HowToPlay isOpen isFirstRun onClose={onClose} />);

		const rules = screen.getByRole("list", { name: "Правілы гульні" });
		expect(rules).toHaveTextContent("усе іх формы");
		expect(rules).toHaveTextContent("колькасць схаваных літар");
		expect(rules).toHaveTextContent("Тры падказкі");
		expect(rules).toHaveTextContent("перамога залічыцца");

		expect(
			screen.queryByRole("button", { name: "Прапусціць" })
		).not.toBeInTheDocument();
		fireEvent.click(
			screen.getByRole("button", { name: "Пачаць: увесці слова" })
		);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
