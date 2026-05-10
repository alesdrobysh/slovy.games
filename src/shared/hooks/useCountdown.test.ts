import { act, renderHook } from "@testing-library/react";
import { useCountdown } from "./useCountdown";

describe("useCountdown", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("returns HH:MM:SS format after mount", () => {
		const { result } = renderHook(() => useCountdown());
		expect(result.current).toMatch(/^\d{2}:\d{2}:\d{2}$/);
	});

	it("updates every second", () => {
		const { result } = renderHook(() => useCountdown());

		act(() => jest.advanceTimersByTime(1000));

		expect(result.current).toMatch(/^\d{2}:\d{2}:\d{2}$/);
	});
});
