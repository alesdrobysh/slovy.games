import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HintDisplay } from "./HintDisplay";

const meta = {
	title: "Valoshka/HintDisplay",
	component: HintDisplay,
	tags: ["autodocs"],
	args: {
		onCancel: () => {},
	},
} satisfies Meta<typeof HintDisplay>;

export default meta;
type Story = StoryObj<typeof HintDisplay>;

const wrap = (style?: React.CSSProperties) => ({
	padding: 40,
	background: "var(--bg)",
	minHeight: "100vh",
	display: "flex",
	alignItems: "flex-start",
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

// ─── Default — no letters revealed ────────────────────────────────

export const Default: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>No letters revealed</p>
			<HintDisplay {...args} />
		</div>
	),
	args: {
		hint: {
			targetWord: "верабей",
			revealedIndices: [],
			isActive: true,
		},
	},
};

// ─── Some letters revealed ─────────────────────────────────────────

export const PartiallyRevealed: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Some letters revealed</p>
			<HintDisplay {...args} />
		</div>
	),
	args: {
		hint: {
			targetWord: "верабей",
			revealedIndices: [0, 2, 4],
			isActive: true,
		},
	},
};

// ─── Short word ────────────────────────────────────────────────────

export const ShortWord: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Short word (3 letters)</p>
			<HintDisplay {...args} />
		</div>
	),
	args: {
		hint: {
			targetWord: "рот",
			revealedIndices: [],
			isActive: true,
		},
	},
};

// ─── Long word ─────────────────────────────────────────────────────

export const LongWord: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Long word (10 letters)</p>
			<HintDisplay {...args} />
		</div>
	),
	args: {
		hint: {
			targetWord: "прыгажосць",
			revealedIndices: [0, 3, 6],
			isActive: true,
		},
	},
};

// ─── Inactive (renders nothing) ────────────────────────────────────

export const Inactive: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Inactive — renders nothing</p>
			<HintDisplay {...args} />
		</div>
	),
	args: {
		hint: {
			targetWord: "верабей",
			revealedIndices: [],
			isActive: false,
		},
	},
};
