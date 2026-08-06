import fs from "node:fs/promises";
import path from "node:path";

export interface GameData {
	words: string[];
	targets: string[];
	vectors: Int8Array;
	wordToIndex: Map<string, number>;
	history: Record<string, string>;
	pool: string[];
}

async function resolveDataDirectory(dataDir: string): Promise<string> {
	try {
		await fs.access(dataDir);
		return dataDir;
	} catch {
		const alternatives = [
			path.join(process.cwd(), "src", "data"),
			path.join(process.cwd(), "data"),
		];

		for (const altPath of alternatives) {
			try {
				await fs.access(altPath);
				console.log(`Using alternative data directory: ${altPath}`);
				return altPath;
			} catch {
				// Continue to next alternative
			}
		}

		throw new Error(
			`Data directory not found. Tried: ${[dataDir, ...alternatives].join(", ")}`
		);
	}
}

/**
 * Load words vocabulary, target words, word embeddings, and combined word pool
 * from the filesystem. Handles path resolution for both local development and
 * production environments.
 */
export async function loadGameData(dataDir: string): Promise<GameData> {
	try {
		const resolvedDataDir = await resolveDataDirectory(dataDir);

		const [wordsJson, targetsJson] = await Promise.all([
			fs.readFile(path.join(resolvedDataDir, "words.json"), "utf-8"),
			fs.readFile(path.join(resolvedDataDir, "targets.json"), "utf-8"),
		]);

		const wordsData = JSON.parse(wordsJson);
		const words: string[] = wordsData.words || wordsData; // Support both {words: [...]} and [...]
		const targetsData = JSON.parse(targetsJson);

		// Validate targets.json format — must be an object with history + pool, not a plain array
		if (Array.isArray(targetsData)) {
			throw new Error(
				"targets.json has invalid format: got an array, expected {history: {...}, pool: [...]}. " +
					"Restore it with: git checkout HEAD -- src/data/targets.json"
			);
		}

		// Expect unified format: {history: {...}, pool: [...]}
		const history: Record<string, string> = targetsData.history || {};
		const pool: string[] = targetsData.pool || [];

		if (!Array.isArray(pool) || pool.length === 0) {
			throw new Error(
				"targets.json is missing the 'pool' field or pool is empty. " +
					"Expected format: {history: {...}, pool: [...]} with a non-empty pool array."
			);
		}

		// targets becomes pool for backward compatibility with existing code
		const targets = pool;

		const vectorsBuffer = await fs.readFile(
			path.join(resolvedDataDir, "vectors.bin")
		);
		const vectors = new Int8Array(vectorsBuffer);

		const wordToIndex = new Map<string, number>();
		for (let index = 0; index < words.length; index++) {
			wordToIndex.set(words[index].toLowerCase(), index);
		}

		console.log(
			`✅ Loaded ${words.length} words, ${targets.length} targets, ${pool.length} pool words from ${resolvedDataDir}.`
		);

		return { words, targets, vectors, wordToIndex, history, pool };
	} catch (error) {
		console.error("❌ Failed to load game data:", error);
		throw new Error(`Failed to load game data: ${error}`);
	}
}
