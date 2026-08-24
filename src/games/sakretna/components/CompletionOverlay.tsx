"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/Button";
import type { Article, SavedProgress } from "../types";
import { FinishCard } from "./FinishCard";

interface CompletionOverlayProps {
	open: boolean;
	mode: "win" | "lose";
	article: Article;
	progress: SavedProgress;
	onReadArticle: () => void;
}

export function CompletionOverlay({
	open,
	mode,
	article,
	progress,
	onReadArticle,
}: CompletionOverlayProps) {
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		dialogRef.current?.focus();
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto bg-paper px-4 py-flow-lg">
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-live="polite"
				aria-label={mode === "win" ? "Гульня выйграна" : "Гульня завершана"}
				tabIndex={-1}
				className="mx-auto max-w-xl flex flex-col gap-flow-md focus:outline-none"
			>
				<FinishCard mode={mode} article={article} progress={progress} />
				<Button
					variant="outline"
					color="neutral"
					size="md"
					onClick={onReadArticle}
				>
					Паглядзець расшыфраваны артыкул
				</Button>
			</div>
		</div>
	);
}
