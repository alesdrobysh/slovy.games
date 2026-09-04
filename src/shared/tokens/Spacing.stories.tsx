import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
	title: "Design/Spacing",
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const insets: {
	label: string;
	variable: string;
	tailwind: string;
	px: number;
}[] = [
	{
		label: "inset-xs",
		variable: "--space-inset-xs",
		tailwind: "p-inset-xs",
		px: 8,
	},
	{
		label: "inset-sm",
		variable: "--space-inset-sm",
		tailwind: "p-inset-sm",
		px: 12,
	},
	{
		label: "inset-md",
		variable: "--space-inset-md",
		tailwind: "p-inset-md",
		px: 20,
	},
	{
		label: "inset-lg",
		variable: "--space-inset-lg",
		tailwind: "p-inset-lg",
		px: 24,
	},
];

const flows: {
	label: string;
	variable: string;
	tailwind: string;
	px: number;
}[] = [
	{
		label: "flow-xs",
		variable: "--space-flow-xs",
		tailwind: "gap-flow-xs",
		px: 4,
	},
	{
		label: "flow-sm",
		variable: "--space-flow-sm",
		tailwind: "gap-flow-sm",
		px: 8,
	},
	{
		label: "flow-md",
		variable: "--space-flow-md",
		tailwind: "gap-flow-md",
		px: 12,
	},
	{
		label: "flow-lg",
		variable: "--space-flow-lg",
		tailwind: "gap-flow-lg",
		px: 16,
	},
];

function InsetRow({ label, variable, tailwind, px }: (typeof insets)[number]) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 16,
				marginBottom: 8,
			}}
		>
			<div style={{ width: 160, textAlign: "right" }}>
				<code
					style={{
						fontSize: 11,
						color: "var(--fg-2)",
						fontFamily: "monospace",
					}}
				>
					{variable}
				</code>
			</div>
			<div
				style={{
					background: "var(--valoshka)",
					opacity: 0.15,
					width: px * 2,
					height: px * 2,
					borderRadius: 4,
					flexShrink: 0,
				}}
			/>
			<div style={{ flex: 1 }}>
				<span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>
					{label}
				</span>
				<span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>
					{px}px
				</span>
				<code
					style={{
						fontSize: 10,
						color: "var(--fg-2)",
						fontFamily: "monospace",
						marginLeft: 8,
					}}
				>
					{tailwind}
				</code>
			</div>
		</div>
	);
}

function FlowRow({ label, variable, tailwind, px }: (typeof flows)[number]) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 16,
				marginBottom: 8,
			}}
		>
			<div style={{ width: 160, textAlign: "right" }}>
				<code
					style={{
						fontSize: 11,
						color: "var(--fg-2)",
						fontFamily: "monospace",
					}}
				>
					{variable}
				</code>
			</div>
			<div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
				<div
					style={{
						width: 20,
						height: 20,
						borderRadius: 4,
						background: "var(--pobach)",
						opacity: 0.5,
					}}
				/>
				<div
					style={{
						width: px,
						height: 4,
						background: "var(--pobach)",
						opacity: 0.2,
					}}
				/>
				<div
					style={{
						width: 20,
						height: 20,
						borderRadius: 4,
						background: "var(--pobach)",
						opacity: 0.5,
					}}
				/>
			</div>
			<div style={{ flex: 1 }}>
				<span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>
					{label}
				</span>
				<span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>
					{px}px
				</span>
				<code
					style={{
						fontSize: 10,
						color: "var(--fg-2)",
						fontFamily: "monospace",
						marginLeft: 8,
					}}
				>
					{tailwind}
				</code>
			</div>
		</div>
	);
}

function SpacingTable() {
	return (
		<div
			style={{
				padding: 24,
				background: "var(--bg)",
				display: "flex",
				flexDirection: "column",
				gap: 32,
			}}
		>
			<div>
				<p
					style={{
						fontSize: 11,
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.1em",
						color: "var(--muted)",
						marginBottom: 16,
					}}
				>
					Insets — padding inside components
				</p>
				{insets.map((t) => (
					<InsetRow key={t.variable} {...t} />
				))}
			</div>
			<div>
				<p
					style={{
						fontSize: 11,
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.1em",
						color: "var(--muted)",
						marginBottom: 16,
					}}
				>
					Flow — gap between siblings
				</p>
				{flows.map((t) => (
					<FlowRow key={t.variable} {...t} />
				))}
			</div>
		</div>
	);
}

export const Default: Story = {
	render: () => <SpacingTable />,
};
