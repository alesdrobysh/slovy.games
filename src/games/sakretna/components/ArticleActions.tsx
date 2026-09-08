"use client";

import { Eye, Flag, Settings } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface ArticleActionsProps {
	onUseHint: () => void;
	onGiveUp: () => void;
	onSettings: () => void;
	hintAvailable: boolean;
	finished: boolean;
}

export function ArticleActions({
	onUseHint,
	onGiveUp,
	onSettings,
	hintAvailable,
	finished,
}: ArticleActionsProps) {
	return (
		<div className="flex flex-wrap items-center gap-flow-sm">
			<Button
				variant="outline"
				color="neutral"
				size="sm"
				startIcon={<Eye size={14} />}
				onClick={onUseHint}
				disabled={!hintAvailable || finished}
				className="sm:size-md"
				aria-label={hintAvailable ? "Падказка" : "Падказка выкарыстана"}
			>
				<span className="max-md:short:hidden">
					{hintAvailable ? "Падказка" : "Выкарыстана"}
				</span>
			</Button>
			<Button
				variant="ghost"
				color="neutral"
				size="sm"
				startIcon={<Flag size={14} />}
				onClick={onGiveUp}
				disabled={finished}
				className="sm:size-md"
				aria-label="Здацца"
			>
				<span className="max-md:short:hidden">Здацца</span>
			</Button>
			<Button
				variant="ghost"
				color="neutral"
				size="sm"
				startIcon={<Settings size={16} />}
				onClick={onSettings}
				aria-label="Налады гульні"
			/>
		</div>
	);
}
