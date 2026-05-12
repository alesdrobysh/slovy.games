export interface StatCardProps {
	label: string;
	value: string | number;
	accent?: boolean;
}

export function StatCard({ label, value, accent = false }: StatCardProps) {
	return (
		<div className="flex flex-col gap-1 rounded-2xl p-5 bg-card ring-1 ring-rule">
			<span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-soft">
				{label}
			</span>
			<span
				className={`font-display text-2xl font-medium ${accent ? "text-pobach" : "text-ink"}`}
			>
				{value}
			</span>
		</div>
	);
}
