import type { ReactNode } from "react";

export interface BadgeProps {
	children: ReactNode;
	variant?: "accent" | "success" | "neutral";
}

export function Badge({ children, variant = "accent" }: BadgeProps) {
	const variantStyles = {
		accent: "bg-valoshka-soft text-valoshka ring-1 ring-valoshka/20",
		success: "bg-success/10 text-success ring-1 ring-success/20",
		neutral: "bg-secondary text-ink-muted ring-1 ring-rule",
	};

	return (
		<span
			className={`text-xs font-semibold uppercase tracking-wider rounded-full px-2.5 py-1 ${variantStyles[variant]}`}
		>
			{children}
		</span>
	);
}
