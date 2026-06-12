import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HintButton } from "./HintButton";

const meta = {
	title: "Valoshka/HintButton",
	component: HintButton,
	parameters: { layout: "centered" },
	args: { onClick: () => {} },
} satisfies Meta<typeof HintButton>;

export default meta;
type Story = StoryObj<typeof HintButton>;

// ─── Individual states ─────────────────────────────────────────────

/** wordsEarnTokenCount = 0: game start, no progress */
export const Empty: Story = {
	args: { wordsEarnTokenCount: 0 },
};

/** wordsEarnTokenCount = 1: 33% fill, earning toward first token */
export const Filling33: Story = {
	name: "Filling 33%",
	args: { wordsEarnTokenCount: 1 },
};

/** wordsEarnTokenCount = 2: 66% fill, one more word needed */
export const Filling66: Story = {
	name: "Filling 66%",
	args: { wordsEarnTokenCount: 2 },
};

/** wordsEarnTokenCount = 3: 1 token ready */
export const TokenReady1: Story = {
	name: "Token ready (1)",
	args: { wordsEarnTokenCount: 3 },
};

/** wordsEarnTokenCount = 6: 2 tokens banked */
export const TokenReady2: Story = {
	name: "Token ready (2)",
	args: { wordsEarnTokenCount: 6 },
};

/** wordsEarnTokenCount = 9: 3 tokens — maximum */
export const TokenReadyMax: Story = {
	name: "Token ready (max 3)",
	args: { wordsEarnTokenCount: 9 },
};

// ─── All states side by side ───────────────────────────────────────

const label = (text: string) => (
	<span
		style={{
			fontSize: 10,
			fontWeight: 700,
			textTransform: "uppercase" as const,
			letterSpacing: "0.1em",
			color: "var(--muted, #999)",
			fontFamily: "monospace",
		}}
	>
		{text}
	</span>
);

export const AllStates: Story = {
	name: "All states",
	render: (args) => (
		<div
			style={{
				display: "flex",
				gap: 32,
				alignItems: "flex-end",
				padding: 32,
				background: "var(--bg)",
			}}
		>
			{[
				{ count: 0, desc: "0 — disabled" },
				{ count: 1, desc: "1 — 33%" },
				{ count: 2, desc: "2 — 66%" },
				{ count: 3, desc: "3 — 1 token" },
				{ count: 6, desc: "6 — 2 tokens" },
				{ count: 9, desc: "9 — max (3)" },
			].map(({ count, desc }) => (
				<div
					key={count}
					style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
				>
					<HintButton {...args} wordsEarnTokenCount={count} />
					{label(desc)}
				</div>
			))}
		</div>
	),
	args: { wordsEarnTokenCount: 0 },
};
