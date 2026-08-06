export interface ApiResult<T> {
	ok: boolean;
	data: T;
}

async function getJson<T>(url: string): Promise<ApiResult<T>> {
	const res = await fetch(url);
	const data = await res.json();
	return { ok: res.ok, data };
}

async function postJson<T>(url: string, body: unknown): Promise<ApiResult<T>> {
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	const data = await res.json();
	return { ok: res.ok, data };
}

export interface GuessData {
	word: string;
	rank: number;
	dayIndex: number;
	similarity?: number;
	isUnknown?: boolean;
	error?: string;
}

export function fetchGuess(
	word: string,
	dayIndex: number | null
): Promise<ApiResult<GuessData>> {
	const params = new URLSearchParams({ word, dayIndex: String(dayIndex) });
	return getJson<GuessData>(`/api/pobach/guess?${params}`);
}

export interface HintData {
	word: string;
	rank: number;
	dayIndex: number;
	error?: string;
}

export function fetchHint(params: {
	bestRank: number;
	usedRanks: number[];
	sessionId: string;
	dayIndex: number | null;
}): Promise<ApiResult<HintData>> {
	return postJson<HintData>("/api/pobach/hint", params);
}

export interface TargetWordData {
	targetWord: string;
	dayIndex: number;
	error?: string;
}

export function fetchTargetWord(
	dayIndex: number | null
): Promise<ApiResult<TargetWordData>> {
	return postJson<TargetWordData>("/api/pobach/target-word", { dayIndex });
}
