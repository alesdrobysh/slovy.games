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
		onGiveUp: () => {},
		hintAvailable: true,
		finished: false,
	},
};

export const HintUsed: Story = {
	args: {
		onUseHint: () => {},
		onGiveUp: () => {},
		hintAvailable: false,
		finished: false,
	},
};

export const Finished: Story = {
	args: {
		onUseHint: () => {},
		onGiveUp: () => {},
		hintAvailable: false,
		finished: true,
	},
};
