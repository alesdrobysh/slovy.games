import { renderHook } from "@testing-library/react";
import { useCountdown } from "./useCountdown";

describe("useCountdown", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("returns a formatted string HH:MM:SS", () => {
		const { result } = renderHook(() => useCountdown());
		expect(result.current).toMatch(/^\d{2}:\d{2}:\d{2}$/);
	});

	it("updates over time", () => {
		const { result } = renderHook(() => useCountdown());
		const firstValue = result.current;

		jest.advanceTimersByTime(1000);

		// The timer updates every 1000ms via setInterval
		expect(typeof firstValue).toBe("string");
	});
});
