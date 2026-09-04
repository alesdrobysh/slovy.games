import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Lightbulb, Share2, Shuffle } from "lucide-react";
import type {
	ButtonColor,
	ButtonSize,
	ButtonVariant,
} from "@/shared/components/ui/Button";
import { Button } from "@/shared/components/ui/Button";

const meta = {
	title: "Design/Buttons",
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "radio" },
			options: ["solid", "outline", "ghost"],
		},
		color: {
			control: { type: "radio" },
			options: ["primary", "neutral"],
		},
		size: {
			control: { type: "radio" },
			options: ["sm", "md", "lg"],
		},
		dashed: {
			control: { type: "boolean" },
		},
		disabled: {
			control: { type: "boolean" },
		},
		children: {
			control: { type: "text" },
		},
	},
	args: {
		variant: "solid",
		color: "primary",
		size: "md",
		dashed: false,
		disabled: false,
		children: "Адгадаць",
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

const SUBMIT_LABEL = "Адгадаць";
const PLAY_LABEL = "Гуляць";
const ACTION_LABEL = "Падказка";
const GIVE_UP_LABEL = "Здацца";

const lab = (_s: string) => ({
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
	gridTemplateColumns: "120px 1fr",
	gap: "0 24px",
	alignItems: "center" as const,
	padding: "16px 0",
	borderTop: "1px solid var(--border)",
};

// ─── Variant × Color matrix ───────────────────────────────────────

interface MatrixCell {
	variant: ButtonVariant;
	color: ButtonColor;
	label: string;
	spec: string;
	isIcon?: boolean;
}

const MATRIX: MatrixCell[] = [
	{
		variant: "solid",
		color: "primary",
		label: "solid + primary",
		spec: "Filled accent · white label · opacity 0.86 hover · exactly one per screen",
	},
	{
		variant: "outline",
		color: "primary",
		label: "outline + primary",
		spec: "Accent border + label · transparent fill · inverts on hover (accent fill, white label)",
	},
	{
		variant: "outline",
		color: "neutral",
		label: "outline + neutral",
		spec: "border-strong outline · surface fill · fg-2 label · surface-warm hover",
	},
	{
		variant: "outline",
		color: "neutral",
		label: "outline + neutral + dashed",
		spec: "Dashed border-strong · muted label · 'you probably shouldn't press this'",
	},
	{
		variant: "ghost",
		color: "neutral",
		label: "ghost + neutral",
		spec: "No chrome at rest · surface-warm fill + fg icon on hover · nav icon buttons · 28×28",
		isIcon: true,
	},
	{
		variant: "ghost",
		color: "primary",
		label: "ghost + primary",
		spec: "No chrome · small-caps link · gains accent color on hover · back navigation",
	},
];

function HierarchySpecimen() {
	return (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				minHeight: "100vh",
			}}
		>
			<p style={lab("Button Hierarchy")}>Variant × Color</p>
			<p
				style={{
					fontSize: 11,
					color: "var(--muted)",
					margin: "0 0 24px",
					fontFamily: "var(--font-b)",
					lineHeight: 1.6,
					maxWidth: 560,
				}}
			>
				Composable from two axes: <strong>variant</strong> (solid | outline |
				ghost) and <strong>color</strong> (primary | neutral). Primary color
				resolves to the game&rsquo;s accent ink (terracotta for Побач,
				cornflower for Валошка). Icon-only buttons auto-size to 28×28px.
			</p>

			{MATRIX.map(({ variant, color, label, spec, isIcon }) => (
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
							.{label}
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
					<div>
						{isIcon ? (
							<div style={{ display: "flex", gap: 8 }}>
								<Button
									variant={variant}
									color={color}
									aria-label="Падзяліцца"
									onClick={() => {}}
									startIcon={<Share2 size={20} />}
								/>
								<Button
									variant={variant}
									color={color}
									aria-label="Падказка"
									onClick={() => {}}
									startIcon={<Lightbulb size={20} />}
								/>
								<Button
									variant={variant}
									color={color}
									aria-label="Змяшаць"
									onClick={() => {}}
									startIcon={<Shuffle size={20} />}
								/>
							</div>
						) : label.includes("dashed") ? (
							<Button variant={variant} color={color} dashed onClick={() => {}}>
								{GIVE_UP_LABEL}
							</Button>
						) : (
							<Button variant={variant} color={color} onClick={() => {}}>
								{variant === "solid" && color === "primary"
									? SUBMIT_LABEL
									: variant === "outline" && color === "primary"
										? PLAY_LABEL
										: variant === "ghost" && color === "primary"
											? "← Назад"
											: ACTION_LABEL}
							</Button>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

export const Hierarchy: Story = {
	render: () => <HierarchySpecimen />,
};

// ─── Game accents ─────────────────────────────────────────────────

function AccentCard({
	game,
	accent,
	title,
}: {
	game: "pobach" | "valoshka";
	accent: string;
	title: string;
}) {
	return (
		<div
			className={game === "pobach" ? "theme-pobach" : ""}
			style={{
				background: "var(--surface)",
				border: "1px solid var(--border)",
				borderRadius: 12,
				padding: 28,
				flex: 1,
				minWidth: 280,
			}}
		>
			<span
				style={{
					display: "block",
					fontFamily: "var(--font-b)",
					fontSize: 11,
					fontVariantCaps: "small-caps",
					letterSpacing: "0.13em",
					color: accent,
					marginBottom: 16,
				}}
			>
				{title}
			</span>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 12,
				}}
			>
				<Button variant="solid" color="primary" onClick={() => {}}>
					{SUBMIT_LABEL}
				</Button>
				<Button variant="outline" color="primary" onClick={() => {}}>
					{PLAY_LABEL}
				</Button>
				<Button variant="outline" color="neutral" onClick={() => {}}>
					{ACTION_LABEL}
				</Button>
				<Button variant="outline" color="neutral" dashed onClick={() => {}}>
					{GIVE_UP_LABEL}
				</Button>
			</div>
		</div>
	);
}

function AccentSpecimen() {
	return (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				display: "flex",
				gap: 24,
				flexWrap: "wrap",
			}}
		>
			<AccentCard
				game="pobach"
				accent="var(--pobach)"
				title="Побач — terracotta"
			/>
			<AccentCard
				game="valoshka"
				accent="var(--valoshka)"
				title="Валошка — cornflower"
			/>
		</div>
	);
}

export const GameAccents: Story = {
	render: () => <AccentSpecimen />,
};

// ─── Sizes ────────────────────────────────────────────────────────

const SIZE_ROWS: {
	variant: ButtonVariant;
	color: ButtonColor;
	label: string;
	sample: string;
}[] = [
	{
		variant: "solid",
		color: "primary",
		label: "solid primary",
		sample: SUBMIT_LABEL,
	},
	{
		variant: "outline",
		color: "primary",
		label: "outline primary",
		sample: PLAY_LABEL,
	},
	{
		variant: "outline",
		color: "neutral",
		label: "outline neutral",
		sample: ACTION_LABEL,
	},
	{
		variant: "ghost",
		color: "primary",
		label: "ghost primary",
		sample: "← Назад",
	},
];

const SIZES: { size: ButtonSize; spec: string }[] = [
	{ size: "sm", spec: "28px · 4/10 padding · 10px · r6" },
	{ size: "md", spec: "32px · 8/12 padding · 12px · r8" },
	{ size: "lg", spec: "36px · 9/18 padding · 14px · r10" },
	{ size: "xl", spec: "54px · 12/20 padding · 16px · r14" },
];

function SizesSpecimen() {
	return (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				minHeight: "100vh",
			}}
		>
			<p style={lab("Sizes")}>Sizes</p>
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
				Four size steps — sm (compact), md (default), lg (prominent), xl (hero).
				Icon-only buttons stay square at the size's height.
			</p>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "120px repeat(4, 1fr)",
					gap: "0 16px",
					padding: "0 0 8px",
					alignItems: "end",
				}}
			>
				<span />
				{SIZES.map((s) => (
					<div key={s.size}>
						<code
							style={{
								fontSize: 10,
								fontFamily: "monospace",
								color: "var(--muted)",
							}}
						>
							{s.size}
						</code>
						<p
							style={{
								fontSize: 10,
								color: "var(--fg-2)",
								margin: "2px 0 0",
								fontFamily: "var(--font-b)",
								lineHeight: 1.4,
							}}
						>
							{s.spec}
						</p>
					</div>
				))}
			</div>

			{SIZE_ROWS.map(({ variant, color, label, sample }) => (
				<div
					key={label}
					style={{
						display: "grid",
						gridTemplateColumns: "120px repeat(4, 1fr)",
						gap: "0 16px",
						alignItems: "center",
						padding: "14px 0",
						borderTop: "1px solid var(--border)",
					}}
				>
					<code
						style={{
							fontSize: 10,
							fontFamily: "monospace",
							color: "var(--muted)",
						}}
					>
						{label}
					</code>
					{SIZES.map((s) => (
						<div key={s.size}>
							<Button
								variant={variant}
								color={color}
								size={s.size}
								onClick={() => {}}
							>
								{sample}
							</Button>
						</div>
					))}
				</div>
			))}

			{/* Icon-only — one per size column */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "120px repeat(4, 1fr)",
					gap: "0 16px",
					alignItems: "center",
					padding: "14px 0",
					borderTop: "1px solid var(--border)",
				}}
			>
				<code
					style={{
						fontSize: 10,
						fontFamily: "monospace",
						color: "var(--muted)",
					}}
				>
					icon-only
				</code>
				{SIZES.map((s) => (
					<div key={s.size}>
						<Button
							variant="solid"
							color="primary"
							size={s.size}
							aria-label="Submit"
							onClick={() => {}}
							startIcon={<Share2 />}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export const Sizes: Story = {
	render: () => <SizesSpecimen />,
};

// ─── States ───────────────────────────────────────────────────────

const STATES: {
	variant: ButtonVariant;
	color: ButtonColor;
	label: string;
}[] = [
	{ variant: "solid", color: "primary", label: "solid primary" },
	{ variant: "outline", color: "primary", label: "outline primary" },
	{ variant: "outline", color: "neutral", label: "outline neutral" },
	{ variant: "ghost", color: "primary", label: "ghost primary" },
	{ variant: "ghost", color: "neutral", label: "ghost neutral" },
];

function StateRow({
	variant,
	color,
	label,
}: {
	variant: ButtonVariant;
	color: ButtonColor;
	label: string;
}) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "130px 120px 120px 120px",
				gap: 16,
				alignItems: "center",
				padding: "12px 0",
				borderTop: "1px solid var(--border)",
			}}
		>
			<code
				style={{
					fontSize: 10,
					fontFamily: "monospace",
					color: "var(--muted)",
				}}
			>
				{label}
			</code>
			<Button variant={variant} color={color} onClick={() => {}} size="sm">
				Rest
			</Button>
			<div className="hover-demo" style={{ pointerEvents: "none" }}>
				<Button variant={variant} color={color} onClick={() => {}} size="sm">
					Hover
				</Button>
			</div>
			<Button
				variant={variant}
				color={color}
				disabled
				onClick={() => {}}
				size="sm"
			>
				Disabled
			</Button>
		</div>
	);
}

function StatesSpecimen() {
	return (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				minHeight: "100vh",
			}}
		>
			<p style={lab("States")}>States</p>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "130px 120px 120px 120px",
					gap: 16,
					padding: "0 0 4px",
				}}
			>
				<span />
				<span
					style={{
						fontSize: 10,
						fontFamily: "monospace",
						color: "var(--muted)",
					}}
				>
					Rest
				</span>
				<span
					style={{
						fontSize: 10,
						fontFamily: "monospace",
						color: "var(--muted)",
					}}
				>
					Hover
				</span>
				<span
					style={{
						fontSize: 10,
						fontFamily: "monospace",
						color: "var(--muted)",
					}}
				>
					Disabled
				</span>
			</div>
			{STATES.map((row) => (
				<StateRow key={row.label} {...row} />
			))}

			<style>{`
				.hover-demo .btn-solid.btn-primary { opacity: 0.86; }
				.hover-demo .btn-outline.btn-primary { background: var(--accent); color: #fff; }
				.hover-demo .btn-outline.btn-neutral { background: var(--surface-warm); }
				.hover-demo .btn-ghost.btn-primary { color: var(--accent); }
				.hover-demo .btn-ghost.btn-neutral { background: var(--surface-warm); color: var(--fg); }
			`}</style>
		</div>
	);
}

export const States: Story = {
	render: () => <StatesSpecimen />,
};

// ─── Icon + Label combos ──────────────────────────────────────────

const ICON_COMBOS: {
	variant: ButtonVariant;
	color: ButtonColor;
	label: string;
}[] = [
	{ variant: "solid", color: "primary", label: "solid primary" },
	{ variant: "outline", color: "primary", label: "outline primary" },
	{ variant: "outline", color: "neutral", label: "outline neutral" },
	{ variant: "ghost", color: "primary", label: "ghost primary" },
	{ variant: "ghost", color: "neutral", label: "ghost neutral" },
];

function IconLabelSpecimen() {
	return (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				minHeight: "100vh",
			}}
		>
			<p style={lab("startIcon")}>startIcon + Label</p>
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
				Pass a lucide icon component as <code>startIcon</code>. Without children
				the button auto-sizes to 28×28px icon-only. With children it renders as
				a labeled button.
			</p>

			{ICON_COMBOS.map(({ variant, color, label }) => (
				<div
					key={label}
					style={{
						display: "flex",
						alignItems: "center",
						gap: 24,
						padding: "12px 0",
						borderTop: "1px solid var(--border)",
					}}
				>
					<code
						style={{
							width: 120,
							flexShrink: 0,
							fontSize: 10,
							fontFamily: "monospace",
							color: "var(--muted)",
						}}
					>
						{label}
					</code>
					<Button
						variant={variant}
						color={color}
						onClick={() => {}}
						startIcon={<Share2 size={16} />}
					>
						Падзяліцца
					</Button>
					<Button
						variant={variant}
						color={color}
						aria-label="Share icon-only"
						onClick={() => {}}
						startIcon={<Share2 size={20} />}
					/>
				</div>
			))}
		</div>
	);
}

export const StartIcon: Story = {
	render: () => <IconLabelSpecimen />,
};

// ─── Playground ───────────────────────────────────────────────────

export const Playground: Story = {
	args: {
		children: "Адгадаць",
	},
	render: (args) => (
		<div
			style={{
				padding: 40,
				background: "var(--bg)",
				minHeight: "100vh",
				display: "flex",
				alignItems: "flex-start",
				gap: 24,
				flexWrap: "wrap",
			}}
		>
			{/* Default theme (valoshka) */}
			<div
				style={{
					background: "var(--surface)",
					border: "1px solid var(--border)",
					borderRadius: 12,
					padding: 28,
					display: "flex",
					flexDirection: "column",
					gap: 16,
					alignItems: "flex-start",
					flex: 1,
					minWidth: 280,
				}}
			>
				<span
					style={{
						fontFamily: "var(--font-b)",
						fontSize: 11,
						fontVariantCaps: "small-caps",
						letterSpacing: "0.13em",
						color: "var(--valoshka)",
						marginBottom: 4,
					}}
				>
					Валошка (default)
				</span>
				<Button {...args} onClick={() => {}} />
				<Button {...args} disabled onClick={() => {}}>
					{args.children} disabled
				</Button>
			</div>

			{/* Pobach theme */}
			<div
				className="theme-pobach"
				style={{
					background: "var(--surface)",
					border: "1px solid var(--border)",
					borderRadius: 12,
					padding: 28,
					display: "flex",
					flexDirection: "column",
					gap: 16,
					alignItems: "flex-start",
					flex: 1,
					minWidth: 280,
				}}
			>
				<span
					style={{
						fontFamily: "var(--font-b)",
						fontSize: 11,
						fontVariantCaps: "small-caps",
						letterSpacing: "0.13em",
						color: "var(--pobach)",
						marginBottom: 4,
					}}
				>
					Побач (terracotta)
				</span>
				<Button {...args} onClick={() => {}} />
				<Button {...args} disabled onClick={() => {}}>
					{args.children} disabled
				</Button>
			</div>
		</div>
	),
};
