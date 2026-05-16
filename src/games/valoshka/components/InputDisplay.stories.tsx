import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputDisplay } from "./InputDisplay";

const meta = {
	title: "Valoshka/InputDisplay",
	component: InputDisplay,
	tags: ["autodocs"],
	args: {
		value: "",
		center: "а",
		errorType: null,
		errorKey: 0,
		lastFoundWord: null,
		lastFoundIsPangram: false,
		successKey: 0,
	},
} satisfies Meta<typeof InputDisplay>;

export default meta;
type Story = StoryObj<typeof InputDisplay>;

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

// ─── Empty (cursor) ────────────────────────────────────────────────

export const Empty: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Empty — blinking cursor</p>
			<InputDisplay {...args} />
		</div>
	),
};

// ─── Typing ────────────────────────────────────────────────────────

export const Typing: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Typing — letters shown</p>
			<InputDisplay {...args} />
		</div>
	),
	args: { value: "вараб" },
};

// ─── Error: too short ──────────────────────────────────────────────

export const ErrorTooShort: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Error — too short</p>
			<InputDisplay {...args} />
		</div>
	),
	args: { value: "ва", errorType: "too_short", errorKey: 1 },
};

// ─── Error: missing center ─────────────────────────────────────────

export const ErrorMissingCenter: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Error — missing center letter</p>
			<InputDisplay {...args} />
		</div>
	),
	args: { value: "верб", errorType: "missing_center", errorKey: 1 },
};

// ─── Error: not in list ────────────────────────────────────────────

export const ErrorNotInList: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Error — not in word list</p>
			<InputDisplay {...args} />
		</div>
	),
	args: { value: "вараба", errorType: "not_in_list", errorKey: 1 },
};

// ─── Error: already found ──────────────────────────────────────────

export const ErrorAlreadyFound: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Error — word already found</p>
			<InputDisplay {...args} />
		</div>
	),
	args: { value: "верабей", errorType: "already_found", errorKey: 1 },
};

// ─── Success ───────────────────────────────────────────────────────

export const Success: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Success toast</p>
			<InputDisplay {...args} />
		</div>
	),
	args: { value: "", lastFoundWord: "верабей", successKey: 1 },
};

// ─── Pangram ───────────────────────────────────────────────────────

export const Pangram: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Pangram success toast</p>
			<InputDisplay {...args} />
		</div>
	),
	args: {
		value: "",
		lastFoundWord: "верабейнік",
		lastFoundIsPangram: true,
		successKey: 1,
	},
};
