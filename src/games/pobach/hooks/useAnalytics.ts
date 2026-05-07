"use client";

import { useCallback, useMemo, useRef } from "react";
import { AnalyticsService } from "@/games/pobach/infrastructure/analytics/AnalyticsService";

export function useAnalytics(sessionId: string, dayIndex: number | null) {
	const analyticsRef = useRef<AnalyticsService | null>(null);

	const analytics = useMemo(() => {
		if (!sessionId) return null;

		if (!analyticsRef.current || analyticsRef.current.sessionId !== sessionId) {
			analyticsRef.current = new AnalyticsService(sessionId);
		}
		if (dayIndex !== null) {
			analyticsRef.current.setDayIndex(dayIndex);
		}
		return analyticsRef.current;
	}, [sessionId, dayIndex]);

	const trackGameStart = useCallback(() => {
		analytics?.trackGameStart();
	}, [analytics]);

	const trackGuess = useCallback(
		(word: string, rank: number, similarity: number) => {
			analytics?.trackGuess(word, rank, similarity);
		},
		[analytics]
	);

	const trackUnknownWord = useCallback(
		(word: string) => {
			analytics?.trackUnknownWord(word);
		},
		[analytics]
	);

	const trackHint = useCallback(
		(word: string, rank: number) => {
			analytics?.trackHint(word, rank);
		},
		[analytics]
	);

	const trackWin = useCallback(
		(attempts: number) => {
			analytics?.trackWin(attempts);
		},
		[analytics]
	);

	const trackGiveUp = useCallback(
		(attempts: number, bestRank: number) => {
			analytics?.trackGiveUp(attempts, bestRank);
		},
		[analytics]
	);

	return {
		trackGameStart,
		trackGuess,
		trackUnknownWord,
		trackHint,
		trackWin,
		trackGiveUp,
	};
}
