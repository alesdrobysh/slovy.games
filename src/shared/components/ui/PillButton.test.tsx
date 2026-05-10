import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PillButton } from "./PillButton";

describe("PillButton", () => {
	it("renders children", () => {
		render(<PillButton onClick={jest.fn()}>Падказка</PillButton>);
		expect(screen.getByText("Падказка")).toBeInTheDocument();
	});

	it("calls onClick when clicked", async () => {
		const onClick = jest.fn();
		render(<PillButton onClick={onClick}>Click</PillButton>);
		await userEvent.click(screen.getByText("Click"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("does not call onClick when disabled", async () => {
		const onClick = jest.fn();
		render(
			<PillButton onClick={onClick} disabled>
				Click
			</PillButton>
		);
		await userEvent.click(screen.getByRole("button"));
		expect(onClick).not.toHaveBeenCalled();
	});
});
