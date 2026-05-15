import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GuessCard from "./GuessCard";

const meta = {
	title: "Pobach/GuessCard",
	component: GuessCard,
	tags: ["autodocs"],
	argTypes: {
		guess: { control: "object" },
		highlight: { control: "boolean" },
	},
	args: {
		guess: { word: "верабей", rank: 42 },
		highlight: false,
	},
} satisfies Meta<typeof GuessCard>;

export default meta;
type Story = StoryObj<typeof GuessCard>;

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
			<p style={lab()}>Guess Card</p>
			<GuessCard {...args} />
		</div>
	),
};

// ─── Rank tiers ───────────────────────────────────────────────────

const RANK_EXAMPLES = [
	{ word: "слова", rank: 1 },
	{ word: "сказаць", rank: 7 },
	{ word: "мова", rank: 55 },
	{ word: "гаварыць", rank: 300 },
	{ word: "далёкае", rank: 2500 },
];

function RankTiersSpecimen() {
	return (
		<div style={wrap()}>
			<p style={lab()}>Rank tiers</p>
			<p
				style={{
					fontSize: 11,
					color: "var(--muted)",
					margin: "0 0 24px",
					fontFamily: "var(--font-b)",
					lineHeight: 1.6,
				}}
			>
				Color and bar length shift across the five rank buckets: win (1), hot
				(2–10), close (11–100), warm (101–1000), cold (1000+).
			</p>
			<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
				{RANK_EXAMPLES.map((guess) => (
					<GuessCard key={guess.rank} guess={guess} />
				))}
			</div>
		</div>
	);
}

export const RankTiers: Story = {
	render: () => <RankTiersSpecimen />,
};

// ─── Hint badge ───────────────────────────────────────────────────

export const WithHint: Story = {
	args: {
		guess: { word: "зямля", rank: 12, isHint: true },
	},
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>With hint badge</p>
			<GuessCard {...args} />
		</div>
	),
};

// ─── Highlight animation ──────────────────────────────────────────

export const Highlighted: Story = {
	args: {
		guess: { word: "сонца", rank: 3 },
		highlight: true,
	},
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Highlighted (pop-in animation + accent ring)</p>
			<GuessCard {...args} />
		</div>
	),
};

// ─── Playground ───────────────────────────────────────────────────

export const Playground: Story = {
	render: (args) => (
		<div style={wrap()}>
			<GuessCard {...args} />
		</div>
	),
};
