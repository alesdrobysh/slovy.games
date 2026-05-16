import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StorageInspector } from "./StorageInspector";

const meta = {
	title: "Valoshka/StorageInspector",
	component: StorageInspector,
	parameters: {
		layout: "fullscreen",
	},
	args: {
		onClose: () => {},
	},
} satisfies Meta<typeof StorageInspector>;

export default meta;
type Story = StoryObj<typeof StorageInspector>;

export const Open: Story = {
	args: { open: true },
	decorators: [
		(Story) => {
			if (typeof window !== "undefined") {
				localStorage.setItem(
					"vulej_valoshka_2026-03-18",
					JSON.stringify({ score: 45, foundWords: ["кіно", "капа", "папка"] })
				);
			}
			return <Story />;
		},
	],
};

export const Empty: Story = {
	args: { open: true },
};
