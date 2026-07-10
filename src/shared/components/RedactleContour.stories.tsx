import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RedactleContour } from "./RedactleContour";

const meta = {
	title: "Redaktle/RedactleContour",
	component: RedactleContour,
	parameters: { layout: "centered" },
} satisfies Meta<typeof RedactleContour>;

export default meta;
type Story = StoryObj<typeof RedactleContour>;

export const Default: Story = {
	args: { className: "w-80 h-80 text-redaktle" },
};
