import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatsPage } from "./StatsPage";

const meta = {
	title: "Valoshka/StatsPage",
	component: StatsPage,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof StatsPage>;

export default meta;
type Story = StoryObj<typeof StatsPage>;

export const Default: Story = {};
