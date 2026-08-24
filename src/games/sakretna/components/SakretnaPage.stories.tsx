import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
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
