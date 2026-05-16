"use client";

import { useEffect, useState } from "react";
import type {
	GameStats,
	HistoryRecord,
} from "@/games/pobach/core/entities/game";
import { getHistory, getStats } from "@/games/pobach/lib/storage";
import { StatsPageContent } from "@/games/pobach/components/StatsPageContent";

export default function PobachStatsPage() {
	const [stats, setStats] = useState<GameStats | null>(null);
	const [history, setHistory] = useState<HistoryRecord[]>([]);

	useEffect(() => {
		setStats(getStats());
		setHistory(getHistory().slice(0, 10).reverse());
	}, []);

	if (!stats) return null;

	return <StatsPageContent stats={stats} history={history} />;
}
