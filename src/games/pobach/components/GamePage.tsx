"use client";

import { useGame } from "@/games/pobach/hooks/useGame";
import { GamePageContent } from "./GamePageContent";

export function GamePage() {
	const { state, actions } = useGame();
	return <GamePageContent state={state} actions={actions} />;
}
