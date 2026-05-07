import { EPOCH_DATE } from "../../lib/config";
import { findOptimalLCGParams, type LCGParams } from "../../lib/lcg-optimizer";
import { lemmatize } from "../../lib/lemmatizer";
import { type PoolData, PoolingService } from "../../lib/pooling-service";
import type { GameState, GuessResult, TopWord } from "../entities/game";
import type { IGameRepository } from "../interfaces/IGameRepository";

/**
 * Core game service containing all business logic.
 * Uses dependency injection to receive data access capabilities.
 */
export class GameService {
  private words: string[] = [];
  private targets: string[] = [];
  private vectors: Int8Array | null = null;
  private norms: Float32Array = new Float32Array(0);
  private wordToIndex: Map<string, number> = new Map();
  private isInitialized = false;

  // Cache for daily rankings: dayIndex -> Sorted list of word indices
  private dailyRankingsCache: Map<number, Int32Array> = new Map();

  // Optimized LCG parameters for anti-spoiler word rotation
  private lcgParams?: LCGParams;

  private poolingService?: PoolingService;

  constructor(private repository: IGameRepository) {}

  /**
   * Initialize the service by loading game data from the repository.
   * Must be called before using any other methods.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const data = await this.repository.loadGameData();
      this.words = data.words;
      this.targets = data.targets;
      this.vectors = data.vectors;
      this.wordToIndex = data.wordToIndex;

      const poolData: PoolData = {
        history: data.history,
        pool: data.pool,
      };

      this.poolingService = new PoolingService(poolData);

      // Pre-compute L2 norms for cosine similarity ranking
      const vecSize = 384;
      const numWords = this.words.length;
      this.norms = new Float32Array(numWords);
      for (let i = 0; i < numWords; i++) {
        let sumSq = 0;
        const offset = i * vecSize;
        for (let j = 0; j < vecSize; j++) {
          const v = this.vectors?.[offset + j];
          sumSq += v * v;
        }
        this.norms[i] = Math.sqrt(sumSq);
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("❌ Failed to initialize GameService:", error);
      throw error;
    }
  }

  /**
   * Ensure the service is initialized before proceeding with operations.
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error(
        "GameService must be initialized before use. Call initialize() first.",
      );
    }
  }

  /**
   * Get target word for a specific day index.
   * Uses history if available, otherwise calculates from pool using LCG.
   * This is the single source of truth for word selection.
   */
  private getWordForDayIndex(dayIndex: number): string {
    if (!this.poolingService) {
      throw new Error("PoolingService not initialized");
    }

    // Check if day is in history first (avoids LCG calculation for historical days)
    if (this.poolingService.isInHistory(dayIndex)) {
      const rotationResult = this.poolingService.getWordForDay(dayIndex, 0);
      return rotationResult.word;
    }

    // Handle edge case: pool has 0 or 1 words (no LCG needed)
    const poolSize = this.poolingService.getRemainingPoolCount();
    if (poolSize <= 1) {
      const rotationResult = this.poolingService.getWordForDay(dayIndex, 0);
      return rotationResult.word;
    }

    // Calculate LCG index for anti-spoiler word rotation from pool
    const params = this.getOptimizedLCGParams();
    const { A, B, N } = params;
    const lcgIndex = (((A * dayIndex + B) % N) + N) % N;

    const rotationResult = this.poolingService.getWordForDay(
      dayIndex,
      lcgIndex,
    );
    return rotationResult.word;
  }

  public getDailySecret(): GameState {
    this.ensureInitialized();
    const dayIndex = this.calculateDayIndex();
    const secretWord = this.getWordForDayIndex(dayIndex);

    return {
      dayIndex,
      secretWord,
    };
  }

  /**
   * Calculate day index from epoch date.
   * Used by both getDailySecret and other methods that need consistent day calculation.
   */
  private calculateDayIndex(): number {
    const epoch = new Date(EPOCH_DATE);
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((now.getTime() - epoch.getTime()) / msPerDay);
  }

  /**
   * Get target word for a specific day index.
   * Public API that delegates to the shared implementation.
   */
  public getTargetWord(dayIndex: number): string {
    this.ensureInitialized();
    return this.getWordForDayIndex(dayIndex);
  }

  /**
   * Get optimized LCG parameters for the current active pool.
   * Uses Hull-Dobell theorem compliant parameters for maximum anti-spoiler protection.
   * Note: Uses activePool.length, not targets.length, for future word rotation.
   */
  private getOptimizedLCGParams(): LCGParams {
    if (!this.lcgParams) {
      if (!this.poolingService) {
        throw new Error("PoolingService not initialized");
      }
      const N = this.poolingService.getRemainingPoolCount();
      this.lcgParams = findOptimalLCGParams(N);

      console.debug("LCG optimization completed for active pool:", {
        poolSize: N,
        params: this.lcgParams,
      });
    }

    return this.lcgParams;
  }

  // Pre-calculate rank for the secret word against ALL words
  // This is expensive (~10-20ms), so we cache it for the day
  private getDailyRankings(dayIndex: number, secretWord: string): Int32Array {
    const cached = this.dailyRankingsCache.get(dayIndex);
    if (cached) {
      return cached;
    }

    // 1. Get Secret Vector
    const cleanSecret = this.normalizeWord(secretWord);
    const secretIdx = this.wordToIndex.get(cleanSecret);

    if (secretIdx === undefined) {
      console.error(
        `Secret word '${secretWord}' (normalized: '${cleanSecret}') not found in dictionary!`,
      );
      // Fallback: return empty or throw better error
      throw new Error(`Secret word '${secretWord}' not found in dictionary!`);
    }

    const vecSize = 384;
    const secretVec = this.vectors?.subarray(
      secretIdx * vecSize,
      (secretIdx + 1) * vecSize,
    );

    // 2. Calculate Dot Product with ALL words
    const numWords = this.words.length;
    const scores = new Float32Array(numWords); // Use float for scores

    // Optimization: Loop unrolling or simple iteration
    // 50,000 words * 128 ops = 6.4M ops. fast enough (V8 is smart).

    for (let i = 0; i < numWords; i++) {
      let dot = 0;
      const offset = i * vecSize;
      // Manual unrolling is rarely needed in V8, simple loop is fine
      for (let j = 0; j < vecSize; j++) {
        const vec = this.vectors?.[offset + j] || 0;
        const secret = secretVec?.[j] || 0;

        dot += vec * secret;
      }
      scores[i] = this.norms[i] > 0 ? dot / this.norms[i] : 0;
    }

    // 3. Sort indices by score (descending)
    // We create an array of indices [0, 1, 2...] and sort it based on scores
    const indices = new Int32Array(numWords);
    for (let i = 0; i < numWords; i++) indices[i] = i;

    indices.sort((a, b) => scores[b] - scores[a]);

    // Cache it
    this.dailyRankingsCache.set(dayIndex, indices);

    // Clear old cache to save memory (keep only today)
    if (this.dailyRankingsCache.size > 2) {
      const keys = Array.from(this.dailyRankingsCache.keys());
      for (const k of keys.filter((k) => k !== dayIndex)) {
        this.dailyRankingsCache.delete(k);
      }
    }

    return indices;
  }

  private normalizeWord(word: string): string {
    return word
      .trim()
      .toLowerCase()
      .replace(/'/g, "'")
      .replace(/ʼ/g, "'")
      .replace(/`/g, "'");
  }

  public makeGuess(word: string, dayIndex?: number): GuessResult {
    this.ensureInitialized();
    const normalized = this.normalizeWord(word);
    const lemmatized = lemmatize(normalized);

    // Use provided dayIndex or fallback to current day
    const dayIndexParam = dayIndex ?? this.getDailySecret().dayIndex;

    // Try normalized first, fall back to lemmatized (single lookup each)
    const normalizedIdx = this.wordToIndex.get(normalized);
    const guess = normalizedIdx !== undefined ? normalized : lemmatized;
    const userWordIdx = normalizedIdx ?? this.wordToIndex.get(lemmatized);

    if (userWordIdx === undefined) {
      return { word: guess, rank: -1, similarity: 0, isUnknown: true };
    }

    const secretWord = this.getTargetWord(dayIndexParam);

    // If guessed correctly
    if (normalized === secretWord || lemmatized === secretWord) {
      return { word: secretWord, rank: 1, similarity: 1.0, isUnknown: false };
    }

    // Get Rankings
    const rankings = this.getDailyRankings(dayIndexParam, secretWord);

    // indexOf is O(N), but on Int32Array it's fast.
    // Optimization: We could build a reverse map (WordIdx -> Rank), but that uses RAM.
    // Searching 50k ints is very fast.
    const rankIndex = rankings.indexOf(userWordIdx);

    // Rank is index + 1
    return {
      word: guess,
      rank: rankIndex + 1,
      similarity: 0,
      isUnknown: false,
    };
  }

  public getWordByRank(rank: number, dayIndex?: number): string {
    this.ensureInitialized();
    // Use provided dayIndex or fallback to current day
    const dayIndexParam = dayIndex ?? this.getDailySecret().dayIndex;
    const secretWord = this.getTargetWord(dayIndexParam);
    const rankings = this.getDailyRankings(dayIndexParam, secretWord);

    // rank 1 is index 0, ensure we don't go out of bounds
    const safeIndex = Math.max(0, Math.min(rank - 1, rankings.length - 1));
    const wordIdx = rankings[safeIndex];
    return this.words[wordIdx];
  }

  public getTopWords(dayIndex: number, count: number = 100): TopWord[] {
    this.ensureInitialized();
    const secretWord = this.getTargetWord(dayIndex);
    const rankings = this.getDailyRankings(dayIndex, secretWord);

    const result: TopWord[] = [];
    for (let i = 0; i < rankings.length && result.length < count; i++) {
      result.push({ rank: i + 1, word: this.words[rankings[i]] });
    }

    return result;
  }
}
