import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GuessList from "./GuessList";

const meta = {
	title: "Pobach/GuessList",
	component: GuessList,
	tags: ["autodocs"],
	argTypes: {
		guesses: { control: "object" },
		lastGuess: { control: "text" },
	},
	args: {
		guesses: [
			{ word: "сонца", rank: 3 },
			{ word: "мова", rank: 55 },
			{ word: "гаварыць", rank: 300 },
		],
		lastGuess: "сонца",
	},
} satisfies Meta<typeof GuessList>;

export default meta;
type Story = StoryObj<typeof GuessList>;

const wrap = (style?: React.CSSProperties) => ({
	padding: 40,
	background: "var(--bg)",
	minHeight: "100vh",
	maxWidth: 480,
	...style,
});

const lab = () => ({
	fontSize: 10,
	fontWeight: 700,
	textTransform: "uppercase" as const,
	letterSpacing: "0.12em",
	color: "var(--muted)",
	marginBottom: 10,
	fontFamily: "var(--font-b)",
});

// ─── Default ──────────────────────────────────────────────────────

export const Default: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Guess List</p>
			<GuessList {...args} />
		</div>
	),
};

// ─── Empty ────────────────────────────────────────────────────────

export const Empty: Story = {
	args: {
		guesses: [],
		lastGuess: null,
	},
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Empty — no guesses yet</p>
			<GuessList {...args} />
		</div>
	),
};

// ─── Many guesses ────────────────────────────────────────────────

const MANY_GUESSES = [
	{ word: "слова", rank: 1 },
	{ word: "сказаць", rank: 7 },
	{ word: "мова", rank: 55 },
	{ word: "гаварыць", rank: 300 },
	{ word: "далёкае", rank: 2500 },
	{ word: "зямля", rank: 12, isHint: true },
	{ word: "рака", rank: 180 },
	{ word: "бяроза", rank: 420 },
];

export const ManyGuesses: Story = {
	args: {
		guesses: MANY_GUESSES,
		lastGuess: "бяроза",
	},
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Many guesses — counter and dictionary hint visible</p>
			<GuessList {...args} />
		</div>
	),
};

// ─── With hint ────────────────────────────────────────────────────

export const WithHint: Story = {
	args: {
		guesses: [
			{ word: "далёкае", rank: 2500 },
			{ word: "зямля", rank: 12, isHint: true },
		],
		lastGuess: "зямля",
	},
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Includes a hint entry</p>
			<GuessList {...args} />
		</div>
	),
};

// ─── Playground ───────────────────────────────────────────────────

export const Playground: Story = {
	render: (args) => (
		<div style={wrap()}>
			<GuessList {...args} />
		</div>
	),
};
