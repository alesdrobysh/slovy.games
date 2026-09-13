import { Typography } from "@/shared/components/ui/Typography";

export interface StatCardProps {
	label: string;
	value: string | number;
	className?: string;
	appearance?: "default" | "wrapped";
}

export function StatCard({
	label,
	value,
	className,
	appearance = "default",
}: StatCardProps) {
	const wrapped = appearance === "wrapped";
	return (
		<div
			className={`flex flex-col gap-flow-xs p-inset-md ${wrapped ? "" : "rounded-2xl bg-card text-ink ring-1 ring-rule"} ${className ?? ""}`}
		>
			<Typography variant="overline">{label}</Typography>
			<Typography variant={wrapped ? "metric" : "heading"}>{value}</Typography>
		</div>
	);
}
