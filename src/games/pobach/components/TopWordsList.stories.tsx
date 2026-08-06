import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { TopWord } from "@/games/pobach/types";
import TopWordsList from "./TopWordsList";

const meta = {
	title: "Pobach/TopWordsList",
	component: TopWordsList,
	tags: ["autodocs"],
	argTypes: {
		dayIndex: { control: { type: "number" } },
	},
	args: {
		dayIndex: 1,
	},
} satisfies Meta<typeof TopWordsList>;

export default meta;
type Story = StoryObj<typeof TopWordsList>;

const wrap = (style?: React.CSSProperties) => ({
	padding: 40,
	background: "var(--bg)",
	minHeight: "100vh",
	maxWidth: 480,
	...style,
});

const lab = () => ({
	fontSize: 10,
	fontWeight: 700,
	textTransform: "uppercase" as const,
	letterSpacing: "0.12em",
	color: "var(--muted)",
	marginBottom: 10,
	fontFamily: "var(--font-b)",
});

const SAMPLE_WORDS: TopWord[] = [
	{ rank: 1, word: "слова" },
	{ rank: 2, word: "мова" },
	{ rank: 3, word: "сказаць" },
	{ rank: 4, word: "гаварыць" },
	{ rank: 5, word: "верабей" },
	{ rank: 6, word: "вясна" },
	{ rank: 7, word: "рака" },
	{ rank: 8, word: "бяроза" },
	{ rank: 9, word: "зямля" },
	{ rank: 10, word: "дрэва" },
];

function mockFetch(result: "success" | "error" | "slow") {
	return async (input: RequestInfo | URL) => {
		if (!String(input).includes("top-words")) {
			return fetch(input);
		}
		if (result === "error") {
			throw new Error("Network error");
		}
		if (result === "slow") {
			await new Promise((r) => setTimeout(r, 60_000));
		}
		return new Response(JSON.stringify(SAMPLE_WORDS), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	};
}

// ─── Collapsed (default) ──────────────────────────────────────────

export const Collapsed: Story = {
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Collapsed — click to load</p>
			<TopWordsList {...args} />
		</div>
	),
};

// ─── Loaded ───────────────────────────────────────────────────────

export const Loaded: Story = {
	decorators: [
		(Story) => {
			globalThis.fetch = mockFetch("success") as typeof fetch;
			return <Story />;
		},
	],
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Loaded — click "Паказаць бліжэйшыя словы" to expand</p>
			<TopWordsList {...args} />
		</div>
	),
};

// ─── Loading skeleton ─────────────────────────────────────────────

export const Loading: Story = {
	decorators: [
		(Story) => {
			globalThis.fetch = mockFetch("slow") as typeof fetch;
			return <Story />;
		},
	],
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Loading skeleton — fetch hangs indefinitely</p>
			<TopWordsList {...args} />
		</div>
	),
};

// ─── Error state ──────────────────────────────────────────────────

export const FetchError: Story = {
	decorators: [
		(Story) => {
			globalThis.fetch = mockFetch("error") as typeof fetch;
			return <Story />;
		},
	],
	render: (args) => (
		<div style={wrap()}>
			<p style={lab()}>Error — fetch throws; retry link shown</p>
			<TopWordsList {...args} />
		</div>
	),
};

// ─── Playground ───────────────────────────────────────────────────

export const Playground: Story = {
	decorators: [
		(Story) => {
			globalThis.fetch = mockFetch("success") as typeof fetch;
			return <Story />;
		},
	],
	render: (args) => (
		<div style={wrap()}>
			<TopWordsList {...args} />
		</div>
	),
};
