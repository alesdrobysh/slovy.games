import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { GameStats, HistoryRecord } from "@/games/pobach/types";
import { ThemeProvider } from "@/shared/hooks/useTheme";
import { StatsPageContent } from "./StatsPageContent";

const meta = {
	title: "Pobach/StatsPageContent",
	component: StatsPageContent,
	parameters: { layout: "fullscreen" },
	decorators: [
		(Story) => (
			<ThemeProvider>
				<div
					className="theme-pobach"
					style={{ background: "var(--bg)", minHeight: "100vh" }}
				>
					<Story />
				</div>
			</ThemeProvider>
		),
	],
} satisfies Meta<typeof StatsPageContent>;

export default meta;
type Story = StoryObj<typeof StatsPageContent>;

const emptyStats: GameStats = {
	gamesPlayed: 0,
	gamesWon: 0,
	currentStreak: 0,
	maxStreak: 0,
	bestAttempts: 0,
	lastPlayedDayIndex: 0,
	winRate: 0,
	distribution: {},
};

const richStats: GameStats = {
	gamesPlayed: 34,
	gamesWon: 28,
	currentStreak: 5,
	maxStreak: 12,
	bestAttempts: 1,
	lastPlayedDayIndex: 41,
	winRate: 82,
	distribution: {
		1: 3,
		5: 10,
		20: 9,
		75: 4,
		150: 2,
	},
};

const sampleHistory: HistoryRecord[] = [
	{
		dayIndex: 41,
		won: true,
		attempts: 7,
		bestRank: 3,
		completedAt: Date.now() - 1000 * 60 * 60 * 2,
		guesses: [{ word: "побач", rank: 3 }],
	},
	{
		dayIndex: 40,
		won: false,
		attempts: 0,
		bestRank: 500,
		completedAt: Date.now() - 1000 * 60 * 60 * 26,
		guesses: [{ word: "далёка", rank: 500 }],
	},
	{
		dayIndex: 39,
		won: true,
		attempts: 1,
		bestRank: 1,
		completedAt: Date.now() - 1000 * 60 * 60 * 50,
		guesses: [{ word: "побач", rank: 1 }],
	},
	{
		dayIndex: 38,
		won: true,
		attempts: 23,
		bestRank: 12,
		completedAt: Date.now() - 1000 * 60 * 60 * 74,
		guesses: [
			{ word: "побач", rank: 12 },
			{ word: "блізка", rank: 45, isHint: true },
		],
	},
];

export const NoGames: Story = {
	args: {
		stats: emptyStats,
		history: [],
	},
};

export const OneGame: Story = {
	args: {
		stats: {
			...emptyStats,
			gamesPlayed: 1,
			gamesWon: 1,
			currentStreak: 1,
			maxStreak: 1,
			bestAttempts: 7,
			distribution: { 5: 1 },
		},
		history: [sampleHistory[0]],
	},
};

export const RichHistory: Story = {
	args: {
		stats: richStats,
		history: sampleHistory,
	},
};
