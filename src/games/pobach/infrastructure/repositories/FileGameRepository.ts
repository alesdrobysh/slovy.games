import fs from "node:fs/promises";
import path from "node:path";
import type { IGameRepository } from "../../core/interfaces/IGameRepository";

/**
 * Filesystem implementation of the game repository.
 * Handles loading game data from JSON and binary files using Node.js fs/promises.
 */
export class FileGameRepository implements IGameRepository {
  constructor(private dataDir: string) {}

  /**
   * Load all game data from the filesystem.
   * Handles path resolution for both local development and production environments.
   */
  public async loadGameData(): Promise<{
    words: string[];
    targets: string[];
    vectors: Int8Array;
    wordToIndex: Map<string, number>;
    history: Record<string, string>;
    pool: string[];
  }> {
    try {
      const resolvedDataDir = await this.resolveDataDirectory();

      // Load JSON files
      const [wordsJson, targetsJson] = await Promise.all([
        fs.readFile(path.join(resolvedDataDir, "words.json"), "utf-8"),
        fs.readFile(path.join(resolvedDataDir, "targets.json"), "utf-8"),
      ]);

      const wordsData = JSON.parse(wordsJson);
      const words: string[] = wordsData.words || wordsData; // Support both {words: [...]} and [...]
      const targetsData = JSON.parse(targetsJson);

      // Expect unified format: {history: {...}, pool: [...]}
      const history: Record<string, string> = targetsData.history || {};
      const pool: string[] = targetsData.pool || [];

      // targets becomes pool for backward compatibility with existing code
      const targets = pool;

      // Load binary vectors
      const vectorsBuffer = await fs.readFile(
        path.join(resolvedDataDir, "vectors.bin"),
      );
      const vectors = new Int8Array(vectorsBuffer);

      // Build word-to-index map for fast lookups
      const wordToIndex = new Map<string, number>();
      for (let index = 0; index < words.length; index++) {
        wordToIndex.set(words[index].toLowerCase(), index);
      }

      console.log(
        `✅ Loaded ${words.length} words, ${targets.length} targets, ${pool.length} pool words from ${resolvedDataDir}.`,
      );

      return { words, targets, vectors, wordToIndex, history, pool };
    } catch (error) {
      console.error("❌ Failed to load game data:", error);
      throw new Error(`Failed to load game data: ${error}`);
    }
  }

  /**
   * Resolve the correct data directory path.
   * Handles differences between local development and production environments.
   */
  private async resolveDataDirectory(): Promise<string> {
    const dataDir = this.dataDir;

    // Check if the primary data directory exists
    try {
      await fs.access(dataDir);
      return dataDir;
    } catch {
      // Try alternative paths for local development
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
        `Data directory not found. Tried: ${[dataDir, ...alternatives].join(", ")}`,
      );
    }
  }
}
