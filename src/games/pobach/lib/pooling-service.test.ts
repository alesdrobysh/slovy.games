import { PoolingService } from "../pooling-service";

describe("PoolingService", () => {
  describe("constructor - duplicate handling", () => {
    it("should remove words from pool that exist in history", () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

      const poolData = {
        history: {
          "0": "word1",
          "1": "word2",
        },
        pool: ["word1", "word3", "word4", "word2"], // word1 and word2 are duplicates
      };

      const service = new PoolingService(poolData);

      // Should have logged a warning
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "Found 2 word(s) in both history and pool. Removing from pool: word1, word2",
        ),
      );

      // Pool should only have words not in history
      const state = service.getPoolState();
      expect(state.pool).toEqual(["word3", "word4"]);
      expect(state.pool).not.toContain("word1");
      expect(state.pool).not.toContain("word2");

      // History should remain unchanged
      expect(state.history).toEqual({
        "0": "word1",
        "1": "word2",
      });

      consoleWarnSpy.mockRestore();
    });

    it("should not log warning when there are no duplicates", () => {
      const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();

      const poolData = {
        history: {
          "0": "word1",
        },
        pool: ["word2", "word3"],
      };

      const service = new PoolingService(poolData);

      // Should not have logged a warning
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      // Pool should remain unchanged
      const state = service.getPoolState();
      expect(state.pool).toEqual(["word2", "word3"]);

      consoleWarnSpy.mockRestore();
    });
  });

  describe("getWordForDay", () => {
    it("should return word from history when day exists in history", () => {
      const poolData = {
        history: {
          "0": "historical-word",
        },
        pool: ["pool-word1", "pool-word2"],
      };

      const service = new PoolingService(poolData);
      const result = service.getWordForDay(0, 0);

      expect(result.word).toBe("historical-word");
      expect(result.source).toBe("history");
      expect(result.isFromHistory).toBe(true);
    });

    it("should return word from pool when day not in history", () => {
      const poolData = {
        history: {},
        pool: ["pool-word1", "pool-word2", "pool-word3"],
      };

      const service = new PoolingService(poolData);
      const result = service.getWordForDay(5, 1); // lcgIndex = 1

      expect(result.word).toBe("pool-word2"); // index 1 % 3 = 1
      expect(result.source).toBe("pool");
      expect(result.isFromHistory).toBe(false);
    });
  });
});
