import { StatCard } from "@/shared/components/ui/StatCard";
import { Typography } from "@/shared/components/ui/Typography";
import { pluralize } from "@/shared/lib/pluralize";
import { gameName, MONTHS_NOM } from "@/shared/lib/wrapped/format";
import type { WrappedSummary } from "@/shared/types/wrapped";
import { SlideFrame } from "./SlideFrame";

/** "у трох гульнях" — how many games the active days were spread over. */
const ACROSS_GAMES = [
	"",
	"у адной гульні",
	"у дзвюх гульнях",
	"у трох гульнях",
];

export interface CommonSlideProps {
	summary: WrappedSummary;
}

export function CommonSlide({ summary }: CommonSlideProps) {
	const streak = summary.longestStreakAnyGame;
	const topGame = summary.perGame.find(
		(g) => g.gameId === summary.gameOfTheYear
	);
	const across = ACROSS_GAMES[summary.perGame.length];

	return (
		<SlideFrame variant="common">
			<div className="wrapped-common-shape" aria-hidden="true">
				ГОД
			</div>
			<div className="wrapped-slide-title wrapped-reveal">
				<Typography variant="displayHeading">Разам за год</Typography>
			</div>
			<div className="wrapped-stat-grid wrapped-reveal wrapped-reveal--late">
				<StatCard
					appearance="wrapped"
					className="wrapped-stat-card wrapped-stat-card--wide"
					label="Дзён у гульні"
					value={summary.activeDays.length}
					caption={across ? `розных дзён ${across}` : undefined}
					prominent
				/>
				<StatCard
					appearance="wrapped"
					className="wrapped-stat-card"
					label="Найдаўжэйшая серыя"
					value={`${streak} ${pluralize(streak, "дзень")}`}
					caption="без пропускаў"
				/>
				{topGame && (
					<StatCard
						appearance="wrapped"
						className="wrapped-stat-card"
						label="Гульня года"
						value={gameName(topGame.gameId)}
						caption={`${topGame.daysPlayed.length} ${pluralize(topGame.daysPlayed.length, "дзень")}`}
					/>
				)}
				{summary.busiestMonth && (
					<StatCard
						appearance="wrapped"
						className="wrapped-stat-card wrapped-stat-card--wide"
						label="Самы актыўны месяц"
						value={MONTHS_NOM[summary.busiestMonth.month - 1]}
						caption={`${summary.busiestMonth.days} ${pluralize(summary.busiestMonth.days, "дзень")} з гульнямі`}
					/>
				)}
			</div>
		</SlideFrame>
	);
}
