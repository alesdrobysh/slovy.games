import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GuessInput } from "./GuessInput";

const meta = {
	title: "Redaktle/GuessInput",
	component: GuessInput,
	parameters: { layout: "padded" },
} satisfies Meta<typeof GuessInput>;

export default meta;
type Story = StoryObj<typeof GuessInput>;

export const Empty: Story = {
	args: {
		value: "",
		onChange: () => {},
		onSubmit: () => {},
	},
};

export const WithText: Story = {
	args: {
		value: "горад",
		onChange: () => {},
		onSubmit: () => {},
	},
};

export const Disabled: Story = {
	args: {
		value: "",
		onChange: () => {},
		onSubmit: () => {},
		disabled: true,
		placeholder: "Слоўнік загружаецца…",
	},
};
