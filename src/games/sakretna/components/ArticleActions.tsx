"use client";

import { Eye, Flag, Settings } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface ArticleActionsProps {
	onUseHint: () => void;
	onGiveUp: () => void;
	onSettings: () => void;
	hintsLeft: number;
	hintMode?: boolean;
	finished: boolean;
}

export function ArticleActions({
	onUseHint,
	onGiveUp,
	onSettings,
	hintsLeft,
	hintMode = false,
	finished,
}: ArticleActionsProps) {
	return (
		<div className="flex flex-wrap items-center gap-flow-sm">
			<Button
				variant="outline"
				color={hintMode ? "primary" : "neutral"}
				size="sm"
				startIcon={<Eye />}
				onClick={onUseHint}
				disabled={hintsLeft === 0 || finished || hintMode}
				aria-label={`Падказка, засталося ${hintsLeft}`}
			>
				<span className="max-md:short:hidden">Падказка</span>
				<span
					aria-hidden="true"
					className="inline-flex min-w-3.5 h-3.5 items-center justify-center rounded-full bg-(--accent) px-1 text-[9px] leading-none text-white tabular-nums"
				>
					{hintsLeft}
				</span>
			</Button>
			<Button
				variant="ghost"
				color="neutral"
				size="sm"
				startIcon={<Flag />}
				onClick={onGiveUp}
				disabled={finished || hintMode}
				aria-label="Здацца"
			>
				<span className="max-md:short:hidden">Здацца</span>
			</Button>
			<Button
				variant="ghost"
				color="neutral"
				size="sm"
				startIcon={<Settings />}
				onClick={onSettings}
				aria-label="Налады гульні"
			/>
		</div>
	);
}
