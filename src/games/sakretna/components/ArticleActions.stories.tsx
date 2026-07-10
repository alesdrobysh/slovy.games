import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleActions } from "./ArticleActions";

const meta = {
	title: "Sakretna/ArticleActions",
	component: ArticleActions,
	parameters: { layout: "padded" },
} satisfies Meta<typeof ArticleActions>;

export default meta;
type Story = StoryObj<typeof ArticleActions>;

export const Available: Story = {
	args: {
		onUseHint: () => {},
		onClaimWin: () => {},
		onGiveUp: () => {},
		hintAvailable: true,
		titleVisible: true,
		finished: false,
	},
};

export const HintUsed: Story = {
	args: {
		onUseHint: () => {},
		onClaimWin: () => {},
		onGiveUp: () => {},
		hintAvailable: false,
		titleVisible: true,
		finished: false,
	},
};

export const Finished: Story = {
	args: {
		onUseHint: () => {},
		onClaimWin: () => {},
		onGiveUp: () => {},
		hintAvailable: false,
		titleVisible: true,
		finished: true,
	},
};
