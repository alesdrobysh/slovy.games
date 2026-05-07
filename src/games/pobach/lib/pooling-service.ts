export interface PoolData {
  history: Record<string, string>;
  pool: string[];
}

export interface RotationResult {
  word: string;
  source: "history" | "pool";
  isFromHistory: boolean;
}

export class PoolingService {
  private poolData: PoolData;

  constructor(poolData: PoolData) {
    // Validate basic types before processing
    if (Array.isArray(poolData.pool) && typeof poolData.history === "object") {
      // Check for words that exist in both history and pool
      const historyWords = new Set(Object.values(poolData.history));
      const duplicates = poolData.pool.filter((word) => historyWords.has(word));

      if (duplicates.length > 0) {
        console.warn(
          `⚠️ Found ${duplicates.length} word(s) in both history and pool. Removing from pool: ${duplicates.join(", ")}`,
        );

        // Remove history words from pool
        poolData.pool = poolData.pool.filter((word) => !historyWords.has(word));
      }
    }

    this.poolData = poolData;
  }

  getWordForDay(dayIndex: number, lcgIndex: number): RotationResult {
    const dayKey = dayIndex.toString();

    if (this.poolData.history[dayKey]) {
      return {
        word: this.poolData.history[dayKey],
        source: "history",
        isFromHistory: true,
      };
    }

    if (this.poolData.pool.length === 0) {
      throw new Error("No words available in active pool");
    }

    const poolIndex = lcgIndex % this.poolData.pool.length;
    const selectedWord = this.poolData.pool[poolIndex];

    return {
      word: selectedWord,
      source: "pool",
      isFromHistory: false,
    };
  }

  getPoolState(): PoolData {
    return {
      history: { ...this.poolData.history },
      pool: [...this.poolData.pool],
    };
  }

  isWordInPool(word: string): boolean {
    return this.poolData.pool.includes(word);
  }

  getRemainingPoolCount(): number {
    return this.poolData.pool.length;
  }

  getHistoryCount(): number {
    return Object.keys(this.poolData.history).length;
  }

  isInHistory(dayIndex: number): boolean {
    return dayIndex.toString() in this.poolData.history;
  }
}
