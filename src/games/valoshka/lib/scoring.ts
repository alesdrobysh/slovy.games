import type { Rank } from "@/games/valoshka/types";

export const RANKS: Rank[] = [
	{ name: "Пачатковец", threshold: 0 },
	{ name: "Аматар", threshold: 5 },
	{ name: "Кемлівец", threshold: 12 },
	{ name: "Знаўца", threshold: 25 },
	{ name: "Разумнік", threshold: 40 },
	{ name: "Майстар", threshold: 55 },
	{ name: "Эрудыт", threshold: 70 },
	{ name: "Светач", threshold: 85 },
	{ name: "Васілёк", threshold: 100 },
];

export function scoreWord(word: string, pangrams: string[]): number {
	const len = word.length;
	if (len < 4) return 0;
	const base = len === 4 ? 1 : len;
	const bonus = pangrams.includes(word) ? 7 : 0;
	return base + bonus;
}

export function getRank(score: number, maxScore: number): Rank {
	const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
	let current = RANKS[0];
	for (const rank of RANKS) {
		if (pct >= rank.threshold) current = rank;
	}
	return current;
}

export function getRankIndex(score: number, maxScore: number): number {
	const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
	let idx = 0;
	for (let i = 0; i < RANKS.length; i++) {
		if (pct >= RANKS[i].threshold) idx = i;
	}
	return idx;
}
