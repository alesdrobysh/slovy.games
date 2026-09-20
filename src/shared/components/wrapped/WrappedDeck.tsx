"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Typography } from "@/shared/components/ui/Typography";
import { buildSlides } from "@/shared/lib/wrapped/slides";
import { ShareCardSlide } from "./ShareCardSlide";
import { CommonSlide } from "./slides/CommonSlide";
import { GameSlide } from "./slides/GameSlide";
import { HeroSlide } from "./slides/HeroSlide";
import { ThinSlide } from "./slides/ThinSlide";
import { useWrappedSummary } from "./useWrappedSummary";
import "./wrapped.css";

export interface WrappedDeckProps {
	year: number;
}

const SWIPE_THRESHOLD_PX = 40;

export function WrappedDeck({ year }: WrappedDeckProps) {
	const summary = useWrappedSummary(year);
	const [index, setIndex] = useState(0);
	const touchStartX = useRef<number | null>(null);

	const slides = summary ? buildSlides(summary) : [];
	const lastIndex = Math.max(slides.length - 1, 0);

	const go = useCallback(
		(delta: number) => {
			setIndex((i) => Math.min(Math.max(i + delta, 0), lastIndex));
		},
		[lastIndex]
	);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "ArrowRight") go(1);
			else if (e.key === "ArrowLeft") go(-1);
			else if (e.key === "Escape") window.location.assign("/");
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [go]);

	// A thin deck is just the hero and the invitation slide — open on the
	// invitation directly rather than making the player step past the hero
	// to find out there isn't a recap yet. The hero stays reachable by
	// swiping/clicking back.
	useEffect(() => {
		if (summary?.isThin) setIndex(lastIndex);
	}, [summary?.isThin, lastIndex]);

	if (!summary) return <div className="min-h-dvh bg-paper" />;

	const slide = slides[Math.min(index, lastIndex)];
	const slideTone = slide.kind === "game" ? slide.gameId : slide.kind;

	return (
		<div
			className="wrapped-deck relative flex min-h-dvh flex-col overflow-hidden bg-paper"
			data-slide-kind={slide.kind}
			data-slide-tone={slideTone}
			onTouchStart={(e) => {
				touchStartX.current = e.touches[0]?.clientX ?? null;
			}}
			onTouchEnd={(e) => {
				const start = touchStartX.current;
				const end = e.changedTouches[0]?.clientX;
				touchStartX.current = null;
				if (start == null || end == null) return;
				if (Math.abs(end - start) < SWIPE_THRESHOLD_PX) return;
				go(end < start ? 1 : -1);
			}}
		>
			<div className="wrapped-progress flex items-center gap-flow-xs p-inset-md">
				{slides.map((s, i) => (
					<span
						key={s.kind === "game" ? `game-${s.gameId}-${s.page}` : s.kind}
						data-testid="wrapped-dot"
						data-active={i === index ? "true" : "false"}
						className="wrapped-progress__bar h-1 flex-1 rounded-full"
					/>
				))}
				<a href="/" aria-label="Зачыніць" className="wrapped-close">
					<Typography variant="label">✕</Typography>
				</a>
			</div>

			{/* Tap zones: left third goes back, the rest advances. */}
			<div className="relative flex-1" data-testid="wrapped-slide">
				{slide.kind === "hero" && (
					<HeroSlide year={slide.year} activeDays={summary.activeDays.length} />
				)}
				{slide.kind === "common" && <CommonSlide summary={summary} />}
				{slide.kind === "game" &&
					(() => {
						const stats = summary.perGame.find(
							(g) => g.gameId === slide.gameId
						);
						return stats ? <GameSlide stats={stats} page={slide.page} /> : null;
					})()}
				{slide.kind === "thin" && <ThinSlide year={summary.year} />}
				{slide.kind === "share" && <ShareCardSlide summary={summary} />}

				<button
					type="button"
					aria-label="Назад"
					className="wrapped-nav-button wrapped-nav-button--prev"
					onClick={() => go(-1)}
					disabled={index === 0}
				>
					<span className="wrapped-nav-pill" aria-hidden="true">
						←
					</span>
				</button>
				<button
					type="button"
					aria-label="Далей"
					className="wrapped-nav-button wrapped-nav-button--next"
					onClick={() => go(1)}
					disabled={index === lastIndex}
				>
					<span className="wrapped-nav-pill" aria-hidden="true">
						→
					</span>
				</button>
			</div>
		</div>
	);
}
