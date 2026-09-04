import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PetalCell } from "./PetalCell";

const meta = {
	title: "Valoshka/PetalCell",
	tags: ["autodocs"],
	argTypes: {
		letter: { control: { type: "text" } },
		isCenter: { control: { type: "boolean" } },
		rotation: { control: { type: "range", min: 0, max: 360, step: 10 } },
		r: { control: { type: "range", min: 30, max: 80, step: 2 } },
	},
	args: {
		letter: "В",
		isCenter: false,
		rotation: 0,
		r: 52,
		cx: 100,
		cy: 120,
		onClick: () => {},
	},
} satisfies Meta<typeof PetalCell>;

export default meta;
type Story = StoryObj<typeof PetalCell>;

const lab = () => ({
	fontSize: 10,
	fontWeight: 700,
	textTransform: "uppercase" as const,
	letterSpacing: "0.12em",
	color: "var(--muted)",
	marginBottom: 10,
	fontFamily: "var(--font-b)",
});

const specRowStyle = {
	display: "grid" as const,
	gridTemplateColumns: "140px 1fr",
	gap: "0 24px",
	alignItems: "center" as const,
	padding: "20px 0",
	borderTop: "1px solid var(--border)",
};

// ─── Cell types ───────────────────────────────────────────────────

function CellTypesSpecimen() {
	return (
		<div style={{ padding: 40, background: "var(--bg)", minHeight: "100vh" }}>
			<p style={lab()}>Cell types</p>
			<p
				style={{
					fontSize: 11,
					color: "var(--muted)",
					margin: "0 0 24px",
					fontFamily: "var(--font-b)",
					lineHeight: 1.6,
					maxWidth: 520,
				}}
			>
				Two shapes: <strong>center</strong> (flat-top hexagon, dark fill) and{" "}
				<strong>outer</strong> (cornflower petal, medium fill). Letter position
				shifts toward the visual center of each shape.
			</p>

			{[
				{
					label: "center",
					spec: "Hexagon · dark navy · required letter · fixed",
					isCenter: true,
					rotation: 0,
					letter: "А",
					viewBox: "0 0 200 200",
					cx: 100,
					cy: 100,
				},
				{
					label: "outer",
					spec: "Petal · cornflower blue · 6 surrounding cells",
					isCenter: false,
					rotation: 0,
					letter: "Л",
					viewBox: "0 0 200 220",
					cx: 100,
					cy: 150,
				},
			].map(({ label, spec, isCenter, rotation, letter, viewBox, cx, cy }) => (
				<div key={label} style={specRowStyle}>
					<div>
						<code
							style={{
								display: "block",
								fontSize: 10,
								fontFamily: "monospace",
								color: "var(--muted)",
								letterSpacing: "0.04em",
								marginBottom: 4,
							}}
						>
							isCenter={String(isCenter)}
						</code>
						<p
							style={{
								fontSize: 11,
								color: "var(--fg-2)",
								margin: 0,
								fontFamily: "var(--font-b)",
								lineHeight: 1.5,
							}}
						>
							{spec}
						</p>
					</div>
					<svg
						viewBox={viewBox}
						style={{ width: 120, height: "auto", overflow: "visible" }}
					>
						<title>{spec}</title>
						<PetalCell
							cx={cx}
							cy={cy}
							letter={letter}
							isCenter={isCenter}
							r={52}
							rotation={rotation}
							onClick={() => {}}
						/>
					</svg>
				</div>
			))}
		</div>
	);
}

export const CellTypes: Story = {
	render: () => <CellTypesSpecimen />,
};

// ─── Rotations ────────────────────────────────────────────────────

const ROTATION_LABELS: Record<number, string> = {
	0: "top",
	60: "top-right",
	120: "bottom-right",
	180: "bottom",
	240: "bottom-left",
	300: "top-left",
};

function RotationsSpecimen() {
	const PETAL_DISTANCE = 55;
	const CX = 160;
	const CY = 160;

	return (
		<div style={{ padding: 40, background: "var(--bg)", minHeight: "100vh" }}>
			<p style={lab()}>Outer petal rotations</p>
			<p
				style={{
					fontSize: 11,
					color: "var(--muted)",
					margin: "0 0 32px",
					fontFamily: "var(--font-b)",
					lineHeight: 1.6,
					maxWidth: 520,
				}}
			>
				Each outer petal rotates to point outward from the center. Six positions
				at 60° increments form the full cornflower.
			</p>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(3, 160px)",
					gap: 16,
				}}
			>
				{[0, 60, 120, 180, 240, 300].map((angle) => {
					const rad = (Math.PI / 180) * (angle - 90);
					const cx = CX + PETAL_DISTANCE * Math.cos(rad);
					const cy = CY + PETAL_DISTANCE * Math.sin(rad);
					const rotation = angle;
					const letter = "ВАЛОШКА"[Math.floor(angle / 60)];
					return (
						<div key={angle} style={{ textAlign: "center" as const }}>
							<svg
								viewBox="0 0 320 320"
								style={{ width: 140, height: 140, overflow: "visible" }}
							>
								<title>Вонкавы пялёстак</title>
								<PetalCell
									cx={cx}
									cy={cy}
									letter={letter}
									isCenter={false}
									r={52}
									rotation={rotation}
									onClick={() => {}}
								/>
							</svg>
							<p
								style={{
									margin: "4px 0 0",
									fontSize: 10,
									fontFamily: "var(--font-b)",
									color: "var(--muted)",
									letterSpacing: "0.08em",
								}}
							>
								{angle}° · {ROTATION_LABELS[angle]}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export const Rotations: Story = {
	render: () => <RotationsSpecimen />,
};

// ─── Full flower ──────────────────────────────────────────────────

const PETAL_DISTANCE = 55;
const CENTER_R = 52;
const SVG_CX = 185;
const SVG_CY = 185;
const START_ANGLE = -90;
const OUTER_ANGLES = Array.from({ length: 6 }, (_, i) => START_ANGLE + i * 60);

function FlowerSpecimen() {
	const outerCenters = OUTER_ANGLES.map((deg) => {
		const rad = (Math.PI / 180) * deg;
		return {
			x: SVG_CX + PETAL_DISTANCE * Math.cos(rad),
			y: SVG_CY + PETAL_DISTANCE * Math.sin(rad),
			rotation: deg + 90,
		};
	});

	const outerLetters = ["В", "А", "Л", "О", "Ш", "К"];

	return (
		<div style={{ padding: 40, background: "var(--bg)", minHeight: "100vh" }}>
			<p style={lab()}>Full cornflower</p>
			<p
				style={{
					fontSize: 11,
					color: "var(--muted)",
					margin: "0 0 32px",
					fontFamily: "var(--font-b)",
					lineHeight: 1.6,
					maxWidth: 520,
				}}
			>
				Center hexagon surrounded by 6 petals. This is the complete Valoshka
				game board — the required center letter with 6 optional outer letters.
			</p>
			<svg
				viewBox="0 0 370 370"
				style={{
					width: 320,
					height: 320,
					overflow: "visible",
					display: "block",
				}}
			>
				<title>Поўная дошка Валошкі</title>
				{outerCenters.map((pos, i) => (
					<PetalCell
						key={outerLetters[i]}
						cx={pos.x}
						cy={pos.y}
						letter={outerLetters[i]}
						isCenter={false}
						r={CENTER_R}
						rotation={pos.rotation}
						onClick={() => {}}
					/>
				))}
				<PetalCell
					cx={SVG_CX}
					cy={SVG_CY}
					letter="А"
					isCenter
					r={CENTER_R}
					onClick={() => {}}
				/>
			</svg>
		</div>
	);
}

export const FullFlower: Story = {
	render: () => <FlowerSpecimen />,
};

// ─── Playground ───────────────────────────────────────────────────

export const Playground: Story = {
	render: (args) => (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				minHeight: "100vh",
				display: "flex",
				alignItems: "flex-start",
			}}
		>
			<svg
				viewBox="0 0 200 240"
				style={{ width: 200, height: 240, overflow: "visible" }}
			>
				<title>Пялёстак Валошкі</title>
				<PetalCell {...args} cx={100} cy={args.isCenter ? 100 : 150} />
			</svg>
		</div>
	),
};
