"use client";

import { useEffect, useState } from "react";
import {
	UNWANTED_DATE_ENTRY,
	UNWANTED_FORM_ACTION,
	UNWANTED_WORD_ENTRY,
} from "@/games/valoshka/lib/config";
import { getPuzzleForDate } from "@/games/valoshka/lib/puzzles";
import {
	getYesterdayDateString,
	loadProgress,
} from "@/games/valoshka/lib/storage";
import type { Puzzle, SavedProgress } from "@/games/valoshka/types";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";
import { Check, Ellipsis, ExternalLink, Flag, X } from "lucide-react";
import { pluralize } from "@/shared/lib/pluralize";

type FlagState = "idle" | "confirming" | "sending" | "sent";

interface YesterdayModalProps {
	currentDate: string;
	isOpen: boolean;
	onClose: () => void;
}

export function YesterdayModal({ currentDate, isOpen, onClose }: YesterdayModalProps) {
	const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
	const [progress, setProgress] = useState<SavedProgress | null>(null);
	const [flagStates, setFlagStates] = useState<Record<string, FlagState>>({});

	const showFlags = Boolean(
		UNWANTED_FORM_ACTION && UNWANTED_WORD_ENTRY && UNWANTED_DATE_ENTRY
	);

	const getFlagState = (word: string): FlagState => flagStates[word] ?? "idle";

	const setWordFlagState = (word: string, state: FlagState) =>
		setFlagStates((prev) => ({ ...prev, [word]: state }));

	const handleFlagClick = (word: string) => {
		const current = getFlagState(word);
		if (current === "idle") setWordFlagState(word, "confirming");
		else if (current === "confirming") setWordFlagState(word, "idle");
	};

	const handleConfirm = async (word: string, puzzleDate: string) => {
		setWordFlagState(word, "sending");
		try {
			const body = new FormData();
			body.append(UNWANTED_WORD_ENTRY, word);
			body.append(UNWANTED_DATE_ENTRY, puzzleDate);
			await fetch(UNWANTED_FORM_ACTION, {
				method: "POST",
				body,
				mode: "no-cors",
			});
		} catch {
			// no-cors means we can't read the response — assume sent
		}
		setWordFlagState(word, "sent");
	};

	useEffect(() => {
		const yesterday = getYesterdayDateString();
		if (yesterday >= currentDate) return;
		const p = getPuzzleForDate(yesterday);
		if (!p) return;
		setPuzzle(p);
		setProgress(loadProgress(yesterday));
	}, [currentDate]);

	if (!puzzle) return null;

	const sorted = [...puzzle.answers].sort((a, b) => a.localeCompare(b, "be"));

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Учарашнія адказы"
		>
				{/* Progress summary */}
				{progress && (
					<div className="pb-flow-md border-b border-rule">
						<Typography variant="body">
							Вы знайшлі {progress.foundWords.length} з {puzzle.answers.length}{" "}
							{pluralize(puzzle.answers.length, "слова", "genitive")} ({progress.score} пт)
						</Typography>
					</div>
				)}

				{/* Word list */}
				<ul className="m-0 pt-flow-sm list-none overflow-y-auto max-h-[40vh]">
					{sorted.map((word) => {
						const isPangram = puzzle.pangrams.includes(word);
						const wasFound = progress
							? progress.foundWords.includes(word)
							: true;
						return (
							<li
								key={word}
								className={`group text-sm flex items-center gap-flow-sm py-flow-xs border-b border-rule ${
									isPangram
										? "font-bold text-valoshka"
										: wasFound
											? "text-ink"
											: "text-ink-muted opacity-45"
								}`}
							>
								<Typography variant="caption">{word}</Typography>
								<span className="ml-auto flex items-center gap-flow-xs shrink-0">
									{showFlags &&
										(() => {
											const fs = getFlagState(word);
											if (fs === "confirming") {
												return (
													<>
														<Typography variant="label" className="text-ink-muted">
															адправіць?
														</Typography>
														<Button
															variant="ghost"
															color="primary"
															onClick={() => handleConfirm(word, puzzle.date)}
															aria-label="Пацвердзіць"
														>
															<Check />
														</Button>
														<Button
															variant="ghost"
															color="neutral"
															onClick={() => setWordFlagState(word, "idle")}
															aria-label="Адмяніць"
														>
															<X />
														</Button>
													</>
												);
											}
											return (
												<Button
													variant="ghost"
													color="neutral"
													onClick={() => handleFlagClick(word)}
													disabled={fs === "sending"}
													className={
														fs === "idle"
															? "opacity-0 group-hover:opacity-100"
															: fs === "sent"
																? "opacity-60"
																: "opacity-40"
													}
													aria-label={
														fs === "sent"
															? "Адпраўлена"
															: "Паведаміць пра памылку ў слове"
													}
												>
													{fs === "sent" ? <Check /> : fs === "sending" ? <Ellipsis /> : <Flag />}
												</Button>
											);
										})()}
									<a
										href={`https://verbum.by/tsblm2022/${encodeURIComponent(word)}`}
										target="_blank"
										rel="noreferrer"
										className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-ink-muted text-xs leading-none no-underline"
										title={`Знайсці "${word}" у слоўніку`}
									>
										<ExternalLink />
									</a>
								</span>
							</li>
						);
					})}
				</ul>
		</Modal>
	);
}
