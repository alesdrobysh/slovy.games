import { Typography } from "@/shared/components/ui/Typography";
import { pluralize } from "@/shared/lib/pluralize";
import { MONTHS_LOC, MONTHS_NOM } from "@/shared/lib/wrapped/format";
import type { WrappedSummary } from "@/shared/types/wrapped";
import { SlideFrame } from "./SlideFrame";

/** Games-per-day shades, lightest to darkest. Three games is the most a
 *  day can hold, so the scale tops out there. */
const LEVELS = [0, 1, 2, 3] as const;

interface MonthCells {
	month: number;
	/** Blank cells before the 1st, so weeks start on Monday. */
	offset: number;
	levels: number[];
}

export function calendarMonths(
	year: number,
	gamesPerDay: Record<string, number>
): MonthCells[] {
	return MONTHS_NOM.map((_, m) => {
		const first = new Date(Date.UTC(year, m, 1));
		const days = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
		const mm = String(m + 1).padStart(2, "0");
		return {
			month: m + 1,
			offset: (first.getUTCDay() + 6) % 7,
			levels: Array.from({ length: days }, (_, d) => {
				const count =
					gamesPerDay[`${year}-${mm}-${String(d + 1).padStart(2, "0")}`];
				return Math.min(count ?? 0, LEVELS.length - 1);
			}),
		};
	});
}

export interface CalendarSlideProps {
	summary: WrappedSummary;
}

export function CalendarSlide({ summary }: CalendarSlideProps) {
	const months = calendarMonths(summary.year, summary.gamesPerDay);
	const active = summary.activeDays.length;
	const top = summary.busiestMonth?.month;
	const label = [
		`Каляндар гульняў за ${summary.year} год: ${active} ${pluralize(active, "дзень")} з гульнямі`,
		top ? `найбольш у ${MONTHS_LOC[top - 1]}` : null,
	]
		.filter(Boolean)
		.join(", ");

	return (
		<SlideFrame variant="calendar">
			<div className="wrapped-calendar-year" aria-hidden="true">
				{summary.year}
			</div>
			<div className="wrapped-slide-title wrapped-reveal">
				<Typography variant="displayHeading">Каляндар года</Typography>
			</div>
			<div
				role="img"
				aria-label={label}
				className="wrapped-calendar wrapped-reveal wrapped-reveal--late"
			>
				{months.map(({ month, offset, levels }) => (
					<div key={month} className="wrapped-calendar-month">
						<span
							className="wrapped-calendar-name"
							data-top={month === top ? "true" : undefined}
						>
							<Typography variant="overline">
								{MONTHS_NOM[month - 1]}
							</Typography>
						</span>
						<div className="wrapped-calendar-days">
							{Array.from({ length: offset }, (_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: blanks are interchangeable
								<span key={`blank-${i}`} />
							))}
							{levels.map((level, d) => (
								<span
									// biome-ignore lint/suspicious/noArrayIndexKey: one cell per day of the month
									key={d}
									className="wrapped-calendar-cell"
									data-level={level}
								/>
							))}
						</div>
					</div>
				))}
			</div>
			<div className="wrapped-calendar-legend wrapped-reveal wrapped-reveal--late">
				<Typography variant="label">Гульняў за дзень:</Typography>
				{LEVELS.map((level) => (
					<span key={level} className="wrapped-calendar-legend-item">
						<span className="wrapped-calendar-cell" data-level={level} />
						<Typography variant="label">{level}</Typography>
					</span>
				))}
			</div>
		</SlideFrame>
	);
}
