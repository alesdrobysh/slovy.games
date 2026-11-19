import posthog from "posthog-js";

const RELOAD_KEY = "chunk_load_reload";
const PENDING = "pending";
const DONE = "done";

export function isChunkLoadError(error: Error): boolean {
	return (
		error.name === "ChunkLoadError" ||
		/Loading chunk .+ failed|Failed to load chunk/.test(error.message)
	);
}

/** Reload at most once per tab session, so a persistent failure cannot loop.
 * Returns false when the page shows the error UI instead. */
export function reloadOnceForChunkError(error: Error): boolean {
	if (!isChunkLoadError(error)) return false;
	try {
		if (sessionStorage.getItem(RELOAD_KEY)) return false;
		sessionStorage.setItem(RELOAD_KEY, PENDING);
	} catch {
		return false;
	}
	window.location.reload();
	return true;
}

/** Call after PostHog initializes, to count reloads that rendered the app again. */
export function trackChunkReloadRecovery(): void {
	try {
		if (sessionStorage.getItem(RELOAD_KEY) !== PENDING) return;
		sessionStorage.setItem(RELOAD_KEY, DONE);
	} catch {
		return;
	}
	posthog.capture("chunk_load_error_recovered");
}
