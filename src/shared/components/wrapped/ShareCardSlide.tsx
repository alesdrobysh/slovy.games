"use client";

import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Typography } from "@/shared/components/ui/Typography";
import { useShareImage } from "@/shared/hooks/useShareImage";
import {
	CARD,
	drawWrappedCard,
	renderWrappedCardBlob,
} from "@/shared/lib/wrapped/share-card";
import type { WrappedSummary } from "@/shared/types/wrapped";
import { SlideFrame } from "./slides/SlideFrame";

export interface ShareCardSlideProps {
	summary: WrappedSummary;
}

export function ShareCardSlide({ summary }: ShareCardSlideProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const blobRef = useRef<Blob | null>(null);

	// Draw the visible preview with the same function that produces the PNG,
	// and pre-render the blob so the share handler keeps user activation on
	// iOS instead of awaiting toBlob inside the tap.
	useEffect(() => {
		const ctx = canvasRef.current?.getContext("2d");
		if (ctx) void drawWrappedCard(ctx, summary);

		let cancelled = false;
		renderWrappedCardBlob(summary)
			.then((blob) => {
				if (!cancelled) blobRef.current = blob;
			})
			.catch(() => {
				blobRef.current = null;
			});
		return () => {
			cancelled = true;
		};
	}, [summary]);

	const getBlob = useCallback(async () => {
		if (blobRef.current) return blobRef.current;
		const blob = await renderWrappedCardBlob(summary);
		blobRef.current = blob;
		return blob;
	}, [summary]);

	const { share, isSharing, showToast, feedback } = useShareImage({
		getBlob,
		filename: `slovy-${summary.year}.png`,
		text: `Мой ${summary.year} у Словах`,
		url: "https://slovy.games/",
	});

	return (
		<SlideFrame variant="share">
			<div className="wrapped-share-ribbon" aria-hidden="true">
				ПАДЗЯЛІСЯ · ПАДЗЯЛІСЯ
			</div>
			<div className="wrapped-slide-title wrapped-reveal">
				<Typography variant="title">Падзяліся сваім годам</Typography>
			</div>
			<canvas
				ref={canvasRef}
				data-testid="wrapped-card-canvas"
				width={CARD.w}
				height={CARD.h}
				className="wrapped-share-card wrapped-reveal wrapped-reveal--late"
			/>
			<Button
				variant="solid"
				color="primary"
				size="lg"
				onClick={share}
				disabled={isSharing}
			>
				Падзяліцца
			</Button>
			{showToast && (
				<div className="wrapped-share-feedback">
					<Typography variant="label">Скапіявана</Typography>
				</div>
			)}
			{feedback === "downloaded" && (
				<div className="wrapped-share-feedback">
					<Typography variant="label">Захавана ў файл</Typography>
				</div>
			)}
			{feedback === "failed" && (
				<div className="wrapped-share-feedback">
					<Typography variant="label">Не атрымалася падзяліцца</Typography>
				</div>
			)}
		</SlideFrame>
	);
}
