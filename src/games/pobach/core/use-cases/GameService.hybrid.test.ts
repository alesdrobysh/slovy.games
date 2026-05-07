import type { IGameRepository } from "../interfaces/IGameRepository";
import { GameService } from "./GameService";

describe("GameService - Hybrid Word Rotation", () => {
  let mockRepository: jest.Mocked<IGameRepository>;
  let gameService: GameService;
  const RealDate = global.Date;

  beforeEach(() => {
    mockRepository = {
      loadGameData: jest.fn(),
    } as jest.Mocked<IGameRepository>;

    gameService = new GameService(mockRepository);
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  function mockCurrentDate(dateStr: string) {
    const mockNow = new RealDate(dateStr).getTime();
    global.Date = class extends RealDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(mockNow);
        } else {
          // @ts-expect-error
          super(...args);
        }
      }

      static now() {
        return mockNow;
      }
    } as any;
  }

  describe("Hybrid Algorithm", () => {
    const mockWords = ["слова1", "словы2", "словы3", "словы4", "словы5"];
    const mockTargets = ["слова1", "словы2", "словы3"];
    const mockVectors = new Int8Array(5 * 128);
    const mockHistory = {
      "0": "словы1",
      "1": "словы2",
    };

    test("should return historical word for day in history", async () => {
      mockCurrentDate("2026-01-15"); // Day 0

      const wordToIndex = new Map<string, number>();
      mockWords.forEach((word, index) => {
        wordToIndex.set(word.toLowerCase(), index);
      });

      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex,
        history: mockHistory,
        pool: ["словы3"],
      });

      await gameService.initialize();
      const result = gameService.getDailySecret();

      expect(result.dayIndex).toBe(0);
      expect(result.secretWord).toBe("словы1");
    });

    test("should return active pool word for future day", async () => {
      mockCurrentDate("2026-01-17"); // Day 2

      const wordToIndex = new Map<string, number>();
      mockWords.forEach((word, index) => {
        wordToIndex.set(word.toLowerCase(), index);
      });

      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex,
        history: mockHistory,
        pool: ["словы3"],
      });

      await gameService.initialize();
      const result = gameService.getDailySecret();

      expect(result.dayIndex).toBe(2);
      expect(["словы3"]).toContain(result.secretWord);
    });

    test("should correctly use pool for future words", async () => {
      const wordToIndex = new Map<string, number>();
      mockWords.forEach((word, index) => {
        wordToIndex.set(word.toLowerCase(), index);
      });

      const mockPool = ["словы3", "словы4"];
      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex,
        history: mockHistory,
        pool: mockPool,
      });

      await gameService.initialize();

      const service = gameService as any;
      expect(service.poolingService.getRemainingPoolCount()).toBe(2);
      expect(service.poolingService.isWordInPool("словы3")).toBe(true);
    });
  });

  describe("LCG with Active Pool", () => {
    test("should use active pool size for LCG parameters", async () => {
      mockCurrentDate("2026-01-16"); // Day 1 - not in history

      const mockWords = ["а", "б", "в", "г", "д", "е"];
      const mockTargets = ["а", "б", "в", "г", "е"];
      const mockVectors = new Int8Array(6 * 128);
      const mockHistory = { "0": "д" }; // Only day 0 in history
      const mockPool = ["а", "б", "в", "г"]; // 4 words in pool

      const wordToIndex = new Map<string, number>();
      mockWords.forEach((word, index) => {
        wordToIndex.set(word.toLowerCase(), index);
      });

      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex,
        history: mockHistory,
        pool: mockPool,
      });

      await gameService.initialize();

      gameService.getDailySecret(); // This triggers LCG param calculation

      const lcgParams = (gameService as any).lcgParams;
      expect(lcgParams.N).toBe(4);
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty history gracefully", async () => {
      mockCurrentDate("2026-01-15"); // Day 0

      const mockWords = ["словы1", "словы2"];
      const mockTargets = ["словы1", "словы2"];
      const mockVectors = new Int8Array(2 * 128);
      const mockHistory = {};
      const mockPool = ["словы1", "словы2"];

      const wordToIndex = new Map<string, number>();
      mockWords.forEach((word, index) => {
        wordToIndex.set(word.toLowerCase(), index);
      });

      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex,
        history: mockHistory,
        pool: mockPool,
      });

      await gameService.initialize();

      const result = gameService.getDailySecret();

      expect(result.dayIndex).toBe(0);
      expect(mockPool).toContain(result.secretWord);
    });

    test("should handle all words in history", async () => {
      const mockWords = ["словы1", "словы2"];
      const mockTargets = ["словы1", "словы2"];
      const mockVectors = new Int8Array(2 * 128);
      const mockHistory = { "0": "словы1", "1": "словы2" };
      const mockPool: string[] = []; // Empty pool

      const wordToIndex = new Map<string, number>();
      mockWords.forEach((word, index) => {
        wordToIndex.set(word.toLowerCase(), index);
      });

      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex,
        history: mockHistory,
        pool: mockPool,
      });

      await gameService.initialize();

      const service = gameService as any;
      expect(service.poolingService.getRemainingPoolCount()).toBe(0);
    });
  });
});
