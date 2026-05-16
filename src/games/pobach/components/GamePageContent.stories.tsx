import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { GameActions, GameState } from "@/games/pobach/hooks/useGame";
import { GamePageContent } from "./GamePageContent";

const meta = {
	title: "Pobach/GamePageContent",
	component: GamePageContent,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof GamePageContent>;

export default meta;
type Story = StoryObj<typeof GamePageContent>;

const wrap = (children: React.ReactNode) => (
	<div className="theme-pobach" style={{ background: "var(--bg)", minHeight: "100vh" }}>
		{children}
	</div>
);

const noopActions: GameActions = {
	setInput: () => {},
	handleSubmit: async () => {},
	getHint: async () => {},
	handleGiveUp: async () => {},
	clearError: () => {},
};

const baseState: GameState = {
	input: "",
	guesses: [],
	lastGuess: null,
	loading: false,
	error: null,
	errorWord: null,
	dayIndex: 42,
	sessionDayIndex: 42,
	won: false,
	sessionId: "test-session",
	gameOver: false,
	targetWord: "",
};

export const Empty: Story = {
	args: { state: baseState, actions: noopActions },
	render: (args) => wrap(<GamePageContent {...args} />),
};

export const InProgress: Story = {
	args: {
		state: {
			...baseState,
			guesses: [
				{ word: "блізка", rank: 45 },
				{ word: "поруч", rank: 120 },
				{ word: "далей", rank: 850 },
			],
			lastGuess: { word: "далей", rank: 850 },
		},
		actions: noopActions,
	},
	render: (args) => wrap(<GamePageContent {...args} />),
};

export const Loading: Story = {
	args: {
		state: { ...baseState, input: "дрэва", loading: true },
		actions: noopActions,
	},
	render: (args) => wrap(<GamePageContent {...args} />),
};

export const WithError: Story = {
	args: {
		state: {
			...baseState,
			error: "такога слова няма ў слоўніку",
			errorWord: "ксылафон",
		},
		actions: noopActions,
	},
	render: (args) => wrap(<GamePageContent {...args} />),
};

export const Won: Story = {
	args: {
		state: {
			...baseState,
			guesses: [
				{ word: "побач", rank: 1 },
				{ word: "блізка", rank: 45 },
				{ word: "поруч", rank: 120 },
			],
			lastGuess: { word: "побач", rank: 1 },
			won: true,
			gameOver: true,
		},
		actions: noopActions,
	},
	render: (args) => wrap(<GamePageContent {...args} />),
};

export const Lose: Story = {
	args: {
		state: {
			...baseState,
			guesses: [
				{ word: "далёка", rank: 2500 },
				{ word: "высока", rank: 1800 },
				{ word: "глыбока", rank: 3200 },
			],
			won: false,
			gameOver: true,
			targetWord: "побач",
		},
		actions: noopActions,
	},
	render: (args) => wrap(<GamePageContent {...args} />),
};
