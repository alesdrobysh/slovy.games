import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { GameYearStats, WrappedSummary } from "@/shared/types/wrapped";
import { ShareCardSlide } from "../ShareCardSlide";
import { CalendarSlide } from "./CalendarSlide";
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
	headline: { value: 118, caption: "слоў адгадана" },
	highlights: [
		{
			key: "bestWin",
			label: "Найлепшая перамога",
			value: "сонца",
			caption: "4 спробы, без падказак",
		},
		{
			key: "favoriteGuess",
			label: "Любімая здагадка",
			value: "мова",
			caption: "у 9 гульнях",
		},
		{
			key: "hardestWin",
			label: "Самая ўпартая перамога",
			value: "калыханка",
			caption: "187 спроб",
		},
		{
			key: "winRate",
			label: "Працэнт перамог",
			value: "81%",
			caption: "118 з 145 гульняў",
		},
	],
};

const gamesPerDay: Record<string, number> = {};
for (let i = 0; i < 365; i++) {
	const count = (i * 7) % 5 === 0 ? 0 : (i * 13) % 4;
	if (count > 0) {
		const day = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
		gamesPerDay[day] = count;
	}
}

const summary: WrappedSummary = {
	year: 2026,
	activeDays: Object.keys(gamesPerDay),
	gamesPerDay,
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

export const Calendar: StoryObj = {
	render: () => <CalendarSlide summary={summary} />,
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

export const Share: StoryObj = {
	render: () => <ShareCardSlide summary={summary} />,
};
