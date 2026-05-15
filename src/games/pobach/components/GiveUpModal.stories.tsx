import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GiveUpModal from "./GiveUpModal";

const meta = {
	title: "Pobach/GiveUpModal",
	component: GiveUpModal,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	args: {
		isOpen: true,
		onConfirm: () => {},
		onClose: () => {},
	},
} satisfies Meta<typeof GiveUpModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrap = (children: React.ReactNode) => (
	<div className="theme-pobach" style={{ background: "var(--bg)", minHeight: 300 }}>
		{children}
	</div>
);

export const Open: Story = {
	render: (args) => wrap(<GiveUpModal {...args} />),
};

export const Closed: Story = {
	args: { isOpen: false },
	render: (args) => wrap(<GiveUpModal {...args} />),
};

export const Playground: Story = {
	argTypes: {
		isOpen: { control: "boolean" },
	},
	render: (args) => wrap(<GiveUpModal {...args} />),
};
