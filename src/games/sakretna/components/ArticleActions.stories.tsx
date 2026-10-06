import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleActions } from "./ArticleActions";

const meta = {
	title: "Sakretna/ArticleActions",
	component: ArticleActions,
	parameters: { layout: "padded" },
} satisfies Meta<typeof ArticleActions>;

export default meta;
type Story = StoryObj<typeof ArticleActions>;

export const ThreeHints: Story = {
	args: {
		onUseHint: () => {},
		onGiveUp: () => {},
		onSettings: () => {},
		hintsLeft: 3,
		finished: false,
	},
};

export const NoHintsLeft: Story = {
	args: {
		onUseHint: () => {},
		onGiveUp: () => {},
		onSettings: () => {},
		hintsLeft: 0,
		finished: false,
	},
};

export const Finished: Story = {
	args: {
		onUseHint: () => {},
		onGiveUp: () => {},
		onSettings: () => {},
		hintsLeft: 0,
		finished: true,
	},
};
