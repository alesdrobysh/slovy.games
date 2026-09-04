import { render, screen } from "@testing-library/react";
import { Nav } from "@/shared/components/Nav";
import { ThemeProvider } from "@/shared/hooks/useTheme";

jest.mock("next/navigation", () => ({
	usePathname: () => "/valoshka",
}));

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: () => ({
		matches: false,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
	}),
});

describe("Nav", () => {
	it("allows the game title to shrink beside mobile actions", () => {
		render(
			<ThemeProvider>
				<Nav
					pathname="/valoshka"
					onHelpClick={jest.fn()}
					extraActions={<button type="button">Учора</button>}
				/>
			</ThemeProvider>
		);

		expect(screen.getByText("Валошка").parentElement).toHaveClass("min-w-0");
	});
});
