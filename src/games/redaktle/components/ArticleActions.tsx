"use client";

import { Eye, Flag } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

interface ArticleActionsProps {
	onUseHint: () => void;
	onClaimWin: () => void;
	onGiveUp: () => void;
	hintAvailable: boolean;
	titleVisible: boolean;
	finished: boolean;
}

export function ArticleActions({
	onUseHint,
	onClaimWin,
	onGiveUp,
	hintAvailable,
	titleVisible,
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
			>
				{hintAvailable ? "Падказка" : "Выкарыстана"}
			</Button>
			<Button
				variant="outline"
				color="neutral"
				size="sm"
				onClick={onClaimWin}
				disabled={!titleVisible || finished}
				dashed
				className="sm:size-md"
			>
				Здагадаўся!
			</Button>
			<Button
				variant="ghost"
				color="neutral"
				size="sm"
				startIcon={<Flag size={14} />}
				onClick={onGiveUp}
				disabled={finished}
				className="sm:size-md"
			>
				Здацца
			</Button>
		</div>
	);
}
