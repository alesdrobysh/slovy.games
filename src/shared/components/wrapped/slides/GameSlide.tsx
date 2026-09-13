import { StatCard } from "@/shared/components/ui/StatCard";
import { Typography } from "@/shared/components/ui/Typography";
import { useCountUp } from "@/shared/components/wrapped/useCountUp";
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
	pobach: "wrapped-game--pobach",
	valoshka: "wrapped-game--valoshka",
};

export function GameSlide({ stats, page }: GameSlideProps) {
	const name = GAME_NAMES[stats.gameId] ?? stats.gameId;
	const accent = GAME_ACCENTS[stats.gameId];
	// Called unconditionally so switching pages does not change hook order.
	const shownDays = useCountUp(stats.daysPlayed.length);

	if (page === 1) {
		return (
			<SlideFrame variant="game" accentClassName={accent}>
				<div className="wrapped-game-word" aria-hidden="true">
					{name} · {name} · {name}
				</div>
				<div className="wrapped-game-medallion wrapped-reveal">
					<Typography variant="overline">{name}</Typography>
					<Typography variant="displayHuge">{shownDays}</Typography>
					<Typography variant="caption">
						{pluralize(stats.daysPlayed.length, "дзень")} у гульні
					</Typography>
				</div>
				<div className="wrapped-streak-sticker wrapped-reveal wrapped-reveal--late">
					<Typography variant="overline">Серыя</Typography>
					<Typography variant="metric">{stats.longestStreakInYear}</Typography>
					<Typography variant="label">дзён запар</Typography>
				</div>
			</SlideFrame>
		);
	}

	return (
		<SlideFrame
			variant="game"
			accentClassName={`${accent} wrapped-game--highlights`}
		>
			<div className="wrapped-highlight-shape" aria-hidden="true">
				★
			</div>
			<div className="wrapped-slide-title wrapped-reveal">
				<Typography variant="displayHeading">{name}: найлепшае</Typography>
			</div>
			<div className="wrapped-stat-grid wrapped-stat-grid--game wrapped-reveal wrapped-reveal--late">
				{stats.highlights.map((h) => (
					<StatCard
						appearance="wrapped"
						className="wrapped-stat-card"
						key={h.key}
						label={h.label}
						value={h.value}
					/>
				))}
			</div>
		</SlideFrame>
	);
}
