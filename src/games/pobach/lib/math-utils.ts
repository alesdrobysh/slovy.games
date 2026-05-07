/**
 * Mathematical utilities for LCG parameter validation and optimization.
 * Implements number theory functions needed for Hull-Dobell theorem compliance.
 */

/**
 * Calculate the Greatest Common Divisor using Euclidean algorithm.
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

/**
 * Check if two numbers are coprime (gcd = 1).
 * Conventionally, gcd(0, n) = n, so isCoprime(0, n) is true iff n = 1.
 */
export function isCoprime(a: number, b: number): boolean {
  const g = gcd(a, b);
  return g === 1;
}

/**
 * Find all prime factors of a number using trial division.
 */
export function primeFactors(n: number): number[] {
  const factors: number[] = [];
  n = Math.abs(n);

  // Handle 2 separately
  while (n % 2 === 0) {
    factors.push(2);
    n /= 2;
  }

  // Odd factors up to sqrt(n)
  for (let i = 3; i * i <= n; i += 2) {
    while (n % i === 0) {
      factors.push(i);
      n /= i;
    }
  }

  // If n is a prime number greater than 2
  if (n > 2) {
    factors.push(n);
  }

  return [...new Set(factors)]; // Remove duplicates
}

/**
 * Validate LCG parameters against Hull-Dobell theorem.
 *
 * Hull-Dobell conditions for maximum period LCG:
 * 1. B and N are coprime
 * 2. A ≡ 1 (mod p) for every prime p dividing N
 * 3. If N is divisible by 4, then A ≡ 1 (mod 4)
 *
 * When these conditions are met, the LCG has period N.
 */
export function hullDobellValidate(N: number, A: number, B: number): boolean {
  // Condition 1: B and N must be coprime
  if (!isCoprime(B, N)) {
    return false;
  }

  // Get unique prime factors of N
  const primes = primeFactors(N);

  // Condition 2: A ≡ 1 (mod p) for every prime p dividing N
  for (const p of primes) {
    if ((A - 1) % p !== 0) {
      return false;
    }
  }

  // Condition 3: If N is divisible by 4, A ≡ 1 (mod 4)
  if (N % 4 === 0 && (A - 1) % 4 !== 0) {
    return false;
  }

  return true;
}

/**
 * Find the multiplicative order of A modulo N.
 * Returns the smallest k > 0 such that A^k ≡ 1 (mod N).
 * Used for cycle length analysis.
 */
export function multiplicativeOrder(A: number, N: number): number | null {
  if (!isCoprime(A, N)) {
    return null; // A and N must be coprime
  }

  let order = 1;
  let current = A % N;

  // Keep multiplying until we get back to 1
  while (current !== 1) {
    current = (current * A) % N;
    order++;

    // Safety check: if we exceed N, there's an issue
    if (order > N) {
      return null;
    }
  }

  return order;
}

/**
 * Calculate the period length of an LCG.
 * For Hull-Dobell compliant LCGs, this should equal N.
 */
export function lcgPeriod(N: number, A: number, B: number): number {
  if (!hullDobellValidate(N, A, B)) {
    // For non-compliant LCGs, we need more complex analysis
    // This is a simplified implementation - in practice, period analysis
    // can be quite complex for non-Hull-Dobell LCGs
    return -1; // Unknown period
  }

  // For Hull-Dobell compliant LCGs, period is N
  return N;
}
