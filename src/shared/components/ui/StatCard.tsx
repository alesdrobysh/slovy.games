export interface StatCardProps {
	label: string;
	value: string | number;
	accent?: boolean;
}

export function StatCard({ label, value, accent = false }: StatCardProps) {
	return (
		<div
			className="flex flex-col gap-1 rounded-xl p-4"
			style={{
				background: "var(--sly-bg-card)",
				border: "1px solid var(--sly-border)",
			}}
		>
			<span className="text-xs font-semibold uppercase tracking-wider text-[var(--sly-text-muted)]">
				{label}
			</span>
			<span
				className={`text-2xl font-bold [font-family:var(--sly-font-display)] ${accent ? "text-[var(--sly-accent)]" : "text-[var(--sly-text)]"}`}
			>
				{value}
			</span>
		</div>
	);
}
