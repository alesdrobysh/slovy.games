type VibrateDuration = "short" | "long";

const VIBRATION_DURATION_MAP: Record<VibrateDuration, number> = {
  short: 50,
  long: 500,
};

export function vibrate(duration: VibrateDuration): void {
  navigator.vibrate?.(VIBRATION_DURATION_MAP[duration]);
}
