import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { listArticles } from "@/games/sakretna/lib/puzzles";
import { tokenize } from "@/games/sakretna/lib/tokenize";
import { SakretnaPage } from "./SakretnaPage";

const article = listArticles()[0];
const picked = {
	article,
	tokens: tokenize(article.body),
	titleTokens: tokenize(article.title),
	date: "2026-07-11",
};

const meta = {
	title: "Sakretna/SakretnaPage",
	component: SakretnaPage,
	parameters: { layout: "fullscreen" },
	decorators: [
		(Story) => (
			<div className="theme-sakretna bg-paper min-h-screen">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof SakretnaPage>;

export default meta;
type Story = StoryObj<typeof SakretnaPage>;

export const InProgress: Story = {
	args: { picked },
	render: (args) => <SakretnaPage {...args} />,
};
