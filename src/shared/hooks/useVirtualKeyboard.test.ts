import { act, renderHook } from "@testing-library/react";
import { useVirtualKeyboard } from "./useVirtualKeyboard";

type Listener = () => void;

function installVisualViewport(height: number, offsetTop = 0) {
	const listeners = new Map<string, Set<Listener>>();
	const viewport = {
		height,
		offsetTop,
		addEventListener: (type: string, listener: Listener) => {
			listeners.set(type, (listeners.get(type) ?? new Set()).add(listener));
		},
		removeEventListener: (type: string, listener: Listener) => {
			listeners.get(type)?.delete(listener);
		},
		emit(type: string) {
			for (const listener of listeners.get(type) ?? []) listener();
		},
	};
	Object.defineProperty(window, "visualViewport", {
		configurable: true,
		value: viewport,
	});
	return viewport;
}

function installMatchMedia(coarse: boolean) {
	Object.defineProperty(window, "matchMedia", {
		configurable: true,
		value: (query: string) => ({
			matches: query === "(pointer: coarse)" ? coarse : false,
			media: query,
			addEventListener: () => {},
			removeEventListener: () => {},
		}),
	});
}

describe("useVirtualKeyboard", () => {
	const root = document.documentElement;

	beforeEach(() => {
		Object.defineProperty(window, "innerHeight", {
			configurable: true,
			value: 800,
		});
		installMatchMedia(false);
	});

	afterEach(() => {
		root.removeAttribute("data-keyboard");
		root.style.removeProperty("--keyboard-inset");
		document.body.innerHTML = "";
	});

	it("reports a closed keyboard when the visual viewport fills the window", () => {
		installVisualViewport(800);
		const { result } = renderHook(() => useVirtualKeyboard());

		expect(result.current).toEqual({ open: false, inset: 0 });
		expect(root.dataset.keyboard).toBe("closed");
		expect(root.style.getPropertyValue("--keyboard-inset")).toBe("0px");
	});

	it("measures the keyboard inset when the visual viewport shrinks", () => {
		const viewport = installVisualViewport(800);
		const { result } = renderHook(() => useVirtualKeyboard());

		act(() => {
			viewport.height = 460;
			viewport.offsetTop = 40;
			viewport.emit("resize");
		});

		expect(result.current).toEqual({ open: true, inset: 300 });
		expect(root.dataset.keyboard).toBe("open");
		expect(root.style.getPropertyValue("--keyboard-inset")).toBe("300px");
	});

	it("treats a focused text field on a touch device as an open keyboard", () => {
		installVisualViewport(800);
		installMatchMedia(true);
		const input = document.createElement("input");
		document.body.appendChild(input);
		const { result } = renderHook(() => useVirtualKeyboard());

		act(() => input.focus());
		expect(result.current.open).toBe(true);
		expect(root.dataset.keyboard).toBe("open");

		act(() => input.blur());
		expect(result.current.open).toBe(false);
		expect(root.dataset.keyboard).toBe("closed");
	});

	it("ignores focus on devices with a fine pointer", () => {
		installVisualViewport(800);
		const input = document.createElement("input");
		document.body.appendChild(input);
		const { result } = renderHook(() => useVirtualKeyboard());

		act(() => input.focus());
		expect(result.current.open).toBe(false);
	});

	it("cleans up the root attribute and variable on unmount", () => {
		installVisualViewport(800);
		const { unmount } = renderHook(() => useVirtualKeyboard());
		unmount();

		expect(root.dataset.keyboard).toBeUndefined();
		expect(root.style.getPropertyValue("--keyboard-inset")).toBe("");
	});
});
