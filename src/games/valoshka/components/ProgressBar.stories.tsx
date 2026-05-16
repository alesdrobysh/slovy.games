import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProgressBar } from "./ProgressBar";

const meta = {
	title: "Valoshka/ProgressBar",
	component: ProgressBar,
	tags: ["autodocs"],
	args: {
		maxScore: 278,
		date: "2026-03-18",
		foundCount: 0,
		totalWords: 50,
	},
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof ProgressBar>;

const wrap = (children: React.ReactNode) => (
	<div style={{ padding: 40, background: "var(--bg)", minHeight: "100vh" }}>
		{children}
	</div>
);

export const EarlyGame: Story = {
	render: (args) => wrap(<ProgressBar {...args} />),
	args: { score: 12, foundCount: 3 },
};

export const HighRank: Story = {
	render: (args) => wrap(<ProgressBar {...args} />),
	args: { score: 220, foundCount: 35 },
};
