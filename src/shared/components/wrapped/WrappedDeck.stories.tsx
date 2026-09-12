import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { HistoryRecord } from "@/games/pobach/types";
import { POBACH_EPOCH_DATE } from "@/shared/config";
import { dayIndexForDate } from "@/shared/lib/timezone";
import { WrappedDeck } from "./WrappedDeck";

function seedPobach(dates: string[]): void {
	const history: Record<string, HistoryRecord> = {};
	dates.forEach((date, i) => {
		const dayIndex = dayIndexForDate(POBACH_EPOCH_DATE, date);
		history[String(dayIndex)] = {
			dayIndex,
			won: i % 4 !== 0,
			attempts: 3 + (i % 9),
			bestRank: 1 + (i % 50),
			completedAt: Date.parse(`${date}T12:00:00Z`),
			guesses: [],
		};
	});
	localStorage.setItem(
		"pobach_storage",
		JSON.stringify({ version: 2, history, stats: {} })
	);
}

function seedValoshka(dates: string[]): void {
	localStorage.setItem(
		"vulej_stats",
		JSON.stringify({
			datesPlayed: dates,
			currentStreak: 0,
			longestStreak: 0,
			topRankCount: 0,
			totalWordsFound: 0,
			perDateBest: Object.fromEntries(
				dates.map((d, i) => [d, { rankIdx: i % 7, foundCount: 8 + (i % 20) }])
			),
		})
	);
}

function days(startIso: string, count: number): string[] {
	const start = Date.parse(`${startIso}T00:00:00Z`);
	return Array.from({ length: count }, (_, i) =>
		new Date(start + i * 86400000).toISOString().slice(0, 10)
	);
}

/** Seeds localStorage before the deck mounts, the way the sakretna stories do. */
function Fixture({
	pobachDays,
	valoshkaDays,
}: {
	pobachDays: string[];
	valoshkaDays?: string[];
}) {
	if (typeof window !== "undefined") {
		window.localStorage.removeItem("pobach_storage");
		window.localStorage.removeItem("vulej_stats");
		if (pobachDays.length > 0) seedPobach(pobachDays);
		if (valoshkaDays && valoshkaDays.length > 0) seedValoshka(valoshkaDays);
	}
	return <WrappedDeck year={2026} />;
}

const meta = {
	title: "Wrapped/Deck",
	component: WrappedDeck,
	parameters: {
		layout: "fullscreen",
		viewport: { defaultViewport: "mobile360" },
	},
	decorators: [
		(Story) => (
			<div className="bg-paper min-h-screen">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof WrappedDeck>;

export default meta;
type Story = StoryObj<typeof WrappedDeck>;

export const RichPlayer: Story = {
	render: () => (
		<Fixture
			pobachDays={days("2026-02-01", 40)}
			valoshkaDays={days("2026-07-15", 25)}
		/>
	),
};

export const PobachOnly: Story = {
	render: () => <Fixture pobachDays={days("2026-02-01", 18)} />,
};

export const ThinData: Story = {
	render: () => <Fixture pobachDays={days("2026-02-01", 2)} />,
};
