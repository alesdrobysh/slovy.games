// Geometry scaled to match CornflowerContour's 370x370 viewBox
const CARDINAL = "M 0,0 L -14,-48 L 0,-160 L 14,-48 Z";
const INTERCARDINAL = "M 0,0 L -9,-26 L 0,-100 L 9,-26 Z";

const CX = 185;
const CY = 185;

interface PobachContourProps {
	className?: string;
}

export function PobachContour({ className }: PobachContourProps) {
	return (
		<svg
			viewBox="0 0 370 370"
			className={className}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			{([0, 90, 180, 270] as const).map((rot) => (
				<path
					key={rot}
					d={CARDINAL}
					transform={`translate(${CX}, ${CY}) rotate(${rot})`}
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinejoin="round"
				/>
			))}
			{([45, 135, 225, 315] as const).map((rot) => (
				<path
					key={rot}
					d={INTERCARDINAL}
					transform={`translate(${CX}, ${CY}) rotate(${rot})`}
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinejoin="round"
				/>
			))}
			<circle cx={CX} cy={CY} r="22" stroke="currentColor" strokeWidth="1.5" />
			<circle
				cx={CX}
				cy={CY}
				r="163"
				stroke="currentColor"
				strokeWidth="0.75"
				strokeDasharray="5 11"
			/>
		</svg>
	);
}
