import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatCard } from "@/shared/components/ui/StatCard";

const meta = {
	title: "Design/StatCard",
	component: StatCard,
	tags: ["autodocs"],
	argTypes: {
		label: { control: { type: "text" } },
		value: { control: { type: "text" } },
	},
	args: {
		label: "Словы вывучаны",
		value: 42,
	},
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof StatCard>;

const lab = () => ({
	fontSize: 10,
	fontWeight: 700,
	textTransform: "uppercase" as const,
	letterSpacing: "0.12em",
	color: "var(--muted)",
	marginBottom: 10,
	fontFamily: "var(--font-b)",
});

// ─── Examples ─────────────────────────────────────────────────────

const EXAMPLES: { label: string; value: number | string }[] = [
	{ label: "Словы вывучаны", value: 42 },
	{ label: "Правільных адказаў", value: "87%" },
	{ label: "Дзён запар", value: 7 },
	{ label: "Узровень", value: "Пачатковы" },
];

function ExamplesSpecimen() {
	return (
		<div style={{ padding: 40, background: "var(--bg)", minHeight: "100vh" }}>
			<p style={lab()}>Examples</p>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
					gap: 16,
					maxWidth: 720,
				}}
			>
				{EXAMPLES.map(({ label, value }) => (
					<StatCard key={label} label={label} value={value} />
				))}
			</div>
		</div>
	);
}

export const Examples: Story = {
	render: () => <ExamplesSpecimen />,
};

// ─── Numeric vs string values ──────────────────────────────────────

function ValueTypesSpecimen() {
	return (
		<div style={{ padding: 40, background: "var(--bg)", minHeight: "100vh" }}>
			<p style={lab()}>Numeric value</p>
			<div style={{ marginBottom: 32, maxWidth: 240 }}>
				<StatCard label="Словы вывучаны" value={1248} />
			</div>

			<p style={lab()}>String value</p>
			<div style={{ marginBottom: 32, maxWidth: 240 }}>
				<StatCard label="Лепшы вынік" value="3:42" />
			</div>

			<p style={lab()}>Percentage</p>
			<div style={{ maxWidth: 240 }}>
				<StatCard label="Дакладнасць" value="94%" />
			</div>
		</div>
	);
}

export const ValueTypes: Story = {
	render: () => <ValueTypesSpecimen />,
};

// ─── Playground ───────────────────────────────────────────────────

export const Playground: Story = {
	render: (args) => (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				minHeight: "100vh",
				maxWidth: 280,
			}}
		>
			<StatCard {...args} />
		</div>
	),
};
