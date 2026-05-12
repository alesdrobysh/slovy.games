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
		<div className="min-h-screen flex flex-col">
			<HeaderWithInspector
				displayDate={displayDate}
				currentDate={puzzle.date}
			/>
			<main className="flex-1">
				<GamePage puzzle={puzzle} />
			</main>
		</div>
	);
}
