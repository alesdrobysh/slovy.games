import { StatCard } from "@/shared/components/ui/StatCard";
import { Typography } from "@/shared/components/ui/Typography";
import { useCountUp } from "@/shared/components/wrapped/useCountUp";
import { gameName } from "@/shared/lib/wrapped/format";
import type { GameYearStats } from "@/shared/types/wrapped";
import { SlideFrame } from "./SlideFrame";

export interface GameSlideProps {
	stats: GameYearStats;
	page: 1 | 2;
}

/** The leading highlights get full-width cards; the rest pair up below. */
const WIDE_HIGHLIGHTS = 2;

export function GameSlide({ stats, page }: GameSlideProps) {
	const name = gameName(stats.gameId);
	const accent = `wrapped-game--${stats.gameId}`;
	// Called unconditionally so switching pages does not change hook order.
	const shown = useCountUp(stats.headline.value);

	if (page === 1) {
		return (
			<SlideFrame variant="game" accentClassName={accent}>
				<div className="wrapped-game-word" aria-hidden="true">
					{stats.gameId === "sakretna" ? (
						<>
							{name} <span className="wrapped-redaction" /> {name}{" "}
							<span className="wrapped-redaction" />
						</>
					) : (
						`${name} · ${name} · ${name}`
					)}
				</div>
				<div className="wrapped-game-medallion wrapped-reveal">
					<Typography variant="overline">{name}</Typography>
					<Typography variant="displayHuge">{shown}</Typography>
					<Typography variant="caption">{stats.headline.caption}</Typography>
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
				{stats.highlights.map((h, i) => (
					<StatCard
						appearance="wrapped"
						className={`wrapped-stat-card ${i < WIDE_HIGHLIGHTS ? "wrapped-stat-card--wide" : ""}`}
						key={h.key}
						label={h.label}
						value={h.value}
						caption={h.caption}
						words={h.words}
						prominent={i < WIDE_HIGHLIGHTS}
					/>
				))}
			</div>
		</SlideFrame>
	);
}
