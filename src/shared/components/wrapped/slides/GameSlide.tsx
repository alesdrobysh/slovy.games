import { StatCard } from "@/shared/components/ui/StatCard";
import { Typography } from "@/shared/components/ui/Typography";
import { pluralize } from "@/shared/lib/pluralize";
import type { GameYearStats } from "@/shared/types/wrapped";
import { SlideFrame } from "./SlideFrame";

const GAME_NAMES: Record<string, string> = {
	pobach: "Побач",
	valoshka: "Валошка",
};

export interface GameSlideProps {
	stats: GameYearStats;
	page: 1 | 2;
}

const GAME_ACCENTS: Record<string, string> = {
	pobach: "bg-pobach-soft",
	valoshka: "bg-valoshka-soft",
};

export function GameSlide({ stats, page }: GameSlideProps) {
	const name = GAME_NAMES[stats.gameId] ?? stats.gameId;
	const accent = GAME_ACCENTS[stats.gameId];

	if (page === 1) {
		return (
			<SlideFrame accentClassName={accent}>
				<Typography variant="overline" className="text-ink-muted">
					{name}
				</Typography>
				<Typography variant="statHero" as="p">
					{stats.daysPlayed.length}
				</Typography>
				<Typography variant="caption" className="text-ink-muted">
					{pluralize(stats.daysPlayed.length, "дзень")} у гульні
				</Typography>
				<Typography variant="body" className="text-ink-muted">
					Найдаўжэйшая серыя: {stats.longestStreakInYear}
				</Typography>
			</SlideFrame>
		);
	}

	return (
		<SlideFrame accentClassName={accent}>
			<Typography variant="title" as="h2">
				{name}: найлепшае
			</Typography>
			<div className="grid w-full max-w-md grid-cols-2 gap-flow-md">
				{stats.highlights.map((h) => (
					<StatCard key={h.key} label={h.label} value={h.value} />
				))}
			</div>
		</SlideFrame>
	);
}
