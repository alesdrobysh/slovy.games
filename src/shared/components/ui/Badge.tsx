import type { ReactNode } from "react";

export interface BadgeProps {
	children: ReactNode;
	variant?: "accent" | "success" | "neutral";
}

export function Badge({ children, variant = "accent" }: BadgeProps) {
	const variantStyles = {
		accent: "bg-valoshka/5 text-valoshka border border-valoshka/20",
		success: "bg-success/5 text-success border border-success/20",
		neutral: "bg-ink/5 text-ink-muted border border-rule",
	};

	return (
		<span
			className={`text-[10px] uppercase tracking-[0.2em] font-bold rounded-lg px-inset-xs py-0.5 ${variantStyles[variant]}`}
		>
			{children}
		</span>
	);
}
