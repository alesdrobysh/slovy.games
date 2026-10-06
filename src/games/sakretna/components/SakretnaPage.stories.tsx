import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import type {
	Article,
	ArticleToken,
	PickedArticle,
	SavedProgress,
} from "../types";
import { HowToPlay } from "./HowToPlay";
import { SakretnaPage } from "./SakretnaPage";

const ARTICLE: Article = {
	id: "storybook-minsk",
	title: "Мінск",
	body: "Мінск — сталіца Беларусі. Горад стаіць на рацэ Свіслач.\n\n\nГісторыя\nПершыя згадкі пра горад вядомыя з летапісаў. Мінск рос і змяняўся.\n\nВядомыя месцы:\nплошча Незалежнасці\nНацыянальная бібліятэка\nВерхні горад",
	source: "https://be.wikipedia.org/wiki/Мінск",
	retrieved: "2026-08-24",
};

function tokens(text: string): ArticleToken[] {
	return (
		text.match(/[\p{Letter}\p{M}]+|[^\p{Letter}\p{M}]/gu)?.map((text) =>
			/^[\p{Letter}\p{M}]+$/u.test(text)
				? {
						type: "word",
						text,
						lemma: text.toLowerCase(),
						isFree: text.length < 3,
					}
				: { type: "sep", text }
		) ?? []
	);
}

const PICKED: PickedArticle = {
	article: ARTICLE,
	tokens: tokens(ARTICLE.body),
	titleTokens: tokens(ARTICLE.title),
	date: "storybook",
};

function saved(overrides: Partial<SavedProgress>): SavedProgress {
	return {
		date: PICKED.date,
		articleId: ARTICLE.id,
		foundLemmas: [],
		guesses: [],
		won: false,
		givenUp: false,
		hintsUsed: 0,
		startedAt: "2026-08-24T10:00:00Z",
		...overrides,
	};
}

function Fixture({
	progress,
	firstRun = false,
}: {
	progress?: SavedProgress;
	firstRun?: boolean;
}) {
	const [onboardingOpen, setOnboardingOpen] = useState(firstRun);
	if (typeof window !== "undefined") {
		window.localStorage.removeItem(`sakretna_${PICKED.date}`);
		if (progress) {
			window.localStorage.setItem(
				`sakretna_${PICKED.date}`,
				JSON.stringify(progress)
			);
		}
		if (firstRun) window.localStorage.removeItem("sakretna:onboarding:v1");
		else window.localStorage.setItem("sakretna:onboarding:v1", "seen");
	}
	return (
		<>
			<SakretnaPage picked={PICKED} />
			{firstRun && (
				<HowToPlay
					isOpen={onboardingOpen}
					isFirstRun
					onClose={() => setOnboardingOpen(false)}
				/>
			)}
		</>
	);
}

const meta = {
	title: "Sakretna/SakretnaPage/Mobile regression",
	component: SakretnaPage,
	parameters: {
		layout: "fullscreen",
		viewport: { defaultViewport: "mobile360" },
		a11y: { test: "error" },
	},
	decorators: [
		(Story) => (
			<div className="theme-sakretna bg-paper min-h-screen">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof SakretnaPage>;

export default meta;
type Story = StoryObj<typeof SakretnaPage>;

export const FirstRun: Story = {
	args: { picked: PICKED },
	render: () => <Fixture firstRun />,
};
export const InProgress360: Story = {
	args: { picked: PICKED },
	render: () => <Fixture />,
};
export const InProgress390: Story = {
	args: { picked: PICKED },
	parameters: { viewport: { defaultViewport: "mobile390" } },
	render: () => <Fixture />,
};
export const Miss: Story = {
	args: { picked: PICKED },
	render: () => <Fixture progress={saved({ guesses: ["невядома"] })} />,
};
export const Hit: Story = {
	args: { picked: PICKED },
	render: () => (
		<Fixture progress={saved({ guesses: ["мінск"], foundLemmas: ["мінск"] })} />
	),
};
/**
 * Simulates a phone with the on-screen keyboard up: a coarse pointer plus a
 * focused guess field. The nav hides, the title compacts and the console
 * keeps the latest history row above its input.
 */
export const KeyboardOpen: Story = {
	args: { picked: PICKED },
	render: () => {
		const original = window.matchMedia;
		window.matchMedia = (query: string) =>
			query === "(pointer: coarse)"
				? ({
						matches: true,
						media: query,
						addEventListener: () => {},
						removeEventListener: () => {},
					} as unknown as MediaQueryList)
				: original.call(window, query);
		return (
			<Fixture
				progress={saved({
					guesses: ["невядома", "мінск"],
					foundLemmas: ["мінск"],
				})}
			/>
		);
	},
	play: async ({ canvas, userEvent }) => {
		const input = await canvas.findByLabelText("Увядзіце слова");
		await userEvent.click(input);
		await expect(document.documentElement.dataset.keyboard).toBe("open");
		await expect(canvas.getByText("Падказка")).not.toBeVisible();
		await expect(canvas.getByLabelText("Гісторыя спроб")).toBeVisible();
		await expect(canvas.getByRole("button", { name: "Увесці" })).toBeVisible();
		await expect(input).toBeVisible();
	},
};
/**
 * Only 300px of height, keyboard closed: what is left of a small phone under
 * the keyboard, or a landscape phone. The console keeps icon actions, the
 * latest history row and the input in the fixed dock.
 */
export const ShortViewport: Story = {
	args: { picked: PICKED },
	parameters: { viewport: { defaultViewport: "mobile360short" } },
	render: () => (
		<Fixture
			progress={saved({
				guesses: ["невядома", "мінск"],
				foundLemmas: ["мінск"],
			})}
		/>
	),
	play: async ({ canvas }) => {
		await expect(window.innerHeight).toBeLessThanOrEqual(480);
		await expect(canvas.getByText("Здацца")).not.toBeVisible();
		await expect(canvas.getByRole("button", { name: "Здацца" })).toBeVisible();
		await expect(canvas.getByLabelText("Гісторыя спроб")).toBeVisible();
		await expect(canvas.getByLabelText("Увядзіце слова")).toBeVisible();
		const dock = canvas
			.getByLabelText("Увядзіце слова")
			.closest(".fixed") as HTMLElement;
		await expect(dock.getBoundingClientRect().height).toBeLessThan(220);
	},
};
export const StaleErrorRegression: Story = {
	args: { picked: PICKED },
	render: () => (
		<Fixture
			progress={saved({
				guesses: ["невядома", "мінск"],
				foundLemmas: ["мінск"],
			})}
		/>
	),
};
export const Hint: Story = {
	args: { picked: PICKED },
	render: () => (
		<Fixture progress={saved({ foundLemmas: ["сталіца"], hintsUsed: 1 })} />
	),
};
export const Win: Story = {
	args: { picked: PICKED },
	render: () => (
		<Fixture
			progress={saved({
				guesses: ["мінск"],
				foundLemmas: ["мінск"],
				won: true,
				finishedAt: "2026-08-24T10:02:00Z",
			})}
		/>
	),
};
export const GiveUp: Story = {
	args: { picked: PICKED },
	render: () => (
		<Fixture
			progress={saved({
				foundLemmas: [
					...new Set(PICKED.tokens.flatMap((token) => token.lemma ?? [])),
				],
				givenUp: true,
				finishedAt: "2026-08-24T10:04:00Z",
			})}
		/>
	),
};
