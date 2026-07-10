import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GuessList } from "./GuessList";

const meta = {
	title: "Redaktle/GuessList",
	component: GuessList,
	parameters: { layout: "padded" },
} satisfies Meta<typeof GuessList>;

export default meta;
type Story = StoryObj<typeof GuessList>;

export const Populated: Story = {
	args: {
		guesses: ["горад", "сталіца", "архітэктура", "аўтамабіль", "гісторыя"],
	},
};

export const Empty: Story = {
	args: { guesses: [] },
};
