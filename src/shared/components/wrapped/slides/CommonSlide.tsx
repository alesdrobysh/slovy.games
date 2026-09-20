import { StatCard } from "@/shared/components/ui/StatCard";
import { Typography } from "@/shared/components/ui/Typography";
import { pluralize } from "@/shared/lib/pluralize";
import type { WrappedSummary } from "@/shared/types/wrapped";
import { SlideFrame } from "./SlideFrame";

const MONTHS_NOM = [
	"Студзень",
	"Люты",
	"Сакавік",
	"Красавік",
	"Травень",
	"Чэрвень",
	"Ліпень",
	"Жнівень",
	"Верасень",
	"Кастрычнік",
	"Лістапад",
	"Снежань",
];

const GAME_NAMES: Record<string, string> = {
	pobach: "Побач",
	valoshka: "Валошка",
};

export interface CommonSlideProps {
	summary: WrappedSummary;
}

export function CommonSlide({ summary }: CommonSlideProps) {
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
					className="wrapped-stat-card"
					label="Дзён у гульні"
					value={summary.activeDays.length}
				/>
				<StatCard
					appearance="wrapped"
					className="wrapped-stat-card"
					label="Гульняў скончана"
					value={summary.gamesFinished}
				/>
				<StatCard
					appearance="wrapped"
					className="wrapped-stat-card"
					label="Найдаўжэйшая серыя"
					value={`${summary.longestStreakAnyGame} ${pluralize(summary.longestStreakAnyGame, "дзень")}`}
				/>
				{summary.busiestMonth && (
					<StatCard
						appearance="wrapped"
						className="wrapped-stat-card"
						label="Самы актыўны месяц"
						value={MONTHS_NOM[summary.busiestMonth.month - 1]}
					/>
				)}
				{summary.gameOfTheYear && (
					<StatCard
						appearance="wrapped"
						className="wrapped-stat-card"
						label="Гульня года"
						value={GAME_NAMES[summary.gameOfTheYear] ?? summary.gameOfTheYear}
					/>
				)}
			</div>
		</SlideFrame>
	);
}
