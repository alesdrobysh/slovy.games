import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HintModal } from "./HintModal";

describe("HintModal", () => {
	it("previews the word and hit count before spending the hint", async () => {
		const onConfirm = jest.fn();
		const user = userEvent.setup();
		render(
			<HintModal
				isOpen
				preview={{ lemma: "горад", revealedCount: 3 }}
				onConfirm={onConfirm}
				onClose={jest.fn()}
			/>
		);

		expect(screen.getByText(/«горад» у 3 месцах/)).toBeInTheDocument();
		expect(onConfirm).not.toHaveBeenCalled();
		await user.click(screen.getByRole("button", { name: "Раскрыць слова" }));
		expect(onConfirm).toHaveBeenCalledTimes(1);
	});
});
