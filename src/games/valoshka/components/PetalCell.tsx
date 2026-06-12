"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PetalCellProps {
	cx: number;
	cy: number;
	letter: string;
	isCenter: boolean;
	r: number;
	rotation?: number;
	onClick: () => void;
	shuffleCount?: number;
	shuffleIndex?: number;
}

// Cornflower petal — low-poly symmetric polygon with three-peak crown
// Crown at top, base parallel to hexagon edges, ~130px tall, ~90px wide
const PETAL_PATH =
	"M-22-67l22-33L22-66l33-20L48-45 32-13 12 12H-12L-32-13-48-45-55-86Z";

// Regular hexagon for center (flat-side-up orientation)
const HEXAGON_POINTS = "45,0 22.5,39 -22.5,39 -45,0 -22.5,-39 22.5,-39";

export function PetalCell({
	cx,
	cy,
	letter,
	isCenter,
	r,
	rotation = 0,
	onClick,
	shuffleCount,
	shuffleIndex = 0,
}: PetalCellProps) {
	const groupRef = useRef<SVGGElement>(null);
	const keyboardPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);
	const [isPressed, setIsPressed] = useState(false);

	const releasePress = useCallback(() => {
		setIsPressed(false);
	}, []);

	const handlePointerDown = useCallback(() => {
		setIsPressed(true);
		onClick();
	}, [onClick]);

	const handlePointerUp = useCallback(() => {
		releasePress();
	}, [releasePress]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key !== "Enter") return;
			onClick();
			setIsPressed(true);
			if (keyboardPressTimerRef.current) {
				clearTimeout(keyboardPressTimerRef.current);
			}
			keyboardPressTimerRef.current = setTimeout(releasePress, 120);
		},
		[onClick, releasePress]
	);

	useEffect(() => {
		return () => {
			if (keyboardPressTimerRef.current) {
				clearTimeout(keyboardPressTimerRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (!shuffleCount) return;
		const el = groupRef.current;
		if (!el) return;
		const delay = shuffleIndex * 45;
		const timer = setTimeout(() => {
			el.classList.remove("cell-shuffling");
			void el.getBoundingClientRect(); // force reflow
			el.classList.add("cell-shuffling");
			const onEnd = () => el.classList.remove("cell-shuffling");
			el.addEventListener("animationend", onEnd, { once: true });
		}, delay);
		return () => clearTimeout(timer);
	}, [shuffleCount, shuffleIndex]);

	const fill = isCenter ? "var(--cell-center)" : "var(--cell-outer)";
	const hoverFill = isCenter
		? "var(--cell-center-hover)"
		: "var(--cell-outer-hover)";

	// Shift outer petal letters toward the visual center of the petal body
	const rad = (rotation * Math.PI) / 180;
	const letterOffset = 35;
	const textX = isCenter ? cx : cx + letterOffset * Math.sin(rad);
	const textY = isCenter ? cy : cy - letterOffset * Math.cos(rad);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: SVG cell uses pointer events for game input
		<g
			ref={groupRef}
			tabIndex={0}
			onKeyDown={handleKeyDown}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			onPointerCancel={releasePress}
			onPointerLeave={releasePress}
			style={{
				cursor: "pointer",
				touchAction: "none",
				transform: isPressed ? "scale(0.9)" : "scale(1)",
				transformBox: "fill-box",
				transformOrigin: "center",
				transition: "transform 0.12s cubic-bezier(0.4, 0, 0.2, 1)",
			}}
			className={isCenter ? "cell-center-glow" : undefined}
		>
			{isCenter ? (
				// biome-ignore lint/a11y/noStaticElementInteractions: hexagon is part of interactive g group
				<polygon
					points={HEXAGON_POINTS}
					transform={`translate(${cx}, ${cy})`}
					fill={fill}
					style={{ transition: "fill 0.15s ease" }}
					onMouseEnter={(e) => {
						(e.currentTarget as SVGPolygonElement).setAttribute(
							"fill",
							hoverFill
						);
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as SVGPolygonElement).setAttribute("fill", fill);
					}}
				/>
			) : (
				// biome-ignore lint/a11y/noStaticElementInteractions: path is part of interactive g group
				<path
					d={PETAL_PATH}
					fill={fill}
					transform={`translate(${cx}, ${cy}) rotate(${rotation})`}
					style={{ transition: "fill 0.15s ease" }}
					onMouseEnter={(e) => {
						(e.currentTarget as SVGPathElement).setAttribute("fill", hoverFill);
					}}
					onMouseLeave={(e) => {
						(e.currentTarget as SVGPathElement).setAttribute("fill", fill);
					}}
				/>
			)}
			<text
				x={textX}
				y={textY}
				textAnchor="middle"
				dominantBaseline="central"
				style={{
					fontFamily: "var(--font-b)",
					fontSize: isCenter ? `${r * 0.52}px` : "22px",
					fontWeight: "700",
					fill: isCenter
						? "var(--cell-letter-center)"
						: "var(--cell-letter-outer)",
					userSelect: "none",
					pointerEvents: "none",
					letterSpacing: "0",
				}}
			>
				{letter.toUpperCase()}
			</text>
		</g>
	);
}
