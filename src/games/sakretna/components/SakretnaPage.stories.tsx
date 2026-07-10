import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { listArticles } from "@/games/redaktle/lib/puzzles";
import { tokenize } from "@/games/redaktle/lib/tokenize";
import { RedactlePage } from "./RedactlePage";

const article = listArticles()[0];
const picked = {
	article,
	tokens: tokenize(article.body),
	date: "2026-07-11",
};

const meta = {
	title: "Redaktle/RedactlePage",
	component: RedactlePage,
	parameters: { layout: "fullscreen" },
	decorators: [
		(Story) => (
			<div className="theme-redaktle bg-paper min-h-screen">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof RedactlePage>;

export default meta;
type Story = StoryObj<typeof RedactlePage>;

export const InProgress: Story = {
	args: { picked },
	render: (args) => <RedactlePage {...args} />,
};
