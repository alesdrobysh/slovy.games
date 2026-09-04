import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GuessInput from "./GuessInput";

const meta = {
	title: "Pobach/GuessInput",
	component: GuessInput,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	args: {
		input: "",
		setInput: () => {},
		onSubmit: () => {},
		onHint: () => {},
		onGiveUp: () => {},
		loading: false,
		won: false,
		gameOver: false,
		error: null,
		errorWord: null,
		guessCount: 0,
	},
} satisfies Meta<typeof GuessInput>;

export default meta;
type Story = StoryObj<typeof GuessInput>;

const wrap = (children: React.ReactNode) => (
	<div
		className="theme-pobach"
		style={{ padding: 32, background: "var(--bg)", maxWidth: 480 }}
	>
		{children}
	</div>
);

export const Default: Story = {
	render: (args) => wrap(<GuessInput {...args} />),
};

export const WithText: Story = {
	args: { input: "дрэва" },
	render: (args) => wrap(<GuessInput {...args} />),
};

export const Loading: Story = {
	args: { input: "дрэва", loading: true },
	render: (args) => wrap(<GuessInput {...args} />),
};

export const WithError: Story = {
	args: {
		input: "",
		error: "Слова не знойдзена ў слоўніку",
		errorWord: "дрэва",
	},
	render: (args) => wrap(<GuessInput {...args} />),
};

export const WithErrorNoWord: Story = {
	args: {
		input: "",
		error: "Увядзіце слова для здагадкі",
		errorWord: null,
	},
	render: (args) => wrap(<GuessInput {...args} />),
};

export const ManyGuesses: Story = {
	args: { guessCount: 12 },
	render: (args) => wrap(<GuessInput {...args} />),
};

export const Won: Story = {
	args: { won: true },
	render: (args) => wrap(<GuessInput {...args} />),
};

export const GameOver: Story = {
	args: { gameOver: true },
	render: (args) => wrap(<GuessInput {...args} />),
};

export const Playground: Story = {
	argTypes: {
		input: { control: "text" },
		loading: { control: "boolean" },
		won: { control: "boolean" },
		gameOver: { control: "boolean" },
		error: { control: "text" },
		errorWord: { control: "text" },
		guessCount: { control: { type: "number", min: 0 } },
	},
	render: (args) => wrap(<GuessInput {...args} />),
};
