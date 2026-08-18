import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
	it("renders children", () => {
		render(<Button onClick={jest.fn()}>Падказка</Button>);
		expect(screen.getByText("Падказка")).toBeInTheDocument();
	});

	it("calls onClick when clicked", async () => {
		const onClick = jest.fn();
		render(<Button onClick={onClick}>Click</Button>);
		await userEvent.click(screen.getByText("Click"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("does not call onClick when disabled", async () => {
		const onClick = jest.fn();
		render(
			<Button onClick={onClick} disabled>
				Click
			</Button>
		);
		await userEvent.click(screen.getByRole("button"));
		expect(onClick).not.toHaveBeenCalled();
	});

	it("renders variant × color combinations without crashing", () => {
		const variants = ["solid", "outline", "ghost"] as const;
		const colors = ["primary", "neutral"] as const;
		for (const variant of variants) {
			for (const color of colors) {
				const { unmount } = render(
					<Button variant={variant} color={color} onClick={jest.fn()}>
						{variant} {color}
					</Button>
				);
				expect(screen.getByText(`${variant} ${color}`)).toBeInTheDocument();
				unmount();
			}
		}
	});

	it("renders icon-only with startIcon and no children", () => {
		render(
			<Button
				variant="ghost"
				color="neutral"
				startIcon={<span data-testid="svg">S</span>}
				aria-label="Share"
				onClick={jest.fn()}
			/>
		);
		expect(screen.getByTestId("svg")).toBeInTheDocument();
		expect(screen.getByRole("button")).toHaveClass("btn-icon-only");
	});

	it("renders startIcon + children as a text button (not icon-only)", () => {
		render(
			<Button
				variant="solid"
				color="primary"
				startIcon={<span data-testid="svg">S</span>}
				onClick={jest.fn()}
			>
				Label
			</Button>
		);
		expect(screen.getByText("Label")).toBeInTheDocument();
		expect(screen.getByTestId("svg")).toBeInTheDocument();
		expect(screen.getByRole("button")).not.toHaveClass("btn-icon-only");
	});

	it("applies dashed class when dashed prop is set", () => {
		render(
			<Button variant="outline" color="neutral" dashed onClick={jest.fn()}>
				Give up
			</Button>
		);
		expect(screen.getByRole("button")).toHaveClass("btn-dashed");
	});

	it("renders as a link when href is provided", () => {
		render(
			<Button href="/stats" variant="solid" color="primary">
				Stats
			</Button>
		);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/stats");
		expect(link).toHaveTextContent("Stats");
	});

	it("passes an accessible name to custom link elements", () => {
		render(
			<Button
				as="a"
				href="/stats"
				aria-label="Статыстыка"
				startIcon={<span />}
				variant="ghost"
				color="neutral"
			/>
		);
		expect(
			screen.getByRole("link", { name: "Статыстыка" })
		).toBeInTheDocument();
	});
	it("renders as a custom element when as is provided", () => {
		const CustomLink = ({
			href,
			...rest
		}: {
			href: string;
			children: React.ReactNode;
		}) => <a href={href} {...rest} />;
		render(
			<Button as={CustomLink} href="/about">
				About
			</Button>
		);
		expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
	});
});
