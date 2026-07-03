import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CompanionGrid } from "./CompanionGrid";

const meta = {
	title: "Valoshka/CompanionGrid",
	component: CompanionGrid,
	parameters: { layout: "centered" },
} satisfies Meta<typeof CompanionGrid>;

export default meta;
type Story = StoryObj<typeof CompanionGrid>;

const answers = [
	"акно",
	"акоп",
	"капа",
	"кіно",
	"кіпа",
	"конка",
	"копка",
	"папка",
	"паніка",
	"канапа",
	"канон",
	"пікнік",
	"падаконнік",
	"паддоннік",
	"падонкі",
];
const pangrams = ["падаконнік", "паддоннік", "падонкі"];

export const Default: Story = {
	name: "No words found — full grid",
	args: {
		isOpen: true,
		onClose: () => {},
		answers,
		foundWords: [],
		pangrams,
	},
};

export const PartialProgress: Story = {
	name: "Some words found",
	args: {
		isOpen: true,
		onClose: () => {},
		answers,
		foundWords: ["акно", "капа", "падаконнік"],
		pangrams,
	},
};

export const AllFound: Story = {
	name: "All words found",
	args: {
		isOpen: true,
		onClose: () => {},
		answers,
		foundWords: [...answers],
		pangrams,
	},
};
