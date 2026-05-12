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
	primary: "bg-valoshka text-white hover:brightness-105",
	accent: "text-valoshka ring-1 ring-valoshka/30 hover:bg-valoshka-soft",
	ghost: "text-ink-muted ring-1 ring-rule hover:bg-rule",
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
			className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all active:scale-[0.98] disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]}`}
		>
			{icon}
			{children}
		</button>
	);
}
