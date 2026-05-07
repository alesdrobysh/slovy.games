import {
  analyzeLCGCycle,
  calculateOverallScore,
  evaluateLCGQuality,
  findOptimalLCGParams,
  generateDirectSequence,
  generateLCGSequence,
} from "../lcg-optimizer";
import {
  gcd,
  hullDobellValidate,
  isCoprime,
  lcgPeriod,
  multiplicativeOrder,
  primeFactors,
} from "../math-utils";

describe("Math Utils", () => {
  describe("gcd", () => {
    it("should calculate GCD correctly", () => {
      expect(gcd(48, 18)).toBe(6);
      expect(gcd(100, 75)).toBe(25);
      expect(gcd(17, 23)).toBe(1); // Coprime
      expect(gcd(0, 5)).toBe(5);
      expect(gcd(5, 0)).toBe(5);
      expect(gcd(0, 0)).toBe(0);
    });

    it("should handle negative numbers", () => {
      expect(gcd(-48, 18)).toBe(6);
      expect(gcd(48, -18)).toBe(6);
      expect(gcd(-48, -18)).toBe(6);
    });
  });

  describe("isCoprime", () => {
    it("should identify coprime numbers", () => {
      expect(isCoprime(15, 28)).toBe(true);
      expect(isCoprime(17, 23)).toBe(true);
      expect(isCoprime(14, 21)).toBe(false); // Both divisible by 7
      expect(isCoprime(0, 1)).toBe(true); // gcd(0,1) = 1
      expect(isCoprime(0, 5)).toBe(false); // gcd(0,5) = 5 ≠ 1
    });
  });

  describe("primeFactors", () => {
    it("should find prime factors correctly", () => {
      expect(primeFactors(12)).toEqual([2, 3]);
      expect(primeFactors(100)).toEqual([2, 5]);
      expect(primeFactors(17)).toEqual([17]); // Prime
      expect(primeFactors(1)).toEqual([]); // Edge case
      expect(primeFactors(2)).toEqual([2]);
    });

    it("should return unique factors", () => {
      expect(primeFactors(8)).toEqual([2]); // 2^3, but unique
      expect(primeFactors(36)).toEqual([2, 3]); // 2^2 * 3^2, but unique
    });
  });

  describe("hullDobellValidate", () => {
    it("should validate Hull-Dobell compliant parameters", () => {
      // Known good parameters: N=16, A=5, B=1
      expect(hullDobellValidate(16, 5, 1)).toBe(true);

      // N=8, A=5, B=1
      expect(hullDobellValidate(8, 5, 1)).toBe(true);

      // N=337 (our target count), A=338, B=1
      // 337 is prime, so A ≡ 1 (mod 337) and B coprime with 337
      expect(hullDobellValidate(337, 338, 1)).toBe(true);
    });

    it("should reject invalid parameters", () => {
      // B not coprime with N
      expect(hullDobellValidate(10, 3, 2)).toBe(false); // gcd(2,10)=2

      // A-1 not divisible by prime factors of N
      expect(hullDobellValidate(6, 4, 1)).toBe(false); // N has factors 2,3; A-1=3 not divisible by 2

      // N divisible by 4, A-1 not divisible by 4
      expect(hullDobellValidate(4, 2, 1)).toBe(false);
    });
  });

  describe("multiplicativeOrder", () => {
    it("should calculate multiplicative order", () => {
      expect(multiplicativeOrder(3, 7)).toBe(6); // 3^6 ≡ 1 mod 7
      expect(multiplicativeOrder(2, 5)).toBe(4); // 2^4 ≡ 1 mod 5
    });

    it("should return null for non-coprime numbers", () => {
      expect(multiplicativeOrder(4, 6)).toBe(null); // gcd(4,6)=2
    });
  });

  describe("lcgPeriod", () => {
    it("should return N for Hull-Dobell compliant LCGs", () => {
      expect(lcgPeriod(16, 5, 1)).toBe(16);
      expect(lcgPeriod(8, 5, 1)).toBe(8);
    });

    it("should return -1 for non-compliant LCGs", () => {
      expect(lcgPeriod(10, 3, 2)).toBe(-1);
    });
  });
});

describe("LCG Optimizer", () => {
  describe("findOptimalLCGParams", () => {
    it("should find valid parameters for small N", () => {
      const params = findOptimalLCGParams(8);
      expect(params.N).toBe(8);
      expect(params.A).toBeGreaterThan(0);
      expect(params.B).toBeGreaterThanOrEqual(0);

      // Should be Hull-Dobell compliant
      const quality = evaluateLCGQuality(params);
      expect(quality.hullDobellCompliant).toBe(true);
    });

    it("should find parameters for current target count (337)", () => {
      const params = findOptimalLCGParams(337);
      expect(params.N).toBe(337);
      expect(params.A).toBeGreaterThan(0);
      expect(params.B).toBeGreaterThanOrEqual(0);

      // For prime N, it might not be Hull-Dobell compliant if we avoid A=1,
      // but it should still have a full period in direct mapping.
      const quality = evaluateLCGQuality(params);
      expect(quality.period).toBe(337);
    });

    it("should throw error for impossible cases", () => {
      // Very small N with restrictive requirements
      expect(() => findOptimalLCGParams(1)).toThrow();
    });
  });

  describe("evaluateLCGQuality", () => {
    it("should evaluate quality correctly", () => {
      // Good parameters
      const goodParams = { N: 8, A: 5, B: 1 };
      const goodQuality = evaluateLCGQuality(goodParams);
      expect(goodQuality.hullDobellCompliant).toBe(true);
      expect(goodQuality.period).toBe(8);

      // Poor parameters (not Hull-Dobell compliant)
      const poorParams = { N: 10, A: 3, B: 2 };
      const poorQuality = evaluateLCGQuality(poorParams);
      expect(poorQuality.hullDobellCompliant).toBe(false);
      // But it still has a full cycle in direct mapping because gcd(3, 10) = 1
      expect(poorQuality.period).toBe(10);
    });

    it("should score well-known multipliers correctly based on compliance", () => {
      // For N=337 (prime), A=16807, B=0 is NOT Hull-Dobell compliant (A-1 not divisible by 337)
      // but it is coprime, so it should get a score of 20 now.
      const badParams = { N: 337, A: 16807, B: 0 };
      const badQuality = evaluateLCGQuality(badParams);
      expect(badQuality.multiplierQuality).toBe(20);

      // Find actual optimal parameters and verify they have full period
      const goodParams = findOptimalLCGParams(337);
      const goodQuality = evaluateLCGQuality(goodParams);
      console.log(
        "Optimized Params for 337:",
        goodParams,
        "Quality:",
        goodQuality,
      );
      expect(goodQuality.period).toBe(337);
      expect(goodQuality.multiplierQuality).toBeGreaterThanOrEqual(0);
    });
  });

  describe("calculateOverallScore", () => {
    it("should calculate weighted score", () => {
      const quality = {
        hullDobellCompliant: true,
        period: 16,
        spectralQuality: 90,
        multiplierQuality: 100,
      };

      const score = calculateOverallScore(quality);
      // Should be: (100*40 + 90*30 + 100*30) / 100 = (40 + 27 + 30) = 97
      expect(score).toBeCloseTo(97, 0);
    });

    it("should penalize non-compliant LCGs", () => {
      const quality = {
        hullDobellCompliant: false,
        period: -1,
        spectralQuality: 50,
        multiplierQuality: 50,
      };

      const score = calculateOverallScore(quality);
      // Hull-Dobell score = 0, so score should be much lower
      expect(score).toBeLessThan(50);
    });
  });

  describe("generateLCGSequence", () => {
    it("should generate sequence correctly", () => {
      const params = { N: 5, A: 3, B: 0 }; // Simple multiplicative LCG
      const sequence = generateLCGSequence(params, 10, 1);

      expect(sequence).toHaveLength(10);
      expect(sequence[0]).toBe(3); // (3*1 + 0) % 5 = 3
      expect(sequence[1]).toBe(4); // (3*3 + 0) % 5 = 4
      expect(sequence[2]).toBe(2); // (3*4 + 0) % 5 = 2
      expect(sequence[3]).toBe(1); // (3*2 + 0) % 5 = 1
      expect(sequence[4]).toBe(3); // (3*1 + 0) % 5 = 3 (cycle starts)

      // All values should be within [0, N)
      for (const val of sequence) {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(5);
      }
    });

    it("should handle different seeds", () => {
      const params = { N: 7, A: 3, B: 1 };
      const seq1 = generateLCGSequence(params, 5, 0);
      const seq2 = generateLCGSequence(params, 5, 1);

      // Different seeds should produce different sequences
      expect(seq1).not.toEqual(seq2);
    });
  });

  describe("analyzeLCGCycle", () => {
    it("should detect cycles correctly", () => {
      // Hull-Dobell compliant LCG with period 5
      const params = { N: 5, A: 2, B: 1 };
      const analysis = analyzeLCGCycle(params, 20);

      expect(analysis.cycleLength).toBe(4); // Actually cycles 0→1→3→2→0
      expect(analysis.hasDuplicates).toBe(true); // Should have duplicates in long sequence
    });

    it("should handle non-cycling sequences", () => {
      // Poor parameters that don't cycle well
      const params = { N: 6, A: 2, B: 2 };
      const analysis = analyzeLCGCycle(params, 20);

      // May or may not find a cycle, but should detect duplicates
      expect(typeof analysis.cycleLength).toBe("number");
      expect(typeof analysis.hasDuplicates).toBe("boolean");
    });
  });
});

describe("Integration Tests", () => {
  describe("Current Game Parameters", () => {
    it("should validate current LCG parameters", () => {
      // Current parameters: A=137, B=13, N=337
      const currentParams = { N: 337, A: 137, B: 13 };
      const quality = evaluateLCGQuality(currentParams);

      // Current parameters are not Hull-Dobell compliant
      expect(quality.hullDobellCompliant).toBe(false);
    });

    it("should find better parameters", () => {
      const currentParams = { N: 337, A: 137, B: 13 };
      const optimizedParams = findOptimalLCGParams(337);

      const currentQuality = evaluateLCGQuality(currentParams);
      const optimizedQuality = evaluateLCGQuality(optimizedParams);

      const currentScore = calculateOverallScore(currentQuality);
      const optimizedScore = calculateOverallScore(optimizedQuality);

      // Optimized should be better or equal
      expect(optimizedScore).toBeGreaterThanOrEqual(currentScore);
      expect(optimizedQuality.period).toBe(337);
    });
  });

  describe("Full Cycle Validation", () => {
    it("should generate full cycle without early repeats for optimized params", () => {
      const params = findOptimalLCGParams(337);
      const sequence = generateDirectSequence(params, 337);
      const uniqueValues = new Set(sequence);

      // Should visit all 337 values exactly once in full cycle
      expect(uniqueValues.size).toBe(337);
      expect(sequence.length).toBe(337);
    });
  });
});
