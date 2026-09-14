import { render, screen } from "@testing-library/react";
import { ActionButtons } from "./ActionButtons";
import { Cornflower } from "./Cornflower";

it("marks only the repetitive game controls for autocapture exclusion", () => {
	render(
		<>
			<Cornflower
				center="а"
				outer={["б", "в", "г", "д", "е", "ж"]}
				onLetter={() => {}}
			/>
			<ActionButtons
				onDelete={() => {}}
				onShuffle={() => {}}
				onSubmit={() => {}}
				onHint={() => {}}
				onOpenGrid={() => {}}
				hintCredits={2}
			/>
		</>
	);

	expect(screen.getByLabelText("Гульнёвая дошка")).toHaveClass(
		"ph-no-autocapture"
	);
	expect(screen.getByRole("button", { name: "Сцерці" })).toHaveClass(
		"ph-no-autocapture"
	);
	expect(screen.getByRole("button", { name: "Увесці" })).toHaveClass(
		"ph-no-autocapture"
	);
	expect(screen.getByRole("button", { name: "Змяшаць" })).not.toHaveClass(
		"ph-no-autocapture"
	);
});
