import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RedactleStatsPage } from "./RedactleStatsPage";

const meta = {
	title: "Redaktle/RedactleStatsPage",
	component: RedactleStatsPage,
	parameters: { layout: "fullscreen" },
	decorators: [
		(Story) => (
			<div className="theme-redaktle bg-paper min-h-screen">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof RedactleStatsPage>;

export default meta;
type Story = StoryObj<typeof RedactleStatsPage>;

export const Default: Story = {};
