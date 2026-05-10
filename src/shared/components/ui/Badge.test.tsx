import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
	it("renders children", () => {
		render(<Badge>✓ Сёння</Badge>);
		expect(screen.getByText("✓ Сёння")).toBeInTheDocument();
	});

	it("applies accent variant by default", () => {
		render(<Badge>Test</Badge>);
		const badge = screen.getByText("Test");
		expect(badge).toHaveClass("text-xs");
		expect(badge).toHaveClass("uppercase");
	});
});
