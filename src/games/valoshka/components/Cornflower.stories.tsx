import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cornflower } from "./Cornflower";

const meta = {
	title: "Valoshka/Cornflower",
	component: Cornflower,
	parameters: {
		layout: "centered",
	},
	args: {
		center: "к",
		outer: ["а", "д", "і", "н", "о", "п"],
		onLetter: () => {},
	},
} satisfies Meta<typeof Cornflower>;

export default meta;
type Story = StoryObj<typeof Cornflower>;

const wrap = (children: React.ReactNode) => (
	<div style={{ width: 320, background: "var(--bg)", padding: 24 }}>
		{children}
	</div>
);

export const Default: Story = {
	render: (args) => wrap(<Cornflower {...args} />),
};

export const AfterShuffle: Story = {
	render: (args) => wrap(<Cornflower {...args} />),
	args: { outer: ["п", "о", "н", "і", "д", "а"], shuffleCount: 1 },
};
