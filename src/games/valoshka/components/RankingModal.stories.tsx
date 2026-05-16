import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getRankIndex } from "@/games/valoshka/lib/scoring";
import { RankingModal } from "./RankingModal";

const meta = {
	title: "Valoshka/RankingModal",
	component: RankingModal,
	parameters: {
		layout: "fullscreen",
	},
	args: {
		maxScore: 278,
		onClose: () => {},
	},
} satisfies Meta<typeof RankingModal>;

export default meta;
type Story = StoryObj<typeof RankingModal>;

export const MidRank: Story = {
	args: {
		score: 70,
		rankIdx: getRankIndex(70, 278),
	},
};

export const TopRank: Story = {
	args: {
		score: 278,
		rankIdx: getRankIndex(278, 278),
	},
};
