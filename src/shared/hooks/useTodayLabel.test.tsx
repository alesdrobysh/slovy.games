import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { useTodayLabel } from "./useTodayLabel";

function Dateline() {
	return <span data-testid="date">{useTodayLabel()}</span>;
}

describe("useTodayLabel", () => {
	beforeEach(() => jest.useFakeTimers());
	afterEach(() => jest.useRealTimers());

	it("hydrates build-time HTML with the current date", () => {
		jest.setSystemTime(new Date("2026-11-03T12:00:00Z"));
		const container = document.createElement("div");
		container.innerHTML = renderToString(<Dateline />);
		expect(container.textContent).toBe("");
		document.body.appendChild(container);

		jest.setSystemTime(new Date("2026-11-14T12:00:00Z"));
		const view = render(<Dateline />, { container, hydrate: true });
		expect(screen.getByTestId("date")).toHaveTextContent("сб, 14 лістапада");
		view.unmount();
		container.remove();
	});

	it("updates at Minsk midnight while the page stays open", () => {
		jest.setSystemTime(new Date("2026-11-14T20:59:59Z"));
		render(<Dateline />);
		expect(screen.getByTestId("date")).toHaveTextContent("сб, 14 лістапада");
		act(() => jest.advanceTimersByTime(1000));
		expect(screen.getByTestId("date")).toHaveTextContent("нд, 15 лістапада");
	});

	it("catches up after a suspended tab resumes and cleans up", () => {
		jest.setSystemTime(new Date("2026-11-14T12:00:00Z"));
		const view = render(<Dateline />);
		jest.setSystemTime(new Date("2026-11-16T12:00:00Z"));
		fireEvent(document, new Event("visibilitychange"));
		expect(screen.getByTestId("date")).toHaveTextContent("пн, 16 лістапада");
		jest.setSystemTime(new Date("2026-11-17T12:00:00Z"));
		fireEvent(window, new Event("pageshow"));
		expect(screen.getByTestId("date")).toHaveTextContent("аў, 17 лістапада");
		view.unmount();
		expect(jest.getTimerCount()).toBe(0);
	});
});
