import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GiveUpModal } from "./GiveUpModal";

describe("Sakretna GiveUpModal", () => {
	it("requires confirmation before surrendering", async () => {
		const onConfirm = jest.fn();
		const onClose = jest.fn();
		const user = userEvent.setup();

		const onUseHint = jest.fn();
		render(
			<GiveUpModal
				isOpen
				onConfirm={onConfirm}
				onClose={onClose}
				onUseHint={onUseHint}
				hintsLeft={3}
				guessCount={2}
			/>
		);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(onConfirm).not.toHaveBeenCalled();

		await user.click(screen.getByRole("button", { name: "Працягнуць гульню" }));
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onConfirm).not.toHaveBeenCalled();

		expect(screen.getByText(/Засталося 3 з 3 падказак/)).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "Выбраць слова" }));
		expect(onUseHint).toHaveBeenCalledTimes(1);

		await user.click(screen.getByRole("button", { name: "Усё роўна здацца" }));
		expect(onConfirm).toHaveBeenCalledTimes(1);
	});
});
