"use client";

import { useCallback, useState } from "react";
import { GamePage } from "@/games/pobach/components/GamePage";
import RulesComponent from "@/games/pobach/components/RulesComponent";
import { Nav } from "@/shared/components/Nav";
import { Modal } from "@/shared/components/ui/Modal";

export function GameShell() {
	const [showHelp, setShowHelp] = useState(false);
	const handleHelpClick = useCallback(() => setShowHelp(true), []);

	return (
		<>
			<Nav onHelpClick={handleHelpClick} />
			<GamePage />
			<Modal
				isOpen={showHelp}
				title="Як гуляць?"
				onClose={() => setShowHelp(false)}
			>
				<RulesComponent />
			</Modal>
		</>
	);
}
