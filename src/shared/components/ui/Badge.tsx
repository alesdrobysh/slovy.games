import type { ReactNode } from "react";

export interface BadgeProps {
	children: ReactNode;
	variant?: "accent" | "success" | "neutral";
}

const variantStyles: Record<string, React.CSSProperties> = {
	accent: {
		background: "var(--sly-accent-subtle)",
		color: "var(--sly-accent)",
		border: "1px solid var(--sly-accent-border)",
	},
	success: {
		background: "rgba(22, 163, 74, 0.1)",
		color: "var(--sly-green-500, #16a34a)",
		border: "1px solid rgba(22, 163, 74, 0.22)",
	},
	neutral: {
		background: "var(--sly-bg-surface)",
		color: "var(--sly-text-muted)",
		border: "1px solid var(--sly-border)",
	},
};

export function Badge({ children, variant = "accent" }: BadgeProps) {
	return (
		<span
			className="text-xs font-bold uppercase tracking-wider rounded-full px-2.5 py-1"
			style={variantStyles[variant]}
		>
			{children}
		</span>
	);
}
