import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { BottomBanner } from "@/shared/components/BottomBanner";

const meta = {
	title: "Shared/BottomBanner",
	component: BottomBanner,
	tags: ["autodocs"],
	argTypes: {
		isVisible: { control: { type: "boolean" } },
		themeClass: { control: { type: "text" } },
		message: { control: { type: "text" } },
		buttonLabel: { control: { type: "text" } },
		ariaLabel: { control: { type: "text" } },
	},
	args: {
		ariaLabel: "Абнаўленне",
		message: "Даступная новая версія дадатку.",
		buttonLabel: "Абнавіць",
		onAction: () => {},
		isVisible: true,
		themeClass: "",
	},
} satisfies Meta<typeof BottomBanner>;

export default meta;
type Story = StoryObj<typeof BottomBanner>;

// ─── Playground ───────────────────────────────────────────────────

export const Playground: Story = {
	render: (args) => (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				minHeight: "400px",
			}}
		>
			<p
				style={{
					fontSize: 13,
					color: "var(--ink-muted)",
					fontFamily: "var(--font-b)",
				}}
			>
				Toggle <code>isVisible</code> in controls to animate in/out.
			</p>
			<BottomBanner {...args} />
		</div>
	),
};

// ─── Interactive toggle ───────────────────────────────────────────

function ToggleDemo({
	themeClass,
	message,
	buttonLabel,
}: {
	themeClass?: string;
	message: string;
	buttonLabel: string;
}) {
	const [visible, setVisible] = useState(false);

	return (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				minHeight: "300px",
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
				gap: 16,
			}}
		>
			<button
				type="button"
				onClick={() => setVisible((v) => !v)}
				style={{
					padding: "8px 16px",
					background: "var(--accent)",
					color: "#fff",
					border: "none",
					borderRadius: 8,
					cursor: "pointer",
					fontSize: 13,
					fontFamily: "var(--font-b)",
				}}
			>
				{visible ? "Схаваць" : "Паказаць"} банер
			</button>
			<BottomBanner
				ariaLabel="Дэма"
				message={message}
				buttonLabel={buttonLabel}
				onAction={() => setVisible(false)}
				isVisible={visible}
				themeClass={themeClass}
			/>
		</div>
	);
}

export const Interactive: Story = {
	render: () => (
		<ToggleDemo
			message="Даступная новая версія дадатку."
			buttonLabel="Абнавіць"
		/>
	),
};

// ─── Themes ───────────────────────────────────────────────────────

function ThemeRow({
	themeClass,
	label,
	accent,
}: {
	themeClass: string;
	label: string;
	accent: string;
}) {
	return (
		<div
			className={themeClass}
			style={{
				position: "relative",
				minHeight: 120,
				background: "var(--bg)",
				border: "1px solid var(--rule)",
				borderRadius: 12,
				overflow: "hidden",
				marginBottom: 24,
			}}
		>
			<span
				style={{
					position: "absolute",
					top: 16,
					left: 20,
					fontSize: 11,
					fontFamily: "var(--font-b)",
					fontVariantCaps: "small-caps",
					letterSpacing: "0.12em",
					color: accent,
				}}
			>
				{label}
			</span>
			<BottomBanner
				ariaLabel={label}
				message="Слова дня абноўлена."
				buttonLabel="Глядзець"
				onAction={() => {}}
				isVisible
			/>
		</div>
	);
}

export const Themes: Story = {
	render: () => (
		<div style={{ padding: 40, background: "var(--bg)" }}>
			<ThemeRow
				themeClass=""
				label="Валошка (default)"
				accent="var(--valoshka)"
			/>
			<ThemeRow
				themeClass="theme-pobach"
				label="Побач (terracotta)"
				accent="var(--pobach)"
			/>
		</div>
	),
};
