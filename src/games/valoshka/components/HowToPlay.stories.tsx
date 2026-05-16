import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowToPlay } from "./HowToPlay";

const meta = {
	title: "Valoshka/HowToPlay",
	component: HowToPlay,
	parameters: {
		layout: "fullscreen",
	},
	args: {
		isOpen: true,
		onClose: () => {},
	},
} satisfies Meta<typeof HowToPlay>;

export default meta;
type Story = StoryObj<typeof HowToPlay>;

export const Open: Story = {};
