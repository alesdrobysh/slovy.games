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

type FlagState = "idle" | "confirming" | "sending" | "sent";

interface YesterdayModalProps {
	currentDate: string;
}

export function YesterdayModal({ currentDate }: YesterdayModalProps) {
	const [open, setOpen] = useState(false);
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

	// Close on Escape
	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [open]);

	// Lock body scroll when open
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	if (!puzzle) return null;

	const sorted = [...puzzle.answers].sort((a, b) => a.localeCompare(b, "be"));

	return (
		<>
			{/* Header trigger */}
			<button
				type="button"
				onClick={() => setOpen(true)}
				style={{
					background: "none",
					border: "none",
					cursor: "pointer",
					color: "var(--text-muted)",
					fontFamily: "var(--font-sans)",
					fontSize: "13px",
					fontWeight: "600",
					padding: 0,
				}}
			>
				Учора
			</button>

			{/* Modal overlay */}
			{open && (
				// biome-ignore lint/a11y/noStaticElementInteractions: presentation role backdrop
				<div
					role="presentation"
					onClick={() => setOpen(false)}
					style={{
						position: "fixed",
						inset: 0,
						zIndex: 50,
						background: "rgba(0,0,0,0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						padding: "16px",
					}}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-label="Учарашнія адказы"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						style={{
							background: "var(--bg-card)",
							border: "1px solid var(--border)",
							borderRadius: "16px",
							width: "100%",
							maxWidth: "480px",
							maxHeight: "80vh",
							display: "flex",
							flexDirection: "column",
							fontFamily: "var(--font-sans)",
						}}
					>
						{/* Modal header */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "16px 20px",
								borderBottom: "1px solid var(--border)",
								flexShrink: 0,
							}}
						>
							<span
								style={{
									fontWeight: "700",
									fontSize: "15px",
									color: "var(--text)",
								}}
							>
								Учарашнія адказы
							</span>
							<button
								type="button"
								onClick={() => setOpen(false)}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									color: "var(--text-muted)",
									fontSize: "20px",
									lineHeight: 1,
									padding: "0 2px",
								}}
							>
								✕
							</button>
						</div>

						{/* Progress summary */}
						{progress && (
							<div
								style={{
									padding: "12px 20px",
									borderBottom: "1px solid var(--border)",
									fontSize: "13px",
									color: "var(--text-muted)",
									flexShrink: 0,
								}}
							>
								Вы знайшлі {progress.foundWords.length} з{" "}
								{puzzle.answers.length} слоў ({progress.score} пт)
							</div>
						)}

						{/* Word list */}
						<ul
							style={{
								margin: 0,
								padding: "8px 20px 20px",
								listStyle: "none",
								overflowY: "auto",
							}}
						>
							{sorted.map((word) => {
								const isPangram = puzzle.pangrams.includes(word);
								const wasFound = progress
									? progress.foundWords.includes(word)
									: true;
								return (
									<li
										key={word}
										className="group"
										style={{
											fontSize: "14px",
											fontWeight: isPangram ? "700" : "400",
											color: isPangram
												? "var(--cornflower)"
												: wasFound
													? "var(--text)"
													: "var(--text-muted)",
											opacity: wasFound ? 1 : 0.45,
											padding: "6px 0",
											borderBottom: "1px solid var(--border)",
											display: "flex",
											alignItems: "center",
											gap: "8px",
										}}
									>
										{word}
										{isPangram && (
											<span
												style={{
													fontSize: "9px",
													background: "var(--cornflower-bg-subtle)",
													color: "var(--cornflower)",
													border: "1px solid var(--cornflower-border-subtle)",
													borderRadius: "4px",
													padding: "1px 6px",
													fontWeight: "700",
													letterSpacing: "0.08em",
													textTransform: "uppercase",
												}}
											>
												панграма
											</span>
										)}
										<span
											style={{
												marginLeft: "auto",
												display: "flex",
												alignItems: "center",
												gap: "4px",
												flexShrink: 0,
											}}
										>
											{showFlags &&
												(() => {
													const fs = getFlagState(word);
													if (fs === "confirming") {
														return (
															<>
																<span
																	style={{
																		fontSize: "11px",
																		color: "var(--text-muted)",
																	}}
																>
																	адправіць?
																</span>
																<button
																	type="button"
																	onClick={() =>
																		handleConfirm(word, puzzle.date)
																	}
																	style={{
																		background: "none",
																		border: "none",
																		cursor: "pointer",
																		color: "var(--cornflower)",
																		fontSize: "24px",
																		lineHeight: 1,
																		padding: "0 2px",
																	}}
																	title="Пацвердзіць"
																>
																	✓
																</button>
																<button
																	type="button"
																	onClick={() => setWordFlagState(word, "idle")}
																	style={{
																		background: "none",
																		border: "none",
																		cursor: "pointer",
																		color: "var(--text-muted)",
																		fontSize: "24px",
																		lineHeight: 1,
																		padding: "0 2px",
																	}}
																	title="Адмяніць"
																>
																	✕
																</button>
															</>
														);
													}
													return (
														<button
															type="button"
															onClick={() => handleFlagClick(word)}
															disabled={fs === "sending"}
															className="opacity-0 group-hover:opacity-100"
															style={{
																background: "none",
																border: "none",
																cursor: fs === "sent" ? "default" : "pointer",
																color: "var(--text-muted)",
																fontSize: "24px",
																lineHeight: 1,
																padding: "0 2px",
																opacity:
																	fs === "sent"
																		? 0.6
																		: fs === "sending"
																			? 0.4
																			: undefined,
															}}
															title={
																fs === "sent"
																	? "Адпраўлена"
																	: "Адзначыць як непажаданае"
															}
														>
															{fs === "sent"
																? "✓"
																: fs === "sending"
																	? "…"
																	: "⚑"}
														</button>
													);
												})()}
											<a
												href={`https://verbum.by/tsblm2022/${encodeURIComponent(word)}`}
												target="_blank"
												rel="noreferrer"
												className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
												style={{
													color: "var(--text-muted)",
													fontSize: "12px",
													lineHeight: 1,
													textDecoration: "none",
												}}
												title={`Знайсці "${word}" у слоўніку`}
											>
												↗
											</a>
										</span>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			)}
		</>
	);
}
