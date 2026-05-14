import { Typography } from "@/shared/components/ui/Typography";

export interface StatCardProps {
	label: string;
	value: string | number;
}

export function StatCard({ label, value }: StatCardProps) {
	return (
		<div className="flex flex-col gap-flow-xs rounded-2xl p-inset-md bg-card ring-1 ring-rule">
			<Typography variant="overline">
				{label}
			</Typography>
			<Typography variant="heading" className="text-ink">
				{value}
			</Typography>
		</div>
	);
}
