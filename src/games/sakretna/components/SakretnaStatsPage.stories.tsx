import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SakretnaStatsPage } from "./SakretnaStatsPage";

const meta = {
	title: "Sakretna/SakretnaStatsPage",
	component: SakretnaStatsPage,
	parameters: { layout: "fullscreen" },
	decorators: [
		(Story) => (
			<div className="theme-sakretna bg-paper min-h-screen">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof SakretnaStatsPage>;

export default meta;
type Story = StoryObj<typeof SakretnaStatsPage>;

export const Default: Story = {};
