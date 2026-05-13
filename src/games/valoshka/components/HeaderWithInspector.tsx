"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HowToPlay } from "@/games/valoshka/components/HowToPlay";
import { StorageInspector } from "@/games/valoshka/components/StorageInspector";
import { YesterdayModal } from "@/games/valoshka/components/YesterdayModal";
import { useGameNav } from "@/shared/components/GameNavContext";

interface Props {
	displayDate: string;
	currentDate: string;
}

export function HeaderWithInspector({ displayDate, currentDate }: Props) {
	const { setGameNav, clearGameNav } = useGameNav();
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

	useEffect(() => {
		setGameNav({
			onHelpClick: handleHelpClick,
			extraActions: <YesterdayModal currentDate={currentDate} />,
		});
		return () => clearGameNav();
	}, [currentDate]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
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
