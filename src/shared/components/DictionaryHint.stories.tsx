import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DictionaryHint } from "./DictionaryHint";

const meta = {
	title: "Shared/DictionaryHint",
	component: DictionaryHint,
	tags: ["autodocs"],
} satisfies Meta<typeof DictionaryHint>;

export default meta;
type Story = StoryObj<typeof DictionaryHint>;

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
	render: () => (
		<div style={wrap()}>
			<p style={lab()}>Dictionary Hint</p>
			<DictionaryHint />
		</div>
	),
};

// ─── In context ───────────────────────────────────────────────────

function InContextSpecimen() {
	return (
		<div style={wrap()}>
			<p style={lab()}>
				Next to a word count, as in GuessList / FoundWordsList
			</p>
			<div
				style={{
					display: "flex",
					alignItems: "baseline",
					justifyContent: "space-between",
					maxWidth: 420,
				}}
			>
				<span
					style={{
						fontSize: 18,
						fontFamily: "var(--font-d)",
						fontWeight: 500,
						color: "var(--fg)",
					}}
				>
					3 словы
				</span>
				<DictionaryHint />
			</div>
		</div>
	);
}

export const InContext: Story = {
	render: () => <InContextSpecimen />,
};

// ─── Narrow viewport ────────────────────────────────────────────────

export const NarrowViewport: Story = {
	render: () => (
		<div style={wrap({ maxWidth: 320 })}>
			<p style={lab()}>Below sm breakpoint — shows short label</p>
			<DictionaryHint />
		</div>
	),
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
