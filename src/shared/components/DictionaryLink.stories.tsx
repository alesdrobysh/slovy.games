import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DictionaryLink from "./DictionaryLink";

const meta = {
	title: "Shared/DictionaryLink",
	component: DictionaryLink,
	tags: ["autodocs"],
	argTypes: {
		word: {
			control: { type: "text" },
		},
		className: {
			control: { type: "text" },
		},
	},
	args: {
		word: "верабей",
	},
} satisfies Meta<typeof DictionaryLink>;

export default meta;
type Story = StoryObj<typeof DictionaryLink>;

const wrap = (style?: React.CSSProperties) => ({
	padding: 40,
	background: "var(--bg)",
	minHeight: "100vh",
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
			<p style={lab()}>Dictionary Link</p>
			<DictionaryLink {...args} />
		</div>
	),
};

// ─── In context ───────────────────────────────────────────────────

const SENTENCES: { text: string; word: string }[] = [
	{ text: "Маленькі", word: "верабей" },
	{ text: "Белая", word: "бяроза" },
	{ text: "Ціхая", word: "рака" },
];

function InContextSpecimen() {
	return (
		<div style={wrap()}>
			<p style={lab()}>In sentence context</p>
			<p
				style={{
					fontSize: 11,
					color: "var(--muted)",
					margin: "0 0 24px",
					fontFamily: "var(--font-b)",
					lineHeight: 1.6,
					maxWidth: 480,
				}}
			>
				Links appear inline with body text — underline and accent color reveal on
				hover, focus ring on keyboard navigation.
			</p>
			<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
				{SENTENCES.map(({ text, word }) => (
					<p
						key={word}
						style={{
							fontSize: 18,
							margin: 0,
							color: "var(--fg)",
							fontFamily: "var(--font-b)",
						}}
					>
						{text}{" "}
						<DictionaryLink word={word} />
					</p>
				))}
			</div>
		</div>
	);
}

export const InContext: Story = {
	render: () => <InContextSpecimen />,
};

// ─── Playground ───────────────────────────────────────────────────

export const Playground: Story = {
	render: (args) => (
		<div
			style={wrap({
				display: "flex",
				alignItems: "flex-start",
				fontSize: 18,
				fontFamily: "var(--font-b)",
			})}
		>
			<DictionaryLink {...args} />
		</div>
	),
};
