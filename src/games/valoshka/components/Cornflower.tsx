"use client";

import { PetalCell } from "./PetalCell";

interface CornflowerProps {
	center: string;
	outer: string[];
	onLetter: (letter: string) => void;
	shuffleCount?: number;
}

const PETAL_DISTANCE = 55;
const CENTER_R = 52;
const CX = 185;
const CY = 185;
const START_ANGLE = -90;
const OUTER_ANGLES = Array.from({ length: 6 }, (_, i) => START_ANGLE + i * 60);
const svgSize = 370;

export function Cornflower({
	center,
	outer,
	onLetter,
	shuffleCount,
}: CornflowerProps) {
	const outerCenters = OUTER_ANGLES.map((deg) => {
		const rad = (Math.PI / 180) * deg;
		return {
			x: CX + PETAL_DISTANCE * Math.cos(rad),
			y: CY + PETAL_DISTANCE * Math.sin(rad),
			rotation: deg + 90,
		};
	});

	return (
		<svg
			className="ph-no-autocapture"
			viewBox={`0 0 ${svgSize} ${svgSize}`}
			style={{
				width: "100%",
				height: "auto",
				overflow: "visible",
				display: "block",
				touchAction: "none",
			}}
			aria-label="Гульнёвая дошка"
		>
			{/* Primary outer petals (middle layer) */}
			{outerCenters.map((pos, i) => (
				<PetalCell
					key={outer[i]}
					cx={pos.x}
					cy={pos.y}
					letter={outer[i] ?? ""}
					isCenter={false}
					r={CENTER_R}
					rotation={pos.rotation}
					onClick={() => onLetter(outer[i])}
					shuffleCount={shuffleCount}
					shuffleIndex={i}
				/>
			))}

			{/* Center game cell (front layer) */}
			<PetalCell
				cx={CX}
				cy={CY}
				letter={center}
				isCenter
				r={CENTER_R}
				onClick={() => onLetter(center)}
			/>
		</svg>
	);
}
