import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { GameYearStats, WrappedSummary } from "@/shared/types/wrapped";
import { CommonSlide } from "./CommonSlide";
import { GameSlide } from "./GameSlide";
import { HeroSlide } from "./HeroSlide";
import { ThinSlide } from "./ThinSlide";

const pobach: GameYearStats = {
	gameId: "pobach",
	year: 2026,
	daysPlayed: Array.from(
		{ length: 42 },
		(_, i) => `2026-03-${String((i % 28) + 1).padStart(2, "0")}`
	),
	daysWon: [],
	longestStreakInYear: 11,
	highlights: [
		{ key: "bestAttempts", label: "Найменш спробаў", value: 3 },
		{ key: "winRate", label: "Адгадана", value: "78%" },
		{ key: "bestRank", label: "Найбліжэйшае слова", value: 1 },
	],
};

const summary: WrappedSummary = {
	year: 2026,
	activeDays: pobach.daysPlayed,
	gamesFinished: 96,
	longestStreakAnyGame: 14,
	busiestMonth: { month: 3, days: 21 },
	gameOfTheYear: "pobach",
	perGame: [pobach],
	isThin: false,
};

const meta = {
	title: "Wrapped/Slides",
	parameters: { layout: "fullscreen" },
	decorators: [
		(Story) => (
			<div style={{ height: "100vh" }}>
				<Story />
			</div>
		),
	],
} satisfies Meta;

export default meta;

export const Hero: StoryObj = {
	render: () => <HeroSlide year={2026} activeDays={96} />,
};

export const Common: StoryObj = {
	render: () => <CommonSlide summary={summary} />,
};

export const GamePageOne: StoryObj = {
	render: () => <GameSlide stats={pobach} page={1} />,
};

export const GamePageTwo: StoryObj = {
	render: () => <GameSlide stats={pobach} page={2} />,
};

export const Thin: StoryObj = {
	render: () => <ThinSlide year={2026} />,
};
