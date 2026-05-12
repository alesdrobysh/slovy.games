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

	it("uses accent color when accent=true", () => {
		render(<StatCard label="Тэст" value={1} accent />);
		const value = screen.getByText("1");
		expect(value).toHaveClass("text-pobach");
	});

	it("has uppercase tracking on label", () => {
		render(<StatCard label="Тэст" value={1} />);
		const label = screen.getByText("Тэст");
		expect(label.className).toContain("uppercase");
		expect(label.className).toContain("tracking-");
	});
});
