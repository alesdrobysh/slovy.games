"use client";

interface StatCardProps {
	label: string;
	value: number | string;
}

export function StatCard({ label, value }: StatCardProps) {
	return (
		<div className="bg-card ring-1 ring-rule rounded-2xl p-5 text-center sm:text-left">
			<p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-1 font-medium">
				{label}
			</p>
			<p className="font-display text-3xl font-medium text-ink">{value}</p>
		</div>
	);
}
