import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
	it("renders children", () => {
		render(<Badge>✓ Сёння</Badge>);
		expect(screen.getByText("✓ Сёння")).toBeInTheDocument();
	});

	it("applies the accent variant styling by default", () => {
		render(<Badge>Test</Badge>);
		const badge = screen.getByText("Test");
		expect(badge).toHaveClass("text-[10px]");
		expect(badge).toHaveClass("uppercase");
		expect(badge).toHaveClass("bg-valoshka/5");
		expect(badge).toHaveClass("text-valoshka");
	});
});
