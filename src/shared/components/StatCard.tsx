"use client";

interface StatCardProps {
	label: string;
	value: number;
}

export function StatCard({ label, value }: StatCardProps) {
	return (
		<div
			className="flex flex-col gap-1"
			style={{
				background: "var(--sly-bg-card)",
				border: "1px solid var(--sly-border)",
				borderRadius: "12px",
				padding: "20px 24px",
			}}
		>
			<span
				className="text-xs font-semibold uppercase tracking-wider"
				style={{ color: "var(--sly-text-muted)" }}
			>
				{label}
			</span>
			<span
				className="text-3xl font-bold"
				style={{
					fontFamily: "var(--sly-font-display)",
					color: "var(--sly-text)",
				}}
			>
				{value}
			</span>
		</div>
	);
}
