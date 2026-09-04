"use client";

import { useCallback, useEffect, useState } from "react";
import { GamePage } from "@/games/valoshka/components/GamePage";
import { HowToPlay } from "@/games/valoshka/components/HowToPlay";
import { StorageInspector } from "@/games/valoshka/components/StorageInspector";
import { YesterdayModal } from "@/games/valoshka/components/YesterdayModal";
import type { Puzzle } from "@/games/valoshka/types";
import { Nav } from "@/shared/components/Nav";
import { Button } from "@/shared/components/ui/Button";

interface Props {
	puzzle: Puzzle;
	currentDate: string;
}

export function GameShell({ puzzle, currentDate }: Props) {
	const [inspectorOpen, setInspectorOpen] = useState(false);
	const [showHelp, setShowHelp] = useState(false);
	const [yesterdayOpen, setYesterdayOpen] = useState(false);

	const toggleInspector = useCallback(() => setInspectorOpen((v) => !v), []);
	const handleHelpClick = useCallback(() => setShowHelp(true), []);
	const handleYesterdayOpen = useCallback(() => setYesterdayOpen(true), []);
	const handleYesterdayClose = useCallback(() => setYesterdayOpen(false), []);

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
				extraActions={
					<Button variant="ghost" color="neutral" onClick={handleYesterdayOpen}>
						Учора
					</Button>
				}
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
			<YesterdayModal
				currentDate={currentDate}
				isOpen={yesterdayOpen}
				onClose={handleYesterdayClose}
			/>
		</>
	);
}
