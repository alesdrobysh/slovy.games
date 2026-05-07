/**
 * Returns badge type and closeness label for a given rank
 */
export function getRankBadgeInfo(rank: number): {
  type: "win" | "hot" | "close" | "warm" | "cold";
  label: string;
} {
  if (rank === 1) return { type: "win", label: "перамога" };
  if (rank <= 10) return { type: "hot", label: "вельмі блізка" };
  if (rank <= 100) return { type: "close", label: "блізка" };
  if (rank <= 1000) return { type: "warm", label: "трохі далей" };
  return { type: "cold", label: "вельмі далёка" };
}

/**
 * Returns the CSS color variable for a given rank
 */
export function getRankColor(rank: number): string {
  if (rank === 1) return "var(--rank-1)";
  if (rank <= 10) return "var(--rank-10)";
  if (rank <= 100) return "var(--rank-100)";
  if (rank <= 1000) return "var(--rank-1000)";
  return "var(--rank-default)";
}

/**
 * Returns the progress bar percentage for a given rank
 * Rank 1 is 100%, higher ranks get progressively smaller percentages
 */
export function getBarPercentage(rank: number): number {
  if (rank === 1) return 100;
  if (rank === 2) return 97;
  if (rank <= 200) {
    return Math.round(97 - (rank - 2) * (22 / 198));
  }
  if (rank <= 500) {
    return Math.round(75 - (rank - 200) * (25 / 300));
  }
  if (rank <= 2000) {
    return Math.round(50 - (rank - 500) * (25 / 1500));
  }
  if (rank <= 10000) {
    return Math.max(5, Math.round(25 - (rank - 2000) * (20 / 8000)));
  }
  return 5;
}

/**
 * Returns the progress bar width as a CSS percentage string
 */
export function getBarWidth(rank: number): string {
  return `${getBarPercentage(rank)}%`;
}
