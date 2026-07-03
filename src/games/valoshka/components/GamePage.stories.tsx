import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Puzzle } from "@/games/valoshka/types";
import { GamePage } from "./GamePage";

const meta = {
	title: "Valoshka/GamePage",
	component: GamePage,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof GamePage>;

export default meta;
type Story = StoryObj<typeof GamePage>;

const puzzle: Puzzle = {
	date: "2026-03-18",
	center: "к",
	outer: ["а", "д", "і", "н", "о", "п"],
	answers: [
		"акно",
		"акоп",
		"капа",
		"кіно",
		"кіпа",
		"конка",
		"копка",
		"папка",
		"паніка",
		"канапа",
		"канон",
		"пікнік",
		"падаконнік",
		"паддоннік",
		"падонкі",
	],
	pangrams: ["падаконнік", "паддоннік", "падонкі"],
	max_score: 278,
};

export const Default: Story = {
	args: { puzzle },
	render: (args) => (
		<div style={{ background: "var(--bg)", minHeight: "100vh" }}>
			<GamePage {...args} />
		</div>
	),
};
