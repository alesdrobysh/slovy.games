"use client";

import { Sparkles } from "lucide-react";
import { getRank, getRankIndex } from "@/games/valoshka/lib/scoring";
import { NextGameCountdown } from "@/shared/components/NextGameCountdown";
import { TryOtherGamesLink } from "@/shared/components/TryOtherGamesLink";
import { Typography } from "@/shared/components/ui/Typography";
import { getMskDateString } from "@/shared/lib/timezone";
import { ShareButton } from "./ShareButton";

interface VasiliokCardProps {
	date: string;
	score: number;
	maxScore: number;
}

export function VasiliokCard({ date, score, maxScore }: VasiliokCardProps) {
	const isNewDayAvailable = getMskDateString() !== date;
	const rank = getRank(score, maxScore);
	const rankIdx = getRankIndex(score, maxScore);

	return (
		<div className="rounded-2xl p-inset-xl sm:p-inset-2xl ring-1 my-6 animate-fade-in-up bg-valoshka-soft ring-valoshka/30">
			<Typography
				variant="title"
				as="h2"
				style={{
					marginBottom: "var(--space-flow-lg)",
					display: "flex",
					alignItems: "center",
					gap: "var(--space-flow-sm)",
				}}
			>
				Васілёк <Sparkles size={28} style={{ color: "var(--valoshka)" }} />
			</Typography>
			<Typography variant="body">
				Вы дасягнулі найвышэйшага рангу! Цудоўная гульня. Да новых сустрэч з
				родным словам.
			</Typography>
			<Typography
				variant="body"
				style={{
					marginTop: "var(--space-flow-md)",
					fontStyle: "italic",
				}}
			>
				«Я ж кажу вам: добра быць коласам; але шчаслівы той, каму дадзена быць
				васільком. Бо нашто каласы, калі няма васількоў?»
				<br />— Максім Багдановіч, «Апокрыф»
			</Typography>
			<div className="mt-inset-lg">
				<ShareButton
					date={date}
					rankName={rank.name}
					rankIdx={rankIdx}
					score={score}
				/>
			</div>
			<NextGameCountdown
				isNewDayAvailable={isNewDayAvailable}
				newGameLabel="Даступна новая галаваломка!"
			/>
			<div className="mt-inset-lg">
				<TryOtherGamesLink className="text-valoshka" fromGame="valoshka" />
			</div>
		</div>
	);
}
