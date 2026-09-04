import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
	it("renders label and value", () => {
		render(<StatCard label="Гульняў" value={42} />);
		expect(screen.getByText("42")).toBeInTheDocument();
		expect(screen.getByText("Гульняў")).toBeInTheDocument();
	});

	it("renders string value", () => {
		render(<StatCard label="Перамог %" value="85%" />);
		expect(screen.getByText("85%")).toBeInTheDocument();
	});

	it("uses the heading typography for the value", () => {
		render(<StatCard label="Тэст" value={1} />);
		const value = screen.getByText("1");
		expect(value).toHaveStyle({
			fontSize: "24px",
			fontWeight: "500",
		});
	});

	it("uses the overline typography for the label", () => {
		render(<StatCard label="Тэст" value={1} />);
		const label = screen.getByText("Тэст");
		expect(label).toHaveStyle({
			textTransform: "uppercase",
			letterSpacing: "0.2em",
		});
	});
});
