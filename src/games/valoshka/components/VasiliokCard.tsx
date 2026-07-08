"use client";

import { Sparkles } from "lucide-react";
import { NextGameCountdown } from "@/shared/components/NextGameCountdown";
import { TryOtherGamesLink } from "@/shared/components/TryOtherGamesLink";
import { Typography } from "@/shared/components/ui/Typography";
import { getMskDateString } from "@/shared/lib/timezone";

interface VasiliokCardProps {
	date: string;
}

export function VasiliokCard({ date }: VasiliokCardProps) {
	const isNewDayAvailable = getMskDateString() !== date;

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
