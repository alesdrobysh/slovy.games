import { scrollIntoVisualViewport } from "./scrollIntoVisualViewport";

describe("scrollIntoVisualViewport", () => {
	afterEach(() => {
		Object.defineProperty(window, "visualViewport", {
			configurable: true,
			value: undefined,
		});
	});

	it("centres the element inside the visual viewport, not the layout viewport", () => {
		Object.defineProperty(window, "visualViewport", {
			configurable: true,
			value: { height: 400, offsetTop: 0 },
		});
		const element = document.createElement("span");
		element.getBoundingClientRect = () => ({ top: 700, height: 20 }) as DOMRect;
		const scrollBy = jest.fn();
		window.scrollBy = scrollBy;

		scrollIntoVisualViewport(element);

		// element centre 710, visual viewport centre 200 → scroll down by 510
		expect(scrollBy).toHaveBeenCalledWith({ top: 510, behavior: "smooth" });
	});

	it("accounts for the visual viewport offset when the page is panned", () => {
		Object.defineProperty(window, "visualViewport", {
			configurable: true,
			value: { height: 400, offsetTop: 100 },
		});
		const element = document.createElement("span");
		element.getBoundingClientRect = () => ({ top: 300, height: 0 }) as DOMRect;
		const scrollBy = jest.fn();
		window.scrollBy = scrollBy;

		scrollIntoVisualViewport(element);

		expect(scrollBy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
	});

	it("falls back to scrollIntoView without a visual viewport", () => {
		const element = document.createElement("span");
		element.scrollIntoView = jest.fn();

		scrollIntoVisualViewport(element);

		expect(element.scrollIntoView).toHaveBeenCalledWith({
			behavior: "smooth",
			block: "center",
		});
	});
});
