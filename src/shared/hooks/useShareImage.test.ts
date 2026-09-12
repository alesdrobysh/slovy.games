import { act, renderHook } from "@testing-library/react";
import { useShareImage } from "./useShareImage";

jest.mock("posthog-js", () => ({ capture: jest.fn() }));

const blob = new Blob(["png"], { type: "image/png" });

function options(over: Partial<Parameters<typeof useShareImage>[0]> = {}) {
	return {
		getBlob: jest.fn(async () => blob),
		filename: "slovy-2026.png",
		text: "Мой 2026 у Словах",
		url: "https://slovy.games/",
		...over,
	};
}

beforeEach(() => {
	jest.clearAllMocks();
	Object.assign(navigator, {
		share: undefined,
		canShare: undefined,
		clipboard: { writeText: jest.fn(async () => undefined) },
	});
	URL.createObjectURL = jest.fn(() => "blob:fake");
	URL.revokeObjectURL = jest.fn();
});

describe("useShareImage", () => {
	it("shares the file when canShare accepts files", async () => {
		const share = jest.fn(async () => undefined);
		Object.assign(navigator, { share, canShare: () => true });

		const { result } = renderHook(() => useShareImage(options()));
		await act(async () => {
			await result.current.share();
		});

		expect(share).toHaveBeenCalledTimes(1);
		expect(result.current.feedback).toBe("shared");
	});

	it("downloads when file sharing is unavailable", async () => {
		const click = jest.spyOn(HTMLAnchorElement.prototype, "click");
		click.mockImplementation(() => undefined);

		const { result } = renderHook(() => useShareImage(options()));
		await act(async () => {
			await result.current.share();
		});

		expect(click).toHaveBeenCalledTimes(1);
		expect(result.current.feedback).toBe("downloaded");
		click.mockRestore();
	});

	it("falls back to copying text when the blob cannot be produced", async () => {
		const writeText = jest.fn(async () => undefined);
		Object.assign(navigator, { clipboard: { writeText } });

		const { result } = renderHook(() =>
			useShareImage(
				options({
					getBlob: jest.fn(async () => {
						throw new Error("no canvas");
					}),
				})
			)
		);
		await act(async () => {
			await result.current.share();
		});

		expect(writeText).toHaveBeenCalledWith(
			expect.stringContaining("Мой 2026 у Словах")
		);
		expect(result.current.feedback).toBe("copied");
		expect(result.current.showToast).toBe(true);
	});

	it("reports failure when nothing works", async () => {
		Object.assign(navigator, {
			clipboard: {
				writeText: jest.fn(async () => {
					throw new Error("denied");
				}),
			},
		});

		const { result } = renderHook(() =>
			useShareImage(
				options({
					getBlob: jest.fn(async () => {
						throw new Error("no canvas");
					}),
				})
			)
		);
		await act(async () => {
			await result.current.share();
		});

		expect(result.current.feedback).toBe("failed");
	});

	it("ignores an aborted native share without reporting failure", async () => {
		const abort = Object.assign(new Error("abort"), { name: "AbortError" });
		Object.assign(navigator, {
			share: jest.fn(async () => {
				throw abort;
			}),
			canShare: () => true,
		});

		const { result } = renderHook(() => useShareImage(options()));
		await act(async () => {
			await result.current.share();
		});

		expect(result.current.feedback).toBeNull();
	});
});
