import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/shared/components/ui/Badge";

const meta = {
	title: "Design/Badge",
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "radio" },
			options: ["accent", "success", "neutral"],
		},
		children: {
			control: { type: "text" },
		},
	},
	args: {
		variant: "accent",
		children: "Новае слова",
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

const lab = () => ({
	fontSize: 10,
	fontWeight: 700,
	textTransform: "uppercase" as const,
	letterSpacing: "0.12em",
	color: "var(--muted)",
	marginBottom: 10,
	fontFamily: "var(--font-b)",
});

const specRowStyle = {
	display: "grid" as const,
	gridTemplateColumns: "120px 1fr",
	gap: "0 24px",
	alignItems: "center" as const,
	padding: "16px 0",
	borderTop: "1px solid var(--border)",
};

// ─── Variants ─────────────────────────────────────────────────────

const VARIANTS: {
	variant: "accent" | "success" | "neutral";
	label: string;
	spec: string;
	sample: string;
}[] = [
	{
		variant: "accent",
		label: "accent",
		spec: "Game accent color · highlights new or featured content",
		sample: "Новае слова",
	},
	{
		variant: "success",
		label: "success",
		spec: "Success green · correct answer or completed state",
		sample: "Правільна",
	},
	{
		variant: "neutral",
		label: "neutral",
		spec: "Muted ink · secondary metadata · least visual weight",
		sample: "Узровень 3",
	},
];

function VariantsSpecimen() {
	return (
		<div style={{ padding: 40, background: "var(--bg)", minHeight: "100vh" }}>
			<p style={lab()}>Variants</p>
			<p
				style={{
					fontSize: 11,
					color: "var(--muted)",
					margin: "0 0 24px",
					fontFamily: "var(--font-b)",
					lineHeight: 1.6,
					maxWidth: 520,
				}}
			>
				Three semantic variants: <strong>accent</strong> (game color),{" "}
				<strong>success</strong> (positive outcome), <strong>neutral</strong>{" "}
				(secondary metadata). All share the same typographic treatment — 10px
				uppercase with wide tracking.
			</p>

			{VARIANTS.map(({ variant, label, spec, sample }) => (
				<div key={variant} style={specRowStyle}>
					<div>
						<code
							style={{
								display: "block",
								fontSize: 10,
								fontFamily: "monospace",
								color: "var(--muted)",
								letterSpacing: "0.04em",
								marginBottom: 4,
							}}
						>
							.{label}
						</code>
						<p
							style={{
								fontSize: 11,
								color: "var(--fg-2)",
								margin: 0,
								fontFamily: "var(--font-b)",
								lineHeight: 1.5,
							}}
						>
							{spec}
						</p>
					</div>
					<Badge variant={variant}>{sample}</Badge>
				</div>
			))}
		</div>
	);
}

export const Variants: Story = {
	render: () => <VariantsSpecimen />,
};

// ─── Game accents ─────────────────────────────────────────────────

function AccentCard({
	game,
	accent,
	title,
}: {
	game: "pobach" | "valoshka";
	accent: string;
	title: string;
}) {
	return (
		<div
			className={game === "pobach" ? "theme-pobach" : ""}
			style={{
				background: "var(--surface)",
				border: "1px solid var(--border)",
				borderRadius: 12,
				padding: 28,
				flex: 1,
				minWidth: 240,
			}}
		>
			<span
				style={{
					display: "block",
					fontFamily: "var(--font-b)",
					fontSize: 11,
					fontVariantCaps: "small-caps",
					letterSpacing: "0.13em",
					color: accent,
					marginBottom: 16,
				}}
			>
				{title}
			</span>
			<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
				<Badge variant="accent">Новае слова</Badge>
				<Badge variant="success">Правільна</Badge>
				<Badge variant="neutral">Узровень 3</Badge>
			</div>
		</div>
	);
}

function AccentSpecimen() {
	return (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				display: "flex",
				gap: 24,
				flexWrap: "wrap",
			}}
		>
			<AccentCard
				game="pobach"
				accent="var(--pobach)"
				title="Побач — terracotta"
			/>
			<AccentCard
				game="valoshka"
				accent="var(--valoshka)"
				title="Валошка — cornflower"
			/>
		</div>
	);
}

export const GameAccents: Story = {
	render: () => <AccentSpecimen />,
};

// ─── Playground ───────────────────────────────────────────────────

export const Playground: Story = {
	render: (args) => (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				minHeight: "100vh",
				display: "flex",
				alignItems: "flex-start",
				gap: 12,
				flexWrap: "wrap",
			}}
		>
			<Badge {...args} />
		</div>
	),
};
