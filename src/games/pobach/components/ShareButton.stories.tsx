import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Guess } from "@/games/pobach/types";
import ShareButton from "./ShareButton";

const meta = {
	title: "Pobach/ShareButton",
	component: ShareButton,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	args: {
		dayIndex: 1,
		guesses: [],
		won: false,
	},
} satisfies Meta<typeof ShareButton>;

export default meta;
type Story = StoryObj<typeof ShareButton>;

const wrap = (children: React.ReactNode) => (
	<div
		className="theme-pobach"
		style={{ padding: 32, background: "var(--bg)", maxWidth: 480 }}
	>
		{children}
	</div>
);

const winGuesses: Guess[] = [
	{ word: "побач", rank: 1 },
	{ word: "блізка", rank: 45 },
	{ word: "поруч", rank: 120 },
	{ word: "далей", rank: 850 },
];

const lossGuesses: Guess[] = [
	{ word: "далёка", rank: 2500 },
	{ word: "высока", rank: 1800 },
	{ word: "глыбока", rank: 3200 },
];

const withHintGuesses: Guess[] = [
	{ word: "побач", rank: 1 },
	{ word: "поруч", rank: 120, isHint: true },
	{ word: "блізка", rank: 45 },
];

export const Won: Story = {
	args: { guesses: winGuesses, won: true },
	render: (args) => wrap(<ShareButton {...args} />),
};

export const Lost: Story = {
	args: { guesses: lossGuesses, won: false },
	render: (args) => wrap(<ShareButton {...args} />),
};

export const WithHints: Story = {
	args: { guesses: withHintGuesses, won: true },
	render: (args) => wrap(<ShareButton {...args} />),
};

export const NoGuesses: Story = {
	args: { guesses: [], won: false },
	render: (args) => wrap(<ShareButton {...args} />),
};

export const Playground: Story = {
	argTypes: {
		dayIndex: { control: { type: "number", min: 0 } },
		won: { control: "boolean" },
	},
	args: { guesses: winGuesses, won: true },
	render: (args) => wrap(<ShareButton {...args} />),
};
