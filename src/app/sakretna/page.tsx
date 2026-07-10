import { getArticleForToday } from "@/games/sakretna/lib/puzzles";
import { GameShell } from "./GameShell";

export const dynamic = "force-dynamic";

export default function SakretnaPage() {
	const picked = getArticleForToday();
	return <GameShell picked={picked} />;
}
