"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HowToPlay } from "@/games/valoshka/components/HowToPlay";
import { StorageInspector } from "@/games/valoshka/components/StorageInspector";
import { YesterdayModal } from "@/games/valoshka/components/YesterdayModal";
import { HeaderIconButtons } from "@/shared/components/HeaderIconButtons";

interface Props {
	displayDate: string;
	currentDate: string;
}

export function HeaderWithInspector({ displayDate, currentDate }: Props) {
	const [inspectorOpen, setInspectorOpen] = useState(false);
	const [showHelp, setShowHelp] = useState(false);
	const tapCountRef = useRef(0);
	const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const toggleInspector = useCallback(() => setInspectorOpen((v) => !v), []);

	// Desktop: Ctrl/Cmd+Shift+D
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

	// Mobile: 5 taps on title within 2 seconds
	const handleTitleTap = () => {
		tapCountRef.current += 1;
		if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
		if (tapCountRef.current >= 5) {
			tapCountRef.current = 0;
			toggleInspector();
			return;
		}
		tapTimerRef.current = setTimeout(() => {
			tapCountRef.current = 0;
		}, 2000);
	};

	return (
		<>
			<header
				className="border-b px-4 py-2 sm:px-6 sm:py-4"
				style={{ borderColor: "var(--sly-border)" }}
			>
				<div className="mx-auto flex max-w-5xl items-center">
					{/* Left: title group */}
					<div className="flex items-baseline gap-3 flex-1">
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: hidden dev trigger */}
						<h1
							className="text-3xl tracking-tight"
							style={{
								fontFamily: "var(--sly-font-display)",
								color: "var(--sly-cornflower)",
								letterSpacing: "-0.01em",
								userSelect: "none",
							}}
							onClick={handleTitleTap}
						>
							Валошка
						</h1>
						<span
							className="hidden sm:inline text-sm"
							style={{
								fontFamily: "var(--sly-font-sans)",
								fontStyle: "italic",
								color: "var(--sly-text-muted)",
							}}
						>
							Слоўная гульня
						</span>
					</div>

					{/* Center: date */}
					<span
						className="hidden sm:block text-sm font-medium tabular-nums absolute left-1/2 -translate-x-1/2"
						style={{ color: "var(--sly-text-muted)" }}
					>
						{displayDate}
					</span>

					{/* Right: yesterday + icon buttons */}
					<div className="flex-1 flex justify-end items-center gap-2">
						<YesterdayModal currentDate={currentDate} />
						<HeaderIconButtons
							onHelpClick={() => setShowHelp(true)}
							statsHref="/valoshka/stats"
						/>
					</div>
				</div>
			</header>

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
