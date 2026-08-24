import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { tokenize } from "../lib/tokenize";
import { GuessList } from "./GuessList";

const meta = {
	title: "Sakretna/GuessList",
	component: GuessList,
	parameters: { layout: "padded" },
} satisfies Meta<typeof GuessList>;

export default meta;
type Story = StoryObj<typeof GuessList>;

export const Populated: Story = {
	args: {
		guesses: ["горад", "сталіца", "архітэктура", "аўтамабіль", "гісторыя"],
		tokens: tokenize("Горад — сталіца. Гісторыя горада і архітэктура."),
	},
};

export const Empty: Story = {
	args: { guesses: [] },
};
