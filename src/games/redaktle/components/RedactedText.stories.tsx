import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { tokenize } from "@/games/redaktle/lib/tokenize";
import { RedactedText } from "./RedactedText";

const EXCERPT =
	"Горад Мінск — сталіца Беларусі і адзін з найстарэйшых гарадоў Еўропы. Першыя згадкі пра паселішча на месцы сучаснай сталіцы адносяцца да 1067 года.";
const tokens = tokenize(EXCERPT);

const meta = {
	title: "Redaktle/RedactedText",
	component: RedactedText,
	parameters: { layout: "padded" },
} satisfies Meta<typeof RedactedText>;

export default meta;
type Story = StoryObj<typeof RedactedText>;

export const AllRedacted: Story = {
	args: {
		tokens,
		foundLemmas: new Set(),
	},
};

export const PartiallyRevealed: Story = {
	args: {
		tokens,
		foundLemmas: new Set(["горад", "сталіца", "беларусь"]),
	},
	render: (args) => (
		<div className="bg-card ring-1 ring-rule rounded-2xl p-inset-lg max-w-3xl">
			<RedactedText {...args} />
		</div>
	),
};
