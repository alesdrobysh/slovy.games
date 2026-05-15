import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GameCard } from "@/shared/components/GameCard";
import { GAMES } from "@/shared/types";

const valoshka = GAMES.find((g) => g.id === "valoshka")!;
const pobach = GAMES.find((g) => g.id === "pobach")!;

const meta = {
	title: "Shared/GameCard",
	component: GameCard,
	parameters: {
		layout: "padded",
	},
	args: {
		status: "not_started",
	},
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof GameCard>;

// ─── Валошка ─────────────────────────────────────────────────────────────────

export const ValoshkaDefault: Story = {
	args: {
		game: valoshka,
		status: "not_started",
	},
};

export const ValoshkaInProgress: Story = {
	args: {
		game: valoshka,
		status: "in_progress",
		progressText: "147 балаў",
	},
};

// ─── Побач ───────────────────────────────────────────────────────────────────

export const PobachDefault: Story = {
	args: {
		game: pobach,
		status: "not_started",
	},
};

export const PobachInProgress: Story = {
	args: {
		game: pobach,
		status: "in_progress",
		progressText: "Здагадка №4",
	},
};

export const PobachWon: Story = {
	args: {
		game: pobach,
		status: "won",
		progressText: "Разгадана за 6 спроб",
	},
};

export const PobachGivenUp: Story = {
	args: {
		game: pobach,
		status: "given_up",
		progressText: "Не адгадана",
	},
};
