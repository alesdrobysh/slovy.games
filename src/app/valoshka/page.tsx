import { GamePage } from "@/games/valoshka/components/GamePage";
import { HeaderWithInspector } from "@/games/valoshka/components/HeaderWithInspector";
import { getPuzzleForToday } from "@/games/valoshka/lib/puzzles";

export const dynamic = "force-dynamic";

export default function ValoshkaPage() {
	const puzzle = getPuzzleForToday();

	const dateObj = new Date(`${puzzle.date}T00:00:00Z`);
	const displayDate = dateObj.toLocaleDateString("be", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	});

	return (
		<main
			className="min-h-screen"
			style={{
				background: "var(--color-bg)",
				backgroundImage:
					"radial-gradient(ellipse 90% 55% at 50% 10%, var(--color-bg-card) 0%, var(--color-bg) 65%)",
				backgroundAttachment: "fixed",
				minHeight: "100lvh",
				overflowX: "hidden",
			}}
		>
			<HeaderWithInspector
				displayDate={displayDate}
				currentDate={puzzle.date}
			/>
			<GamePage puzzle={puzzle} />
		</main>
	);
}
