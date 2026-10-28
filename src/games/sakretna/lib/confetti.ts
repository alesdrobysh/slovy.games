import confetti from "canvas-confetti";

const COLORS = ["#2e6b4f", "#5c9c7e", "#8cc2a6", "#1f4a37", "#b7dcc8"];

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
