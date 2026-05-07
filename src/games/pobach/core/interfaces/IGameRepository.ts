/**
 * Repository interface for game data access.
 * Defines what data the business logic needs, not how to get it.
 */
export interface IGameRepository {
  /**
   * Load all game data required for the game engine.
   * This includes words vocabulary, target words, word embeddings, and combined word pool.
   */
  loadGameData(): Promise<{
    words: string[];
    targets: string[];
    vectors: Int8Array;
    wordToIndex: Map<string, number>;
    history: Record<string, string>;
    pool: string[];
  }>;
}
