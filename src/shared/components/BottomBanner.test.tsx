import { act, render, screen } from "@testing-library/react";
import { BottomBanner } from "./BottomBanner";

describe("BottomBanner", () => {
	const rect = {
		x: 0,
		y: 700,
		width: 360,
		height: 100,
		top: 700,
		right: 360,
		bottom: 800,
		left: 0,
		toJSON: () => ({}),
	};

	beforeEach(() => {
		jest
			.spyOn(HTMLElement.prototype, "getBoundingClientRect")
			.mockReturnValue(rect);
	});

	afterEach(() => {
		jest.restoreAllMocks();
		document.documentElement.style.removeProperty("--bottom-banner-height");
	});

	it("reserves its measured height for fixed gameplay controls", () => {
		const { unmount } = render(
			<BottomBanner
				ariaLabel="Cookies"
				message="Message"
				buttonLabel="OK"
				onAction={jest.fn()}
				isVisible
			/>
		);

		expect(screen.getByRole("status", { name: "Cookies" })).toBeInTheDocument();
		expect(
			document.documentElement.style.getPropertyValue("--bottom-banner-height")
		).toBe("100px");

		act(() => unmount());
		expect(
			document.documentElement.style.getPropertyValue("--bottom-banner-height")
		).toBe("");
	});
});
