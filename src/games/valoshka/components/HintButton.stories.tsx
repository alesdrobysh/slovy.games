import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HintButton } from "./HintButton";

const meta = {
	title: "Valoshka/HintButton",
	component: HintButton,
	parameters: { layout: "centered" },
	args: { onClick: () => {} },
} satisfies Meta<typeof HintButton>;

export default meta;
type Story = StoryObj<typeof HintButton>;

const label = (text: string) => (
	<span
		style={{
			fontSize: 10,
			fontWeight: 700,
			textTransform: "uppercase" as const,
			letterSpacing: "0.1em",
			color: "var(--muted, #999)",
			fontFamily: "monospace",
		}}
	>
		{text}
	</span>
);

export const Empty: Story = {
	name: "0.0 — empty",
	args: { wordsEarnTokenCount: 0 },
};

export const Step01: Story = {
	name: "0.1 — 1/10",
	args: { wordsEarnTokenCount: 0.1 },
};

export const Step02: Story = {
	name: "0.2 — 2/10",
	args: { wordsEarnTokenCount: 0.2 },
};

export const Step03: Story = {
	name: "0.3 — 3/10",
	args: { wordsEarnTokenCount: 0.3 },
};

export const Step04: Story = {
	name: "0.4 — 4/10",
	args: { wordsEarnTokenCount: 0.4 },
};

export const Step05: Story = {
	name: "0.5 — 5/10",
	args: { wordsEarnTokenCount: 0.5 },
};

export const Step06: Story = {
	name: "0.6 — 6/10",
	args: { wordsEarnTokenCount: 0.6 },
};

export const Step07: Story = {
	name: "0.7 — 7/10",
	args: { wordsEarnTokenCount: 0.7 },
};

export const Step08: Story = {
	name: "0.8 — 8/10",
	args: { wordsEarnTokenCount: 0.8 },
};

export const Step09: Story = {
	name: "0.9 — 9/10",
	args: { wordsEarnTokenCount: 0.9 },
};

export const Ready1: Story = {
	name: "1.0 — ready (1 hint)",
	args: { wordsEarnTokenCount: 1 },
};

export const Banked2: Story = {
	name: "2.5 — banked (2 hints)",
	args: { wordsEarnTokenCount: 2.5 },
};

export const AllStates: Story = {
	name: "All states",
	render: (args) => (
		<div
			style={{
				display: "flex",
				gap: 20,
				alignItems: "flex-end",
				padding: 32,
				background: "var(--bg)",
				flexWrap: "wrap",
			}}
		>
			{[
				{ count: 0, desc: "0 — disabled" },
				{ count: 0.1, desc: "0.1 — 1/10" },
				{ count: 0.2, desc: "0.2 — 2/10" },
				{ count: 0.3, desc: "0.3 — 3/10" },
				{ count: 0.4, desc: "0.4 — 4/10" },
				{ count: 0.5, desc: "0.5 — 5/10" },
				{ count: 0.6, desc: "0.6 — 6/10" },
				{ count: 0.7, desc: "0.7 — 7/10" },
				{ count: 0.8, desc: "0.8 — 8/10" },
				{ count: 0.9, desc: "0.9 — 9/10" },
				{ count: 1.0, desc: "1.0 — ready" },
				{ count: 2.5, desc: "2.5 — banked" },
			].map(({ count, desc }) => (
				<div
					key={count}
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 8,
					}}
				>
					<HintButton {...args} wordsEarnTokenCount={count} />
					{label(desc)}
				</div>
			))}
		</div>
	),
	args: { wordsEarnTokenCount: 0 },
};
