// Redaction-bar motif: a stack of horizontal bars of varying widths
// centered on the same 370x370 viewBox as the other game contours.

const CX = 185;
const CY = 185;

interface RedactleContourProps {
	className?: string;
}

const BARS: Array<{ y: number; w: number }> = [
	{ y: -120, w: 240 },
	{ y: -80, w: 200 },
	{ y: -40, w: 260 },
	{ y: 0, w: 220 },
	{ y: 40, w: 180 },
	{ y: 80, w: 240 },
	{ y: 120, w: 200 },
];

export function RedactleContour({ className }: RedactleContourProps) {
	return (
		<svg
			viewBox="0 0 370 370"
			className={className}
			fill="none"
			xmlns="http://www.w3.org/2010/svg"
			aria-hidden="true"
		>
			{BARS.map((b) => (
				<rect
					key={b.y}
					x={CX - b.w / 2}
					y={CY + b.y - 8}
					width={b.w}
					height={16}
					rx={4}
					fill="currentColor"
					opacity="0.85"
				/>
			))}
			<circle
				cx={CX}
				cy={CY}
				r={155}
				stroke="currentColor"
				strokeWidth="0.75"
				strokeDasharray="4 10"
			/>
		</svg>
	);
}
