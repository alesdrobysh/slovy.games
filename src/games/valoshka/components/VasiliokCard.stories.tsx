import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getMskDateString } from "@/shared/lib/timezone";
import { VasiliokCard } from "./VasiliokCard";

const meta = {
	title: "Valoshka/VasiliokCard",
	component: VasiliokCard,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		date: { control: "text" },
		score: { control: { type: "number" } },
		maxScore: { control: { type: "number" } },
	},
	args: {
		date: getMskDateString(),
		score: 400,
		maxScore: 400,
	},
} satisfies Meta<typeof VasiliokCard>;

export default meta;
type Story = StoryObj<typeof VasiliokCard>;

const wrap = (children: React.ReactNode) => (
	<div
		className="theme-valoshka"
		style={{ padding: 32, background: "var(--bg)", maxWidth: 480 }}
	>
		{children}
	</div>
);

export const Playground: Story = {
	render: (args) => wrap(<VasiliokCard {...args} />),
};

export const NewDayAvailable: Story = {
	args: { date: "2000-01-01" },
	render: (args) => wrap(<VasiliokCard {...args} />),
};
