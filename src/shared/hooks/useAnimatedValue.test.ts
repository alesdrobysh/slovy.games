import { act, renderHook } from "@testing-library/react";
import { useAnimatedValue } from "./useAnimatedValue";

describe("useAnimatedValue", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		let handle = 0;
		const timers = new Map<number, number>();
		jest
			.spyOn(window, "requestAnimationFrame")
			.mockImplementation((cb: FrameRequestCallback) => {
				const id = ++handle;
				timers.set(
					id,
					window.setTimeout(() => {
						timers.delete(id);
						cb(performance.now());
					}, 16),
				);
				return id;
			});
		jest
			.spyOn(window, "cancelAnimationFrame")
			.mockImplementation((id: number) => {
				const timer = timers.get(id);
				if (timer !== undefined) {
					clearTimeout(timer);
					timers.delete(id);
				}
			});
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	it("starts at 0 and animates toward target", () => {
		const { result } = renderHook(() => useAnimatedValue(42, 900));

		// Initially 0
		expect(result.current).toBe(0);

		// At ~halfway, should be between 0 and target
		act(() => { jest.advanceTimersByTime(450); });
		expect(result.current).toBeGreaterThan(0);
		expect(result.current).toBeLessThan(42);

		// After full animation duration
		act(() => { jest.advanceTimersByTime(600); });
		expect(result.current).toBe(42);
	});

	it("updates when target changes", () => {
		const { result, rerender } = renderHook(
			({ target }) => useAnimatedValue(target, 900),
			{ initialProps: { target: 10 } },
		);

		expect(result.current).toBe(0);

		act(() => {
			jest.advanceTimersByTime(1000);
		});
		expect(result.current).toBe(10);

		rerender({ target: 20 });

		act(() => {
			jest.advanceTimersByTime(1000);
		});
		expect(result.current).toBe(20);
	});

	it("cleans up animation frame on unmount", () => {
		const { unmount } = renderHook(() => useAnimatedValue(100));
		unmount();
		expect(cancelAnimationFrame).toHaveBeenCalled();
	});
});
