import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SakretnaContour } from "./SakretnaContour";

const meta = {
	title: "Sakretna/SakretnaContour",
	component: SakretnaContour,
	parameters: { layout: "centered" },
} satisfies Meta<typeof SakretnaContour>;

export default meta;
type Story = StoryObj<typeof SakretnaContour>;

export const Default: Story = {
	args: { className: "w-80 h-80 text-sakretna" },
};
