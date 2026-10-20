import { renderHook } from "@testing-library/react";
import { getMskDateString } from "@/shared/lib/timezone";
import { useStaleDayRefresh } from "./useStaleDayRefresh";

const refresh = jest.fn();
jest.mock("next/navigation", () => ({
	useRouter: () => ({ refresh }),
}));

describe("useStaleDayRefresh", () => {
	beforeEach(() => {
		refresh.mockClear();
	});

	it("does not refresh when the date is today", () => {
		renderHook(() => useStaleDayRefresh(getMskDateString()));
		document.dispatchEvent(new Event("visibilitychange"));
		expect(refresh).not.toHaveBeenCalled();
	});

	it("refreshes on mount when the date is stale", () => {
		renderHook(() => useStaleDayRefresh("2000-01-01"));
		expect(refresh).toHaveBeenCalledTimes(1);
	});

	it("refreshes when the tab becomes visible on a later day", () => {
		const today = getMskDateString();
		renderHook(() => useStaleDayRefresh(today));
		expect(refresh).not.toHaveBeenCalled();

		jest.useFakeTimers();
		jest.setSystemTime(Date.now() + 86400000);
		document.dispatchEvent(new Event("visibilitychange"));
		jest.useRealTimers();

		expect(refresh).toHaveBeenCalledTimes(1);
	});
});
