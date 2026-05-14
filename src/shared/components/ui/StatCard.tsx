import { Typography } from "@/shared/components/ui/Typography";

export interface StatCardProps {
	label: string;
	value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
	return (
		<div className="flex flex-col gap-1 rounded-2xl p-5 bg-card ring-1 ring-rule">
			<Typography variant="overline">
				{label}
			</Typography>
			<Typography variant="heading" className="text-ink">
				{value}
			</Typography>
		</div>
	);
}
