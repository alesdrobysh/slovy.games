import { getPuzzleForToday } from "@/games/valoshka/lib/puzzles";
import { GameShell } from "./GameShell";

export const dynamic = "force-dynamic";

export default function ValoshkaPage() {
	const puzzle = getPuzzleForToday();
	return <GameShell puzzle={puzzle} currentDate={puzzle.date} />;
}
