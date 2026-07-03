import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActionButtons } from "@/games/valoshka/components/ActionButtons";

const meta = {
	title: "Valoshka/ActionButtons",
	component: ActionButtons,
	parameters: {
		layout: "centered",
	},
	args: {
		onDelete: () => {},
		onShuffle: () => {},
		onSubmit: () => {},
		onHint: () => {},
		onOpenGrid: () => {},
		hintCredits: 2,
	},
} satisfies Meta<typeof ActionButtons>;

export default meta;
type Story = StoryObj<typeof ActionButtons>;

export const Default: Story = {};
