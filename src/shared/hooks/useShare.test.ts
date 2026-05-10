import { act, renderHook } from "@testing-library/react";
import { useShare } from "./useShare";

describe("useShare", () => {
	const originalClipboard = { ...navigator.clipboard };
	const originalShare = navigator.share;

	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
		Object.defineProperty(navigator, "share", { value: originalShare, writable: true });
		Object.assign(navigator, { clipboard: originalClipboard });
	});

	it("starts with isSharing=false and showToast=false", () => {
		const { result } = renderHook(() => useShare("hello"));
		expect(result.current.isSharing).toBe(false);
		expect(result.current.showToast).toBe(false);
	});

	it("falls back to clipboard when navigator.share is unavailable", async () => {
		const writeText = jest.fn().mockResolvedValue(undefined);
		Object.assign(navigator, { clipboard: { writeText } });

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

	it("uses Web Share API when available", async () => {
		const share = jest.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "share", { value: share, writable: true });

		const { result } = renderHook(() => useShare("test text"));

		await act(async () => {
			await result.current.share();
		});

		expect(share).toHaveBeenCalledWith({ text: "test text" });
		expect(result.current.showToast).toBe(false);
	});

	it("does not fall back to clipboard on AbortError", async () => {
		const share = jest.fn().mockRejectedValue(
			Object.assign(new Error("User dismissed"), { name: "AbortError" })
		);
		Object.defineProperty(navigator, "share", { value: share, writable: true });
		const writeText = jest.fn().mockResolvedValue(undefined);
		Object.assign(navigator, { clipboard: { writeText } });

		const { result } = renderHook(() => useShare("test text"));

		await act(async () => {
			await result.current.share();
		});

		expect(writeText).not.toHaveBeenCalled();
		expect(result.current.showToast).toBe(false);
	});

	it("does not show toast on clipboard failure", async () => {
		Object.defineProperty(navigator, "share", { value: undefined, writable: true });
		const writeText = jest.fn().mockRejectedValue(new Error("denied"));
		Object.assign(navigator, { clipboard: { writeText } });

		const { result } = renderHook(() => useShare("test text"));

		await act(async () => {
			await result.current.share();
		});

		expect(result.current.showToast).toBe(false);
	});
});
