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
		extraActions: (
			<button
				type="button"
				style={{
					fontSize: 11,
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.08em",
					padding: "4px 10px",
					borderRadius: 6,
					border: "1px solid currentColor",
					opacity: 0.7,
				}}
			>
				Учора
			</button>
		),
	},
};

export const ValoshkaStats: Story = {
	args: { pathname: "/valoshka/stats" },
};
