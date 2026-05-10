import { render, screen } from "@testing-library/react";
import { Toast } from "./Toast";

describe("Toast", () => {
	it("renders message when visible", () => {
		render(<Toast message="Скапіравана!" visible={true} />);
		expect(screen.getByText("Скапіравана!")).toBeInTheDocument();
	});

	it("renders nothing when not visible", () => {
		const { container } = render(
			<Toast message="Скапіравана!" visible={false} />
		);
		expect(container.firstChild).toBeNull();
	});
});
