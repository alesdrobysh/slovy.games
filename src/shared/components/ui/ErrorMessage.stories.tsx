import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErrorMessage } from "./ErrorMessage";

const meta = {
	title: "Design/ErrorMessage",
	component: ErrorMessage,
	tags: ["autodocs"],
	parameters: { layout: "padded" },
	argTypes: {
		message: { control: "text" },
		word: { control: "text" },
		id: { control: "text" },
	},
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const WithWord: Story = {
	args: {
		message: "Слова не знойдзена ў слоўніку",
		word: "дрэва",
	},
};

export const WithoutWord: Story = {
	args: {
		message: "Увядзіце слова для здагадкі",
	},
};

export const Playground: Story = {
	args: {
		message: "Слова не знойдзена ў слоўніку",
		word: "дрэва",
	},
};
