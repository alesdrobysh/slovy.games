/**
 * Build-time validation for game data files.
 * Runs before `next build` to catch malformed data early.
 * Called from the `build` script in package.json.
 */

import { readFileSync, accessSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data");
const GAMES_DIR = join(__dirname, "..", "src", "games");

// ─── Helpers ────────────────────────────────────────────────────────────────

function fail(msg) {
	console.error(`❌ Data validation: ${msg}`);
	process.exit(1);
}

function ok(msg) {
	console.log(`  ✅ ${msg}`);
}

function checkFileExists(name) {
	const path = join(DATA_DIR, name);
	accessSync(path);
	const { size } = statSync(path);
	ok(`${name} exists (${(size / 1024).toFixed(0)} KB)`);
	return path;
}

// ─── Validation ─────────────────────────────────────────────────────────────

console.log("\n🔍 Validating data files...\n");

// 1. Check all required files exist
checkFileExists("words.json");
checkFileExists("targets.json");
checkFileExists("vectors.bin");

// 2. Validate words.json
{
	const wordsRaw = JSON.parse(readFileSync(join(DATA_DIR, "words.json"), "utf-8"));
	const words = Array.isArray(wordsRaw) ? wordsRaw : wordsRaw?.words;

	if (!Array.isArray(words) || words.length === 0) {
		fail(
			`words.json must be an array or an object with a 'words' field. Got: ${typeof words}`
		);
	}
	if (words.length < 1000) {
		fail(`words.json has too few words: ${words.length}. Expected >= 1000.`);
	}
	ok(`words.json — ${words.length.toLocaleString()} words`);
}

// 3. Validate targets.json format
{
	const targetsRaw = readFileSync(join(DATA_DIR, "targets.json"), "utf-8");
	const targetsData = JSON.parse(targetsRaw);

	if (Array.isArray(targetsData)) {
		fail(
			"targets.json — invalid format: got an array, expected {history: {...}, pool: [...]}. " +
			"Restore it: git checkout HEAD -- src/data/targets.json"
		);
	}

	const history = targetsData?.history;
	const pool = targetsData?.pool;

	if (!history || typeof history !== "object" || Array.isArray(history)) {
		fail("targets.json is missing the 'history' field (expected an object with day→word entries)");
	}
	if (!Array.isArray(pool) || pool.length === 0) {
		fail("targets.json is missing the 'pool' field or pool is empty");
	}

	// Check that history words are in the pool
	const historyWords = Object.values(history);
	const uniquePool = new Set(pool);
	const missingFromPool = historyWords.filter((w) => !uniquePool.has(w));
	if (missingFromPool.length > 0) {
		console.warn(
			`  ⚠️  ${missingFromPool.length} history word(s) missing from pool: ${missingFromPool.slice(0, 5).join(", ")}...`
		);
	}

	ok(`targets.json — ${Object.keys(history).length} in history, ${pool.length} in pool`);
}

// 4. Validate vectors.bin size matches word_count × vec_dim
{
	const wordsRaw = JSON.parse(readFileSync(join(DATA_DIR, "words.json"), "utf-8"));
	const words = Array.isArray(wordsRaw) ? wordsRaw : wordsRaw?.words;
	const vecSize = 384; // embedding dimension
	const expectedBytes = words.length * vecSize;
	const actualBytes = statSync(join(DATA_DIR, "vectors.bin")).size;

	if (actualBytes !== expectedBytes) {
		fail(
			`vectors.bin size mismatch: ${actualBytes.toLocaleString()} bytes, ` +
			`expected ${expectedBytes.toLocaleString()} (${words.length} words × ${vecSize} dims)`
		);
	}
	ok(`vectors.bin — size matches ${words.length} × ${vecSize}`);
}

// 5. Validate redaktle articles.json
{
	const articlesPath = join(GAMES_DIR, "redaktle", "data", "articles.json");
	let articlesRaw;
	try {
		articlesRaw = readFileSync(articlesPath, "utf-8");
	} catch {
		fail("redaktle/data/articles.json is missing");
	}

	let articles;
	try {
		articles = JSON.parse(articlesRaw);
	} catch (err) {
		fail(`redaktle/data/articles.json is not valid JSON: ${err.message}`);
	}

	if (!Array.isArray(articles) || articles.length === 0) {
		fail("redaktle/data/articles.json must be a non-empty array");
	}

		const seenIds = new Set();
	const seenTitles = new Set();
	for (const [i, a] of articles.entries()) {
		const where = `articles[${i}]`;
		if (!a || typeof a !== "object") fail(`${where} is not an object`);
		for (const field of ["id", "title", "body", "source", "retrieved"]) {
			if (typeof a[field] !== "string" || a[field].length === 0) {
				fail(`${where}.${field} is missing or empty`);
			}
		}
		if (seenIds.has(a.id)) fail(`${where}.id duplicates: ${a.id}`);
		if (seenTitles.has(a.title)) fail(`${where}.title duplicates: ${a.title}`);
		seenIds.add(a.id);
		seenTitles.add(a.title);

		if (a.body.length < 1000 || a.body.length > 20000) {
			fail(`${where}.body length ${a.body.length} outside 1000..20000`);
		}
		for (const banned of ["[[", "]]", "{{", "}}", "<ref", "</ref>"]) {
			if (a.body.includes(banned)) {
				fail(`${where}.body contains wiki markup: ${banned}`);
			}
		}
		if (!a.source.startsWith("https://be.wikipedia.org/wiki/")) {
			fail(`${where}.source must start with https://be.wikipedia.org/wiki/`);
		}
	}

	ok(`redaktle/articles.json — ${articles.length} articles`);
}

console.log("\n✅ All data checks passed.\n");
