// ponytail: posthog-js may not be loaded (no consent / missing key);
// all calls are guarded — safe no-op when unavailable.

let _posthog: typeof import("posthog-js").default | null = null;

function getPostHog() {
	if (_posthog !== null) return _posthog;
	try {
		// Dynamic import to avoid breaking SSR / missing-dep builds
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const m = require("posthog-js");
		_posthog = m.default ?? m;
	} catch {
		_posthog = undefined as unknown as null;
	}
	return _posthog;
}

function capture(event: string, props?: Record<string, unknown>) {
	const ph = getPostHog();
	if (!ph || !(ph as { __loaded?: boolean }).__loaded) return;
	try {
		ph.capture(event, props);
	} catch {
		// silently ignore
	}
}

export function trackValoshkaGameStarted(date: string) {
	capture("valoshka_game_started", { date });
}

export function trackValoshkaWordFound(word: string, isPangram: boolean, score: number, date: string) {
	capture("valoshka_word_found", { word, isPangram, score, date });
}

export function trackValoshkaHintUsed(date: string) {
	capture("valoshka_hint_used", { date });
}

export function trackValoshkaVasiliokReached(totalWords: number, score: number, date: string) {
	capture("valoshka_vasiliok_reached", { totalWords, score, date });
}

export function trackValoshkaRankUp(
	fromRank: string,
	toRank: string,
	wordsFound: number,
	score: number,
	date: string
) {
	capture("valoshka_rank_up", { fromRank, toRank, wordsFound, score, date });
}
