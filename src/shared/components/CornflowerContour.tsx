const PETAL_PATH =
	"M-22-67l22-33L22-66l33-20L48-45 32-13 12 12H-12L-32-13-48-45-55-86Z";
const HEXAGON_POINTS = "45,0 22.5,39 -22.5,39 -45,0 -22.5,-39 22.5,-39";

const CX = 185;
const CY = 185;
const PETAL_DISTANCE = 55;
const START_ANGLE = -90;

const outerCenters = Array.from({ length: 6 }, (_, i) => {
	const deg = START_ANGLE + i * 60;
	const rad = (Math.PI / 180) * deg;
	return { x: CX + PETAL_DISTANCE * Math.cos(rad), y: CY + PETAL_DISTANCE * Math.sin(rad), rotation: deg + 90 };
});

interface CornflowerContourProps {
	className?: string;
}

export function CornflowerContour({ className }: CornflowerContourProps) {
	return (
		<svg
			viewBox="0 0 370 370"
			className={className}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			{outerCenters.map((pos, i) => (
				<path
					// biome-ignore lint/suspicious/noArrayIndexKey: static decorative element
					key={i}
					d={PETAL_PATH}
					transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rotation})`}
					stroke="currentColor"
					strokeWidth="1.5"
				/>
			))}
			<polygon
				points={HEXAGON_POINTS}
				transform={`translate(${CX}, ${CY})`}
				stroke="currentColor"
				strokeWidth="1.5"
			/>
		</svg>
	);
}
