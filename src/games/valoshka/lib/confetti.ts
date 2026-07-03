import confetti from "canvas-confetti";

const COLORS = ["#3555BF", "#5E7ADB", "#7b9cf0", "#252850", "#88b4e8"];

export function triggerConfetti(): void {
	confetti({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 },
		colors: COLORS,
	});

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
