import type { IGameRepository } from "../interfaces/IGameRepository";
import { GameService } from "./GameService";

describe("GameService - Unified File Structure", () => {
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

  describe("Unified File Loading", () => {
    test("should load combined structure correctly", async () => {
      const mockWords = ["слова1", "словы2", "словы3", "словы4", "словы5"];
      const mockTargets = ["слова1", "словы2", "словы3"];
      const mockVectors = new Int8Array(5 * 128);
      const mockHistory = { "0": "словы1", "1": "словы2" };
      const mockPool = ["словы3", "словы4", "словы5"];

      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex: new Map(),
        history: mockHistory,
        pool: mockPool,
      });

      await gameService.initialize();

      // Verify via poolingService internal state
      const service = gameService as any;
      expect(service.poolingService.getHistoryCount()).toBe(2);
      expect(service.poolingService.getRemainingPoolCount()).toBe(3);
    });

    test("should handle empty history and pool", async () => {
      const mockWords = ["слова1"];
      const mockTargets = ["слова1"];
      const mockVectors = new Int8Array(1 * 128);

      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex: new Map(),
        history: {},
        pool: ["слова1"],
      });

      await gameService.initialize();

      const service = gameService as any;
      expect(service.poolingService.getHistoryCount()).toBe(0);
      expect(service.poolingService.getRemainingPoolCount()).toBe(1);
    });
  });

  describe("Hybrid Algorithm with Pool", () => {
    test("should return historical word from history", async () => {
      mockCurrentDate("2026-01-15"); // Day 0

      const mockWords = ["слова1", "словы2"];
      const mockTargets = ["слова1", "словы2"];
      const mockVectors = new Int8Array(2 * 128);
      const mockHistory = { "0": "слова1", "1": "словы2" };
      const mockPool = ["словы2"];

      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex: new Map(),
        history: mockHistory,
        pool: mockPool,
      });

      await gameService.initialize();

      const result = gameService.getDailySecret();

      expect(result.dayIndex).toBe(0);
      expect(result.secretWord).toBe("слова1");
    });

    test("should return future word from pool", async () => {
      mockCurrentDate("2026-01-17"); // Day 2

      const mockWords = ["слова1", "словы2", "словы3", "словы4", "словы5"];
      const mockTargets = ["слова1", "словы2", "словы3", "словы4", "словы5"];
      const mockVectors = new Int8Array(5 * 128);
      const mockHistory = { "0": "слова1" }; // Only day 0 in history
      const mockPool = ["словы2", "словы3", "словы4", "словы5"]; // Days 1+ use pool

      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex: new Map(),
        history: mockHistory,
        pool: mockPool,
      });

      await gameService.initialize();

      const result = gameService.getDailySecret();

      expect(result.dayIndex).toBe(2);
      expect(mockPool).toContain(result.secretWord);
    });
  });

  describe("Edge Cases", () => {
    test("should handle day in history correctly", async () => {
      mockCurrentDate("2026-01-17"); // Day 2

      const mockWords = ["слова1", "словы2", "словы3"];
      const mockTargets = ["слова1", "словы2", "словы3"];
      const mockVectors = new Int8Array(3 * 128);
      const mockHistory = { "2": "словы3" }; // Day 2 is in history
      const mockPool = ["слова1", "словы2"];

      mockRepository.loadGameData.mockResolvedValue({
        words: mockWords,
        targets: mockTargets,
        vectors: mockVectors,
        wordToIndex: new Map(),
        history: mockHistory,
        pool: mockPool,
      });

      await gameService.initialize();

      const result = gameService.getDailySecret();

      expect(result.dayIndex).toBe(2);
      expect(result.secretWord).toBe("словы3"); // Should come from history
    });
  });
});
