import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FoundWordsList } from "./FoundWordsList";

const meta = {
	title: "Valoshka/FoundWordsList",
	component: FoundWordsList,
	tags: ["autodocs"],
	args: {
		pangrams: ["падаконнік", "паддоннік"],
	},
} satisfies Meta<typeof FoundWordsList>;

export default meta;
type Story = StoryObj<typeof FoundWordsList>;

const wrap = (children: React.ReactNode) => (
	<div style={{ width: 320, background: "var(--bg)", padding: 24 }}>
		{children}
	</div>
);

export const Empty: Story = {
	render: (args) => wrap(<FoundWordsList {...args} />),
	args: { words: [] },
};

export const WithWords: Story = {
	render: (args) => wrap(<FoundWordsList {...args} />),
	args: {
		words: [
			"канапа",
			"кіно",
			"папка",
			"падаконнік",
			"копка",
			"паніка",
			"паддоннік",
			"канон",
		],
	},
};
