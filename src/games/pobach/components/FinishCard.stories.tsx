import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Guess } from "@/games/pobach/core/entities/game";
import { getCurrentDayIndex } from "@/games/pobach/lib/storage";
import FinishCard from "./FinishCard";

const TODAY = getCurrentDayIndex();

const meta = {
	title: "Pobach/FinishCard",
	component: FinishCard,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	args: {
		dayIndex: TODAY,
		sessionDayIndex: TODAY,
		guesses: [],
		mode: "win",
	},
} satisfies Meta<typeof FinishCard>;

export default meta;
type Story = StoryObj<typeof FinishCard>;

const wrap = (children: React.ReactNode) => (
	<div
		className="theme-pobach"
		style={{ padding: 32, background: "var(--bg)", maxWidth: 480 }}
	>
		{children}
	</div>
);

const STORAGE_KEY = "pobach_storage";

function seedStorage(streak: number) {
	const data = {
		version: 2,
		history: {},
		stats: {
			gamesPlayed: streak + 2,
			gamesWon: streak,
			currentStreak: streak,
			maxStreak: streak,
			bestAttempts: 3,
			lastPlayedDayIndex: 1,
			winRate: streak / (streak + 2),
			distribution: {},
		},
	};
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function mockTopWordsFetch() {
	globalThis.fetch = async (input: RequestInfo | URL) => {
		if (!String(input).includes("top-words")) return fetch(input);
		return new Response(JSON.stringify([]), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	};
}

const winGuesses: Guess[] = [
	{ word: "побач", rank: 1 },
	{ word: "блізка", rank: 45 },
	{ word: "поруч", rank: 120 },
	{ word: "далей", rank: 850 },
];

const winGuessesWithHints: Guess[] = [
	{ word: "побач", rank: 1 },
	{ word: "поруч", rank: 120, isHint: true },
	{ word: "блізка", rank: 45, isHint: true },
];

const lossGuesses: Guess[] = [
	{ word: "далёка", rank: 2500 },
	{ word: "высока", rank: 1800 },
	{ word: "глыбока", rank: 3200 },
];

export const Win: Story = {
	decorators: [
		(Story) => {
			seedStorage(7);
			mockTopWordsFetch();
			return <Story />;
		},
	],
	args: { guesses: winGuesses, mode: "win" },
	render: (args) => wrap(<FinishCard {...args} />),
};

export const WinNoStreak: Story = {
	decorators: [
		(Story) => {
			seedStorage(0);
			mockTopWordsFetch();
			return <Story />;
		},
	],
	args: { guesses: winGuesses, mode: "win" },
	render: (args) => wrap(<FinishCard {...args} />),
};

export const WinWithHints: Story = {
	decorators: [
		(Story) => {
			seedStorage(3);
			mockTopWordsFetch();
			return <Story />;
		},
	],
	args: { guesses: winGuessesWithHints, mode: "win" },
	render: (args) => wrap(<FinishCard {...args} />),
};

export const Lose: Story = {
	decorators: [
		(Story) => {
			seedStorage(0);
			mockTopWordsFetch();
			return <Story />;
		},
	],
	args: { guesses: lossGuesses, mode: "lose", targetWord: "побач" },
	render: (args) => wrap(<FinishCard {...args} />),
};

export const NewDayAvailable: Story = {
	decorators: [
		(Story) => {
			seedStorage(2);
			mockTopWordsFetch();
			return <Story />;
		},
	],
	args: { guesses: winGuesses, mode: "win", sessionDayIndex: 0 },
	render: (args) => wrap(<FinishCard {...args} />),
};

export const Playground: Story = {
	decorators: [
		(Story) => {
			seedStorage(5);
			mockTopWordsFetch();
			return <Story />;
		},
	],
	argTypes: {
		mode: { control: "radio", options: ["win", "lose"] },
		dayIndex: { control: { type: "number", min: 0 } },
		sessionDayIndex: { control: { type: "number", min: 0 } },
	},
	args: { guesses: winGuesses, mode: "win" },
	render: (args) => wrap(<FinishCard {...args} />),
};
