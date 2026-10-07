import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Nav } from "@/shared/components/Nav";
import { ThemeProvider } from "@/shared/hooks/useTheme";

const meta = {
	title: "Shared/Nav",
	component: Nav,
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<ThemeProvider>
				<Story />
			</ThemeProvider>
		),
	],
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof Nav>;

// ─── Hub mode ─────────────────────────────────────────────────────

export const Hub: Story = {
	args: { pathname: "/" },
};

// ─── Game mode — Побач ────────────────────────────────────────────

export const PobachGame: Story = {
	args: {
		pathname: "/pobach",
		onHelpClick: () => {},
	},
	decorators: [
		(Story) => (
			<div className="theme-pobach">
				<Story />
			</div>
		),
	],
};

export const PobachStats: Story = {
	args: { pathname: "/pobach/stats" },
	decorators: [
		(Story) => (
			<div className="theme-pobach">
				<Story />
			</div>
		),
	],
};

// ─── Game mode — Валошка ──────────────────────────────────────────

export const ValoshkaGame: Story = {
	args: {
		pathname: "/valoshka",
		onHelpClick: () => {},
		menuItems: [{ label: "Учарашнія адказы", onSelect: () => {} }],
	},
};

export const ValoshkaStats: Story = {
	args: { pathname: "/valoshka/stats" },
};
