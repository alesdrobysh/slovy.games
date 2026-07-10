"use client";

import { useCallback, useState } from "react";
import { HowToPlay } from "@/games/sakretna/components/HowToPlay";
import { SakretnaPage } from "@/games/sakretna/components/SakretnaPage";
import type { PickedArticle } from "@/games/sakretna/types";
import { Nav } from "@/shared/components/Nav";

interface Props {
	picked: PickedArticle;
}

export function GameShell({ picked }: Props) {
	const [showHelp, setShowHelp] = useState(false);
	const handleHelpClick = useCallback(() => setShowHelp(true), []);

	return (
		<>
			<Nav onHelpClick={handleHelpClick} />
			<main>
				<SakretnaPage picked={picked} />
			</main>
			<HowToPlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
		</>
	);
}
