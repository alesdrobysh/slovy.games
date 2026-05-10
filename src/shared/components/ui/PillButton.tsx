import type { ReactNode } from "react";

export interface PillButtonProps {
	children: ReactNode;
	variant?: "primary" | "accent" | "ghost";
	size?: "sm" | "md";
	onClick: () => void;
	disabled?: boolean;
	icon?: ReactNode;
}

const variantClasses = {
	primary: "bg-[var(--sly-accent)] text-white hover:opacity-90",
	accent:
		"text-[var(--sly-accent)] border border-[var(--sly-accent)] hover:bg-[var(--sly-accent)]/5",
	ghost:
		"text-[var(--sly-text-muted)] border border-[var(--sly-border)] hover:bg-[var(--sly-border)]",
} as const;

const sizeClasses = {
	sm: "px-3 py-1 text-xs",
	md: "px-4 py-2 text-sm",
} as const;

export function PillButton({
	children,
	variant = "accent",
	size = "sm",
	onClick,
	disabled = false,
	icon,
}: PillButtonProps) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			type="button"
			className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]}`}
		>
			{icon}
			{children}
		</button>
	);
}
