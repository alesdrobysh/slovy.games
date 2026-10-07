import { fireEvent, render, screen } from "@testing-library/react";
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
	it("shows the game title and the menu button in game mode", () => {
		render(
			<ThemeProvider>
				<Nav pathname="/valoshka" onHelpClick={jest.fn()} />
			</ThemeProvider>
		);

		expect(screen.getByText("Валошка")).toBeInTheDocument();
		expect(screen.getByLabelText("Усе гульні")).toBeInTheDocument();
		expect(screen.getByLabelText("Меню")).toBeInTheDocument();
		expect(screen.queryByLabelText("Цёмная тэма")).not.toBeInTheDocument();
	});

	it("moves help, stats, game items and theme into the menu", () => {
		const onYesterday = jest.fn();
		render(
			<ThemeProvider>
				<Nav
					pathname="/valoshka"
					onHelpClick={jest.fn()}
					menuItems={[{ label: "Учарашнія адказы", onSelect: onYesterday }]}
				/>
			</ThemeProvider>
		);

		fireEvent.click(screen.getByLabelText("Меню"));

		expect(screen.getByText("Як гуляць")).toBeInTheDocument();
		expect(screen.getByText("Статыстыка")).toBeInTheDocument();
		expect(screen.getByText("Цёмная тэма")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Учарашнія адказы"));
		expect(onYesterday).toHaveBeenCalled();
	});

	it("has no back button on the hub", () => {
		render(
			<ThemeProvider>
				<Nav pathname="/" />
			</ThemeProvider>
		);

		expect(screen.getByText("Словы")).toBeInTheDocument();
		expect(screen.queryByLabelText("Усе гульні")).not.toBeInTheDocument();
	});
});
