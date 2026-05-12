"use client";

import Link from "next/link";
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
			<div className="max-w-5xl mx-auto w-full px-5 sm:px-8 py-4 sm:py-6">
				<div className="mb-4 animate-fade-in-up">
					<Link
						href="/"
						className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink transition-colors no-underline"
					>
						← Усе гульні
					</Link>
					<div className="flex items-baseline justify-between mt-4 gap-4">
						<div>
							{/* biome-ignore lint/a11y/useKeyWithClickEvents: dev trigger */}
							<h1
								className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-valoshka cursor-default select-none"
								onClick={handleTitleTap}
							>
								Валошка
							</h1>
							<p className="text-sm text-ink-muted mt-2">
								Словы з сямі літар · {displayDate}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<YesterdayModal currentDate={currentDate} />
							<HeaderIconButtons
								onHelpClick={() => setShowHelp(true)}
								statsHref="/valoshka/stats"
							/>
						</div>
					</div>
				</div>
			</div>

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
