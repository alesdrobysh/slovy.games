import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Article, SavedProgress } from "@/games/redaktle/types";
import { FinishCard } from "./FinishCard";

const ARTICLE: Article = {
	id: "minsk",
	title: "Мінск",
	body: "",
	source: "https://be.wikipedia.org/wiki/Мінск",
	retrieved: "2026-07-10",
};

const meta = {
	title: "Redaktle/FinishCard",
	component: FinishCard,
	parameters: { layout: "padded" },
} satisfies Meta<typeof FinishCard>;

export default meta;
type Story = StoryObj<typeof FinishCard>;

const baseProgress: SavedProgress = {
	date: "2026-07-11",
	articleId: "minsk",
	foundLemmas: ["горад", "сталіца", "беларусь"],
	guesses: ["горад", "сталіца", "архітэктура", "беларусь"],
	won: true,
	givenUp: false,
	hintsUsed: 0,
};

export const Win: Story = {
	args: { mode: "win", article: ARTICLE, progress: baseProgress },
};

export const Lose: Story = {
	args: {
		mode: "lose",
		article: ARTICLE,
		progress: { ...baseProgress, won: false, givenUp: true },
	},
};
