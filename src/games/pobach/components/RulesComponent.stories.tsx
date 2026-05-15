import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RulesComponent from "./RulesComponent";

const meta = {
	title: "Pobach/RulesComponent",
	component: RulesComponent,
	tags: ["autodocs"],
	argTypes: {
		inline: { control: "boolean" },
	},
	args: {
		inline: false,
	},
} satisfies Meta<typeof RulesComponent>;

export default meta;
type Story = StoryObj<typeof RulesComponent>;

const wrap = (style?: React.CSSProperties) => ({
	padding: 40,
	background: "var(--bg)",
	minHeight: "100vh",
	maxWidth: 480,
	...style,
});

const lab = (): React.CSSProperties => ({
	fontSize: 10,
	fontWeight: 700,
	textTransform: "uppercase",
	letterSpacing: "0.12em",
	color: "var(--muted)",
	marginBottom: 10,
	fontFamily: "var(--font-b)",
});

export const Default: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Modal / sidebar variant</p>
			<RulesComponent {...args} />
		</div>
	),
};

export const Inline: Story = {
	args: { inline: true },
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Inline card variant</p>
			<RulesComponent {...args} />
		</div>
	),
};

export const BothVariants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: 40, padding: 40, background: "var(--bg)" }}>
			<div style={{ maxWidth: 400, flex: 1 }}>
				<p style={lab()}>Default (modal / sidebar)</p>
				<RulesComponent />
			</div>
			<div style={{ maxWidth: 400, flex: 1 }}>
				<p style={lab()}>Inline card</p>
				<RulesComponent inline />
			</div>
		</div>
	),
};

export const Playground: Story = {
	render: (args) => (
		<div style={wrap()}>
			<RulesComponent {...args} />
		</div>
	),
};
