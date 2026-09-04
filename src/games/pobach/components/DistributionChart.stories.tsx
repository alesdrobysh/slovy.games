import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DistributionChart } from "./DistributionChart";

const meta = {
	title: "Pobach/DistributionChart",
	component: DistributionChart,
	parameters: { layout: "padded" },
	decorators: [
		(Story) => (
			<div
				className="theme-pobach"
				style={{ maxWidth: 420, background: "var(--bg)", padding: 16 }}
			>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof DistributionChart>;

export default meta;
type Story = StoryObj<typeof DistributionChart>;

export const Empty: Story = {
	args: { distribution: {} },
};

export const SingleBucket: Story = {
	args: { distribution: { 1: 5 } },
};

export const AllBuckets: Story = {
	args: {
		distribution: {
			1: 5,
			5: 12,
			20: 8,
			75: 3,
			150: 1,
		},
	},
};

export const DominantFirstGuess: Story = {
	args: {
		distribution: {
			1: 42,
			3: 2,
		},
	},
};
