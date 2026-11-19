import posthog from "posthog-js";
import {
	isChunkLoadError,
	reloadOnceForChunkError,
	trackChunkReloadRecovery,
} from "./chunkReload";

jest.mock("posthog-js", () => ({ capture: jest.fn() }));

function chunkError() {
	const error = new Error("Failed to load chunk /_next/static/chunks/a.js");
	error.name = "ChunkLoadError";
	return error;
}

beforeEach(() => {
	jest.clearAllMocks();
	sessionStorage.clear();
});

describe("isChunkLoadError", () => {
	it("matches chunk load failures by name or message", () => {
		expect(isChunkLoadError(chunkError())).toBe(true);
		expect(isChunkLoadError(new Error("Loading chunk 123 failed."))).toBe(true);
		expect(isChunkLoadError(new Error("boom"))).toBe(false);
	});
});

describe("reloadOnceForChunkError", () => {
	it("reloads once per session for chunk load errors", () => {
		expect(reloadOnceForChunkError(chunkError())).toBe(true);
		expect(reloadOnceForChunkError(chunkError())).toBe(false);
	});

	it("does not reload for other errors", () => {
		expect(reloadOnceForChunkError(new Error("boom"))).toBe(false);
		expect(sessionStorage.length).toBe(0);
	});
});

describe("trackChunkReloadRecovery", () => {
	it("captures recovery once after a reload", () => {
		reloadOnceForChunkError(chunkError());
		trackChunkReloadRecovery();
		trackChunkReloadRecovery();
		expect(posthog.capture).toHaveBeenCalledTimes(1);
		expect(posthog.capture).toHaveBeenCalledWith("chunk_load_error_recovered");
		expect(reloadOnceForChunkError(chunkError())).toBe(false);
	});

	it("captures nothing without a reload", () => {
		trackChunkReloadRecovery();
		expect(posthog.capture).not.toHaveBeenCalled();
	});
});
