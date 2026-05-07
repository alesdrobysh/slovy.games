import type { IGameRepository } from "../interfaces/IGameRepository";
import { GameService } from "./GameService";

// Mock repository for testing
class MockGameRepository implements IGameRepository {
  private mockData = {
    words: ["test", "word", "game", "mock"],
    targets: ["test", "word"],
    vectors: new Int8Array([1, 2, 3, 4]),
    wordToIndex: new Map([
      ["test", 0],
      ["word", 1],
      ["game", 2],
      ["mock", 3],
    ]),
    history: {} as Record<string, string>,
    pool: ["test", "word"],
  };

  async loadGameData() {
    return this.mockData;
  }
}

describe("GameService", () => {
  let service: GameService;
  let mockRepo: MockGameRepository;

  beforeEach(async () => {
    mockRepo = new MockGameRepository();
    service = new GameService(mockRepo);
    await service.initialize();
  });

  describe("makeGuess", () => {
    it("should return unknown result for words not in vocabulary", () => {
      const result = service.makeGuess("unknownword");

      expect(result).toEqual({
        word: "unknownword",
        rank: -1,
        similarity: 0,
        isUnknown: true,
      });
    });

    it("should return correct result for known words", () => {
      const result = service.makeGuess("test");

      expect(result.word).toBe("test");
      expect(result.isUnknown).toBe(false);
      expect(typeof result.rank).toBe("number");
    });

    it("should handle word normalization", () => {
      const result = service.makeGuess("  TEST  ");

      expect(result.word).toBe("test");
      expect(result.isUnknown).toBe(false);
    });
  });

  describe("getDailySecret", () => {
    it("should return a game state with day index and secret word", () => {
      const gameState = service.getDailySecret();

      expect(typeof gameState.dayIndex).toBe("number");
      expect(typeof gameState.secretWord).toBe("string");
      expect(gameState.secretWord).toBeDefined();
    });
  });

  describe("getTargetWord", () => {
    it("should return target word for given day index", () => {
      const targetWord = service.getTargetWord(0);

      expect(typeof targetWord).toBe("string");
      expect(targetWord.length).toBeGreaterThan(0);
    });
  });

  describe("getWordByRank", () => {
    it("should return word for given rank", () => {
      const word = service.getWordByRank(1);

      expect(typeof word).toBe("string");
      expect(word.length).toBeGreaterThan(0);
    });

    it("should handle rank bounds safely", () => {
      const word = service.getWordByRank(999);

      expect(typeof word).toBe("string");
    });
  });

  describe("getTopWords", () => {
    it("should return array of top words", () => {
      const topWords = service.getTopWords(0, 5);

      expect(Array.isArray(topWords)).toBe(true);
      expect(topWords.length).toBeLessThanOrEqual(5);

      if (topWords.length > 0) {
        expect(topWords[0]).toHaveProperty("rank");
        expect(topWords[0]).toHaveProperty("word");
        expect(typeof topWords[0].rank).toBe("number");
        expect(typeof topWords[0].word).toBe("string");
      }
    });
  });

  describe("initialization", () => {
    it("should throw error when methods called before initialization", () => {
      const uninitializedService = new GameService(mockRepo);

      expect(() => {
        uninitializedService.getDailySecret();
      }).toThrow("GameService must be initialized before use");
    });
  });
});
