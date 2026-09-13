import type { CSSProperties, ElementType, ReactNode } from "react";

export type TypographyVariant =
	| "titleHero"
	| "title"
	| "heading"
	| "subheading"
	| "displaySm"
	| "displayHeading"
	| "displayHuge"
	| "metric"
	| "overline"
	| "body"
	| "bodyCentered"
	| "caption"
	| "smallSerif"
	| "label"
	| "gameInput"
	| "statHero";

interface VariantConfig {
	style: CSSProperties;
	tag: ElementType;
}

const D = "var(--font-d)";
const B = "var(--font-b)";

const VARIANTS: Record<TypographyVariant, VariantConfig> = {
	titleHero: {
		tag: "h1",
		style: {
			fontFamily: D,
			fontWeight: 500,
			fontSize: "clamp(36px, 8vw, 72px)",
			lineHeight: 1,
			letterSpacing: "-0.03em",
			margin: "0 0 2rem 0",
		},
	},
	title: {
		tag: "h2",
		style: {
			fontFamily: D,
			fontStyle: "italic",
			fontWeight: 500,
			fontSize: "clamp(32px, 5vw, 42px)",
			lineHeight: 0.9,
			letterSpacing: "-0.03em",
			margin: "0 0 1.5rem 0",
		},
	},
	heading: {
		tag: "h3",
		style: {
			fontFamily: D,
			fontWeight: 500,
			fontSize: "24px",
			lineHeight: 1,
			margin: "0 0 0.75rem 0",
		},
	},
	subheading: {
		tag: "h3",
		style: {
			fontFamily: D,
			fontWeight: 500,
			fontSize: "18px",
			lineHeight: 1.2,
			margin: "0 0 0.75rem 0",
		},
	},
	displaySm: {
		tag: "span",
		style: {
			fontFamily: D,
			fontWeight: 500,
			fontSize: "16px",
			lineHeight: 1.2,
			margin: 0,
		},
	},
	displayHeading: {
		tag: "h2",
		style: {
			fontFamily: D,
			fontStyle: "italic",
			fontWeight: 500,
			fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
			lineHeight: 0.88,
			letterSpacing: "-0.03em",
			margin: 0,
		},
	},
	displayHuge: {
		tag: "p",
		style: {
			fontFamily: D,
			fontWeight: 500,
			fontSize: "clamp(5rem, 24vw, 12rem)",
			lineHeight: 0.85,
			letterSpacing: "-0.04em",
			margin: 0,
		},
	},
	metric: {
		tag: "p",
		style: {
			fontFamily: D,
			fontWeight: 500,
			fontSize: "clamp(24px, 5vw, 48px)",
			lineHeight: 0.95,
			margin: 0,
		},
	},
	overline: {
		tag: "span",
		style: {
			fontFamily: B,
			fontWeight: 500,
			fontSize: "10px",
			letterSpacing: "0.2em",
			textTransform: "uppercase",
			margin: 0,
		},
	},
	body: {
		tag: "p",
		style: {
			fontFamily: B,
			fontStyle: "normal",
			fontWeight: 400,
			fontSize: "14.5px",
			lineHeight: 1.65,
			textAlign: "justify",
			hyphens: "auto",
			margin: 0,
		},
	},
	bodyCentered: {
		tag: "p",
		style: {
			fontFamily: B,
			fontWeight: 400,
			fontSize: "clamp(0.95rem, 2.6vw, 1.2rem)",
			lineHeight: 1.65,
			textAlign: "center",
			margin: 0,
		},
	},
	caption: {
		tag: "p",
		style: {
			fontFamily: B,
			fontStyle: "italic",
			fontWeight: 400,
			fontSize: "14px",
			lineHeight: 1.65,
			margin: 0,
		},
	},
	label: {
		tag: "span",
		style: {
			fontFamily: B,
			fontWeight: 400,
			fontSize: "12px",
			lineHeight: 1.5,
			margin: 0,
		},
	},
	smallSerif: {
		tag: "span",
		style: {
			fontFamily: D,
			fontWeight: 500,
			fontSize: "14px",
			lineHeight: 1,
			margin: 0,
		},
	},
	gameInput: {
		tag: "span",
		style: {
			fontFamily: D,
			fontWeight: 500,
			fontSize: "40px",
			lineHeight: 1,
			letterSpacing: "0.01em",
			margin: 0,
		},
	},
	statHero: {
		tag: "span",
		style: {
			fontFamily: D,
			fontWeight: 500,
			fontSize: "clamp(64px, 20vw, 140px)",
			lineHeight: 0.85,
			letterSpacing: "-0.04em",
			margin: 0,
		},
	},
};

export interface TypographyProps {
	variant: TypographyVariant;
	as?: ElementType;
	children: ReactNode;
	dropCap?: boolean;
	game?: "pobach" | "valoshka" | "sakretna";
	oldstyleNums?: boolean;
	className?: string;
	style?: CSSProperties;
	[key: string]: unknown;
}

export function Typography({
	variant,
	as,
	children,
	dropCap = false,
	game,
	oldstyleNums = false,
	className,
	style,
	...rest
}: TypographyProps) {
	const config = VARIANTS[variant];
	const Tag = as ?? config.tag;

	const combinedStyle: CSSProperties = {
		...config.style,
		...(oldstyleNums && { fontVariantNumeric: "oldstyle-nums" }),
		...style,
	};

	const classes =
		[dropCap && "typo-drop-cap", dropCap && game && `game-${game}`, className]
			.filter(Boolean)
			.join(" ") || undefined;

	let content = children;
	if (dropCap && typeof children === "string") {
		const spaceIdx = children.indexOf(" ");
		if (spaceIdx !== -1) {
			content = (
				<>
					<span className="drop-cap-first-word">
						{children.slice(0, spaceIdx)}
					</span>
					{children.slice(spaceIdx)}
				</>
			);
		}
	}

	return (
		<Tag style={combinedStyle} className={classes} {...rest}>
			{content}
		</Tag>
	);
}
