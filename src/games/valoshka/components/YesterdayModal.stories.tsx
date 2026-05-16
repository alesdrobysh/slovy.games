import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { YesterdayModal } from "./YesterdayModal";

const meta = {
	title: "Valoshka/YesterdayModal",
	component: YesterdayModal,
	parameters: {
		layout: "fullscreen",
	},
	args: {
		onClose: () => {},
		isOpen: true,
	},
} satisfies Meta<typeof YesterdayModal>;

export default meta;
type Story = StoryObj<typeof YesterdayModal>;

// The modal renders its content only when yesterday's puzzle exists in puzzle
// data. Use a date after a known puzzle date so the previous day resolves.
export const Default: Story = {
	args: { currentDate: "2026-03-19", isOpen: true },
};

// Story showing the full trigger + modal flow
export const WithTrigger: Story = {
	args: { currentDate: "2026-03-19" },
	render: (args) => {
		const [open, setOpen] = useState(false);
		return (
			<div style={{ padding: 24, background: "var(--bg)" }}>
				<Button variant="ghost" color="neutral" onClick={() => setOpen(true)}>
					Учора
				</Button>
				<YesterdayModal
					{...args}
					isOpen={open}
					onClose={() => setOpen(false)}
				/>
			</div>
		);
	},
};
