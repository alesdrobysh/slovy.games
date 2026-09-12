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
		<SlideFrame>
			<Typography variant="title" as="h2">
				Разам за год
			</Typography>
			<div className="grid w-full max-w-md grid-cols-2 gap-flow-md">
				<StatCard label="Дзён у гульні" value={summary.activeDays.length} />
				<StatCard label="Гульняў скончана" value={summary.gamesFinished} />
				<StatCard
					label="Найдаўжэйшая серыя"
					value={`${summary.longestStreakAnyGame} ${pluralize(summary.longestStreakAnyGame, "дзень")}`}
				/>
				{summary.busiestMonth && (
					<StatCard
						label="Самы актыўны месяц"
						value={MONTHS_NOM[summary.busiestMonth.month - 1]}
					/>
				)}
				{summary.gameOfTheYear && (
					<StatCard
						label="Гульня года"
						value={GAME_NAMES[summary.gameOfTheYear] ?? summary.gameOfTheYear}
					/>
				)}
			</div>
		</SlideFrame>
	);
}
