import { getArticleForToday } from "@/games/redaktle/lib/puzzles";
import { GameShell } from "./GameShell";

export const dynamic = "force-dynamic";

export default function RedaktlePage() {
	const picked = getArticleForToday();
	return <GameShell picked={picked} />;
}
