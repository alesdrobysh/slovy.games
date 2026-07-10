"use client";

import { useCallback, useState } from "react";
import { HowToPlay } from "@/games/redaktle/components/HowToPlay";
import { RedactlePage } from "@/games/redaktle/components/RedactlePage";
import type { PickedArticle } from "@/games/redaktle/types";
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
				<RedactlePage picked={picked} />
			</main>
			<HowToPlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
		</>
	);
}
