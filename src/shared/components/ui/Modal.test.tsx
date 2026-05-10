import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
	it("renders nothing when closed", () => {
		const { container } = render(
			<Modal isOpen={false} onClose={jest.fn()}>
				<p>Content</p>
			</Modal>,
		);
		expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
	});

	it("renders title and children when open", () => {
		render(
			<Modal isOpen={true} onClose={jest.fn()} title="Test Title">
				<p>Modal body</p>
			</Modal>,
		);
		expect(screen.getByText("Test Title")).toBeInTheDocument();
		expect(screen.getByText("Modal body")).toBeInTheDocument();
	});

	it("calls onClose when Escape is pressed", async () => {
		const onClose = jest.fn();
		render(
			<Modal isOpen={true} onClose={onClose} title="Esc test">
				<p>Body</p>
			</Modal>,
		);
		await userEvent.keyboard("{Escape}");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("calls onClose when backdrop is clicked", async () => {
		const onClose = jest.fn();
		render(
			<Modal isOpen={true} onClose={onClose} title="Backdrop test">
				<p>Body</p>
			</Modal>,
		);
		await userEvent.click(screen.getByRole("dialog").parentElement!);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not call onClose when dialog content is clicked", async () => {
		const onClose = jest.fn();
		render(
			<Modal isOpen={true} onClose={onClose} title="Content click">
				<p>Body</p>
			</Modal>,
		);
		await userEvent.click(screen.getByText("Body"));
		expect(onClose).not.toHaveBeenCalled();
	});
});
