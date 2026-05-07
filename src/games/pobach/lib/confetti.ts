import confetti from "canvas-confetti";

const COLORS = ["#e58d3f", "#c17a3c", "#f0b27a", "#16a34a", "#84cc16"];

/**
 * Triggers a confetti celebration effect
 */
export function triggerConfetti(): void {
  // Primary burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: COLORS,
  });

  // Side bursts (delayed 250ms)
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: COLORS,
    });
  }, 250);

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: COLORS,
    });
  }, 375);
}
