import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
	it("renders nothing when closed", () => {
		const { container } = render(
			<Modal isOpen={false} onClose={jest.fn()}>
				<p>Content</p>
			</Modal>
		);
		expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
	});

	it("renders title and children when open", () => {
		render(
			<Modal isOpen={true} onClose={jest.fn()} title="Test Title">
				<p>Modal body</p>
			</Modal>
		);
		expect(screen.getByText("Test Title")).toBeInTheDocument();
		expect(screen.getByText("Modal body")).toBeInTheDocument();
	});

	it("calls onClose when Escape is pressed", async () => {
		const onClose = jest.fn();
		render(
			<Modal isOpen={true} onClose={onClose} title="Esc test">
				<p>Body</p>
			</Modal>
		);
		await userEvent.keyboard("{Escape}");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("calls onClose when backdrop is clicked", async () => {
		const onClose = jest.fn();
		render(
			<Modal isOpen={true} onClose={onClose} title="Backdrop test">
				<p>Body</p>
			</Modal>
		);
		const backdrop = screen
			.getByRole("dialog")
			.closest('[role="presentation"]') as HTMLElement;
		await userEvent.click(backdrop);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not call onClose when dialog content is clicked", async () => {
		const onClose = jest.fn();
		render(
			<Modal isOpen={true} onClose={onClose} title="Content click">
				<p>Body</p>
			</Modal>
		);
		await userEvent.click(screen.getByText("Body"));
		expect(onClose).not.toHaveBeenCalled();
	});

	it("focuses the first meaningful control and traps Tab navigation", async () => {
		const trigger = document.createElement("button");
		trigger.textContent = "Open";
		document.body.append(trigger);
		trigger.focus();
		const { unmount } = render(
			<Modal isOpen onClose={jest.fn()} title="Focus test">
				<button type="button">First action</button>
				<button type="button">Last action</button>
			</Modal>
		);
		await Promise.resolve();

		const first = screen.getByRole("button", { name: "First action" });
		const last = screen.getByRole("button", { name: "Last action" });
		expect(first).toHaveFocus();
		last.focus();
		await userEvent.keyboard("{Tab}");
		expect(screen.getByRole("button", { name: "Закрыць" })).toHaveFocus();
		await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
		expect(last).toHaveFocus();

		unmount();
		expect(trigger).toHaveFocus();
		trigger.remove();
	});

	it("makes page background inert while open", () => {
		const background = document.createElement("main");
		document.body.append(background);
		const { unmount } = render(
			<Modal isOpen onClose={jest.fn()} title="Inert test">
				<button type="button">Action</button>
			</Modal>
		);
		expect(background).toHaveAttribute("inert");
		expect(background).toHaveAttribute("aria-hidden", "true");
		unmount();
		expect(background).not.toHaveAttribute("inert");
		background.remove();
	});
});
