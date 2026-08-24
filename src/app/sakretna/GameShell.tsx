"use client";

import { useCallback, useEffect, useState } from "react";
import { HowToPlay } from "@/games/sakretna/components/HowToPlay";
import { SakretnaPage } from "@/games/sakretna/components/SakretnaPage";
import type { PickedArticle } from "@/games/sakretna/types";
import { Nav } from "@/shared/components/Nav";

interface Props {
	picked: PickedArticle;
}

export const SAKRETNA_ONBOARDING_KEY = "sakretna:onboarding:v1";

export function GameShell({ picked }: Props) {
	const [showHelp, setShowHelp] = useState(false);
	const [isFirstRun, setIsFirstRun] = useState(false);
	const handleHelpClick = useCallback(() => {
		setIsFirstRun(false);
		setShowHelp(true);
	}, []);

	useEffect(() => {
		try {
			if (!window.localStorage.getItem(SAKRETNA_ONBOARDING_KEY)) {
				setIsFirstRun(true);
				setShowHelp(true);
			}
		} catch {
			// Storage can be unavailable in privacy mode; help remains reopenable.
		}
	}, []);

	const closeHelp = useCallback(() => {
		if (isFirstRun) {
			try {
				window.localStorage.setItem(SAKRETNA_ONBOARDING_KEY, "seen");
			} catch {
				// Closing onboarding must not depend on storage availability.
			}
		}
		setShowHelp(false);
		setIsFirstRun(false);
	}, [isFirstRun]);

	return (
		<>
			<Nav onHelpClick={handleHelpClick} />
			<main>
				<SakretnaPage picked={picked} />
			</main>
			<HowToPlay
				isOpen={showHelp}
				isFirstRun={isFirstRun}
				onClose={closeHelp}
			/>
		</>
	);
}
