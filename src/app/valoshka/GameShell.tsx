"use client";

import { useCallback, useEffect, useState } from "react";
import { GamePage } from "@/games/valoshka/components/GamePage";
import { HowToPlay } from "@/games/valoshka/components/HowToPlay";
import { StorageInspector } from "@/games/valoshka/components/StorageInspector";
import { YesterdayModal } from "@/games/valoshka/components/YesterdayModal";
import type { Puzzle } from "@/games/valoshka/types";
import { Nav } from "@/shared/components/Nav";

interface Props {
	puzzle: Puzzle;
	currentDate: string;
}

export function GameShell({ puzzle, currentDate }: Props) {
	const [inspectorOpen, setInspectorOpen] = useState(false);
	const [showHelp, setShowHelp] = useState(false);

	const toggleInspector = useCallback(() => setInspectorOpen((v) => !v), []);
	const handleHelpClick = useCallback(() => setShowHelp(true), []);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "D" && e.shiftKey && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				toggleInspector();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [toggleInspector]);

	return (
		<>
			<Nav
				onHelpClick={handleHelpClick}
				extraActions={<YesterdayModal currentDate={currentDate} />}
			/>
			<main>
				<GamePage puzzle={puzzle} />
			</main>
			<StorageInspector
				open={inspectorOpen}
				onClose={() => setInspectorOpen(false)}
			/>
			{showHelp && (
				<HowToPlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
			)}
		</>
	);
}
