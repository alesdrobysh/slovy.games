import {
  hullDobellValidate,
  isCoprime,
  multiplicativeOrder,
  primeFactors,
} from "./math-utils";

/**
 * LCG Parameters interface
 */
export interface LCGParams {
  N: number; // Modulus
  A: number; // Multiplier
  B: number; // Increment
}

/**
 * Quality metrics for LCG parameters
 */
export interface LCGQuality {
  hullDobellCompliant: boolean;
  period: number;
  spectralQuality: number; // Placeholder for future spectral test implementation
  multiplierQuality: number; // Score based on well-known good multipliers
}

/**
 * Well-known LCG multipliers with proven good statistical properties.
 * These are commonly used in scientific computing and random number generation.
 */
const WELL_KNOWN_MULTIPLIERS = [
  16807, // 7^5 - Used in many RNG implementations
  48271, // Good for 32-bit LCG
  69621, // Alternative high-quality multiplier
  630360016, // Very large prime multiplier
];

/**
 * Score a multiplier based on its statistical properties and known quality.
 * Prioritizes Hull-Dobell compliance over well-known multipliers.
 */
function scoreMultiplier(
  A: number,
  N: number,
  isHullDobellCompliant: boolean,
): number {
  // НІКОЛІ не дазваляем A = 1 (або A ≡ 1 mod N), бо гэта дае паслядоўны выбар слоў (+1 кожны дзень)
  if (A % N === 1) {
    return 0;
  }

  if (!isHullDobellCompliant) {
    // Калі N — просты лік, то любы A, які ўзаемна просты з N, дасць поўны цыкл (перастаноўку).
    // Гэта дазваляе нам "скакаць" па пуле, нават калі фармальна (A-1) не дзеліцца на N.
    if (isCoprime(A, N)) {
      return 20; // Даем базавы бал, каб дазволіць выкарыстанне, але ніжэй за афіцыйны Hull-Dobell
    }
    return 0;
  }

  // Перавага вядомым мультыплікатарам, калі яны задавальняюць Хала-Добела
  if (WELL_KNOWN_MULTIPLIERS.includes(A)) {
    return 100;
  }

  // Score based on multiplicative order (larger is generally better)
  const order = multiplicativeOrder(A, N);
  if (order === null) {
    return 0; // Not coprime with N
  }

  // Higher order relative to N is better (more uniform distribution)
  const orderRatio = order / N;

  // Prefer multipliers that are primes or have few factors
  const factors = primeFactors(A);
  const factorPenalty = factors.length * 5; // Fewer factors = higher score

  return Math.max(0, Math.min(100, orderRatio * 80 - factorPenalty + 20));
}

/**
 * Generate a sequence using direct mapping: X_i = (A*i + B) % N.
 * This is what's used in GameService for word rotation.
 */
export function generateDirectSequence(
  params: LCGParams,
  length: number,
): number[] {
  const { N, A, B } = params;
  const sequence: number[] = [];

  for (let i = 0; i < length; i++) {
    const value = (((A * i + B) % N) + N) % N;
    sequence.push(value);
  }

  return sequence;
}

/**
 * Evaluate the quality of LCG parameters.
 */
export function evaluateLCGQuality(params: LCGParams): LCGQuality {
  const { N, A, B } = params;

  const hullDobellCompliant = hullDobellValidate(N, A, B);

  // Калі мы выкарыстоўваем прамое адлюстраванне (A*i + B) % N,
  // то для поўнага цыклу дастаткова, каб gcd(A, N) = 1.
  const isDirectFullCycle = isCoprime(A, N);

  const period = hullDobellCompliant ? N : isDirectFullCycle ? N : -1;

  // For now, spectral quality is a placeholder
  const spectralQuality = hullDobellCompliant
    ? 90
    : isDirectFullCycle
      ? 70
      : 30;

  const multiplierQuality = scoreMultiplier(A, N, hullDobellCompliant);

  return {
    hullDobellCompliant,
    period,
    spectralQuality,
    multiplierQuality,
  };
}

/**
 * Calculate overall quality score (0-100).
 */
export function calculateOverallScore(quality: LCGQuality): number {
  const weights = {
    hullDobell: 40, // Most important - guarantees full period
    spectral: 30, // Statistical quality
    multiplier: 30, // Parameter quality
  };

  const hullDobellScore = quality.hullDobellCompliant ? 100 : 0;

  return (
    (hullDobellScore * weights.hullDobell) / 100 +
    (quality.spectralQuality * weights.spectral) / 100 +
    (quality.multiplierQuality * weights.multiplier) / 100
  );
}

/**
 * Find optimal LCG parameters for a given modulus N.
 * Prioritizes Hull-Dobell compliance and statistical quality.
 */
export function findOptimalLCGParams(N: number): LCGParams {
  if (N <= 1) {
    throw new Error(`Invalid modulus N=${N}, must be > 1`);
  }

  const candidates: LCGParams[] = [];

  // Strategy 1: Try well-known multipliers with Hull-Dobell compliant B values
  for (const A of WELL_KNOWN_MULTIPLIERS) {
    // Try B=0 first (pure multiplicative) - only works if gcd(A,N)=1 AND other conditions
    if (hullDobellValidate(N, A, 0)) {
      candidates.push({ N, A, B: 0 });
    }

    // Try small B values that make A, B, N Hull-Dobell compliant
    for (let B = 1; B < Math.min(100, N); B++) {
      if (hullDobellValidate(N, A, B) || isCoprime(A, N)) {
        candidates.push({ N, A, B });
        break; // Just need one good B per A
      }
    }
  }

  // Strategy 2: Systematic search for Hull-Dobell compliant parameters
  const maxA = Math.min(10000, N * 10); // Search up to 10*N or 10000
  for (let A = 2; A < maxA && candidates.length < 10; A++) {
    // skip A that are effectively 1 mod N
    if (A % N === 1) continue;

    // Limit candidates
    for (let B = 0; B < Math.min(100, N); B++) {
      if (hullDobellValidate(N, A, B) || isCoprime(A, N)) {
        candidates.push({ N, A, B });
        break; // Just need one B per A
      }
    }
  }

  if (candidates.length === 0) {
    throw new Error(`No valid LCG parameters found for N=${N}`);
  }

  // Find the best candidate
  let bestParams = candidates[0];
  let bestScore = 0;

  // Score and select best parameters
  for (const params of candidates) {
    const quality = evaluateLCGQuality(params);
    const _multiplierScore = scoreMultiplier(
      params.A,
      params.N,
      quality.hullDobellCompliant,
    );
    const score = calculateOverallScore(quality);

    if (score > bestScore) {
      bestScore = score;
      bestParams = params;
    }
  }

  return bestParams;
}

/**
 * Generate a sequence of LCG values for testing.
 * Useful for validation and cycle analysis.
 */
export function generateLCGSequence(
  params: LCGParams,
  length: number,
  seed = 0,
): number[] {
  const { N, A, B } = params;
  const sequence: number[] = [];

  let current = seed;
  for (let i = 0; i < length; i++) {
    current = (A * current + B) % N;
    sequence.push(current);
  }

  return sequence;
}

/**
 * Analyze the cycle properties of LCG parameters.
 * Returns information about duplicates and cycle length.
 */
export function analyzeLCGCycle(
  params: LCGParams,
  maxLength = 10000,
): {
  cycleLength: number;
  hasDuplicates: boolean;
  duplicatePositions: number[];
} {
  const sequence = generateLCGSequence(params, maxLength);
  const seen = new Set<number>();
  const duplicatePositions: number[] = [];

  for (let i = 0; i < sequence.length; i++) {
    const value = sequence[i];
    if (seen.has(value)) {
      duplicatePositions.push(i);
    }
    seen.add(value);
  }

  // Find actual cycle length by looking for repeat of initial value
  const initialValue = sequence[0];
  let cycleLength = -1;

  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] === initialValue) {
      cycleLength = i;
      break;
    }
  }

  return {
    cycleLength,
    hasDuplicates: duplicatePositions.length > 0,
    duplicatePositions,
  };
}
