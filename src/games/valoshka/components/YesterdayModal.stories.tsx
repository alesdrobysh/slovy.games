import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { YesterdayModal } from "./YesterdayModal";

const meta = {
	title: "Valoshka/YesterdayModal",
	component: YesterdayModal,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof YesterdayModal>;

export default meta;
type Story = StoryObj<typeof YesterdayModal>;

// The "Учора" trigger button renders only when yesterday's puzzle exists in
// the puzzle data. Pass a date after a known puzzle date so the previous day
// resolves. In CI / Storybook, the component returns null if puzzle not found.
export const Default: Story = {
	args: { currentDate: "2026-03-19" },
	render: (args) => (
		<div style={{ padding: 24, background: "var(--bg)" }}>
			<YesterdayModal {...args} />
		</div>
	),
};
