import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GiveUpModal } from "./GiveUpModal";

describe("Sakretna GiveUpModal", () => {
	it("requires confirmation before surrendering", async () => {
		const onConfirm = jest.fn();
		const onClose = jest.fn();
		const user = userEvent.setup();

		render(<GiveUpModal isOpen onConfirm={onConfirm} onClose={onClose} />);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(onConfirm).not.toHaveBeenCalled();

		await user.click(screen.getByRole("button", { name: "Працягнуць гульню" }));
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(onConfirm).not.toHaveBeenCalled();

		await user.click(screen.getByRole("button", { name: "Здацца" }));
		expect(onConfirm).toHaveBeenCalledTimes(1);
	});
});
