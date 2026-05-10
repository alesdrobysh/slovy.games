import { act, renderHook } from "@testing-library/react";
import { useShare } from "./useShare";

describe("useShare", () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("starts with isSharing=false and showToast=false", () => {
		const { result } = renderHook(() => useShare("hello"));
		expect(result.current.isSharing).toBe(false);
		expect(result.current.showToast).toBe(false);
	});

	it("falls back to clipboard when navigator.share is unavailable", async () => {
		const writeText = jest.fn().mockResolvedValue(undefined);
		Object.assign(navigator, { clipboard: { writeText } });

		// Ensure Web Share API is unavailable
		Object.defineProperty(navigator, "share", { value: undefined, writable: true });

		const { result } = renderHook(() => useShare("test text"));

		await act(async () => {
			await result.current.share();
		});

		expect(writeText).toHaveBeenCalledWith("test text");
		expect(result.current.showToast).toBe(true);

		act(() => jest.advanceTimersByTime(2100));
		expect(result.current.showToast).toBe(false);
	});
});
