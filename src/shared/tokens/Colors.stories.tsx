import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
	title: "Design/Colors",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const groups: {
	title: string;
	swatches: { label: string; variable: string }[];
}[] = [
	{
		title: "Backgrounds",
		swatches: [
			{ label: "bg", variable: "--bg" },
			{ label: "surface", variable: "--surface" },
			{ label: "surface-warm", variable: "--surface-warm" },
		],
	},
	{
		title: "Text",
		swatches: [
			{ label: "fg", variable: "--fg" },
			{ label: "fg-2", variable: "--fg-2" },
			{ label: "muted", variable: "--muted" },
			{ label: "ornament", variable: "--ornament" },
		],
	},
	{
		title: "Borders",
		swatches: [
			{ label: "border", variable: "--border" },
			{ label: "border-strong", variable: "--border-strong" },
		],
	},
	{
		title: "Valoshka",
		swatches: [
			{ label: "valoshka", variable: "--valoshka" },
			{ label: "valoshka-dim", variable: "--valoshka-dim" },
		],
	},
	{
		title: "Pobach",
		swatches: [
			{ label: "pobach", variable: "--pobach" },
			{ label: "pobach-dim", variable: "--pobach-dim" },
		],
	},
];

function Swatch({ label, variable }: { label: string; variable: string }) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 6,
				minWidth: 100,
			}}
		>
			<div
				style={{
					height: 64,
					borderRadius: 8,
					background: `var(${variable})`,
				}}
			/>
			<span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>
				{label}
			</span>
			<code
				style={{ fontSize: 10, color: "var(--fg-2)", fontFamily: "monospace" }}
			>
				{variable}
			</code>
		</div>
	);
}

function ThemeSection({ theme }: { theme?: "dark" }) {
	return (
		<div
			data-theme={theme}
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 32,
				padding: 24,
				background: "var(--bg)",
			}}
		>
			<p
				style={{
					fontSize: 11,
					fontWeight: 700,
					textTransform: "uppercase",
					letterSpacing: "0.1em",
					color: "var(--muted)",
					margin: 0,
				}}
			>
				{theme === "dark" ? "Dark" : "Light"}
			</p>
			{groups.map((group) => (
				<div key={group.title}>
					<p
						style={{
							fontSize: 11,
							fontWeight: 700,
							textTransform: "uppercase",
							letterSpacing: "0.1em",
							color: "var(--muted)",
							marginBottom: 12,
						}}
					>
						{group.title}
					</p>
					<div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
						{group.swatches.map((s) => (
							<Swatch key={s.variable} {...s} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function Palette() {
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<ThemeSection />
			<ThemeSection theme="dark" />
		</div>
	);
}

export const Default: Story = {
	render: () => <Palette />,
};
