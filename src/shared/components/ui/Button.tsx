import { type ElementType, forwardRef, type ReactNode } from "react";

export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonColor = "primary" | "neutral" | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps {
	children?: ReactNode;
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
	startIcon?: ReactNode;
	/** Dashed border on outline variant (give-up style) */
	dashed?: boolean;
	onClick?: () => void;
	disabled?: boolean;
	type?: "button" | "submit";
	className?: string;
	"aria-label"?: string;
	as?: ElementType;
	href?: string;
	target?: string;
	rel?: string;
}

export const Button = forwardRef<
	HTMLButtonElement | HTMLAnchorElement,
	ButtonProps
>(function Button(
	{
		children,
		variant = "outline",
		color = "neutral",
		size = "md",
		startIcon,
		dashed = false,
		onClick,
		disabled = false,
		type = "button",
		className,
		"aria-label": ariaLabel,
		as,
		href,
		target,
		rel,
	},
	ref
) {
	const isIconOnly = !children && !!startIcon;

	const classes = [
		"btn",
		`btn-${variant}`,
		`btn-${color}`,
		`btn-${size}`,
		dashed && "btn-dashed",
		isIconOnly && "btn-icon-only",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const Tag = as ?? (href ? "a" : "button");
	const content = (
		<>
			{startIcon && <span aria-hidden="true">{startIcon}</span>}
			{children}
		</>
	);

	if (Tag === "button") {
		return (
			<button
				ref={ref as React.Ref<HTMLButtonElement>}
				type={type}
				onClick={onClick}
				disabled={disabled}
				aria-label={ariaLabel}
				className={classes}
			>
				{content}
			</button>
		);
	}

	return (
		<Tag
			ref={ref as React.Ref<HTMLAnchorElement>}
			className={classes}
			href={href}
			target={target}
			rel={rel}
			aria-label={ariaLabel}
		>
			{content}
		</Tag>
	);
});
