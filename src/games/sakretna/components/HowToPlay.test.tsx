import { fireEvent, render, screen } from "@testing-library/react";
import { HowToPlay } from "./HowToPlay";

describe("HowToPlay", () => {
	it("explains the complete first-run loop and can be skipped", () => {
		const onClose = jest.fn();
		render(<HowToPlay isOpen isFirstRun onClose={onClose} />);

		const rules = screen.getByRole("list", { name: "Правілы гульні" });
		expect(rules).toHaveTextContent("усе іх формы");
		expect(rules).toHaveTextContent("колькасць схаваных літар");
		expect(rules).toHaveTextContent("Тры падказкі");
		expect(rules).toHaveTextContent("перамога залічыцца");

		fireEvent.click(screen.getByRole("button", { name: "Прапусціць" }));
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
