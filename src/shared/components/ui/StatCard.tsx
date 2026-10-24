import { Typography } from "@/shared/components/ui/Typography";

export interface StatCardProps {
	label: string;
	value: string | number;
	/** Small print under the value. */
	caption?: string;
	/** Words shown as chips under the caption. */
	words?: string[];
	/** A larger value, for the card that leads a group. Wrapped only. */
	prominent?: boolean;
	className?: string;
	appearance?: "default" | "wrapped";
}

export function StatCard({
	label,
	value,
	caption,
	words,
	prominent = false,
	className,
	appearance = "default",
}: StatCardProps) {
	const wrapped = appearance === "wrapped";
	const valueVariant = !wrapped
		? "heading"
		: prominent
			? "displayMd"
			: "metric";
	return (
		<div
			className={`flex flex-col gap-flow-xs p-inset-md ${wrapped ? "" : "rounded-2xl bg-card text-ink ring-1 ring-rule"} ${className ?? ""}`}
		>
			<Typography variant="overline">{label}</Typography>
			<Typography variant={valueVariant}>{value}</Typography>
			{caption && <Typography variant="label">{caption}</Typography>}
			{words && words.length > 0 && (
				<div className="flex flex-wrap justify-center gap-flow-sm">
					{words.map((word) => (
						<span
							key={word}
							className="rounded-full border border-current px-inset-xs py-flow-xs"
						>
							<Typography variant="displaySm">{word}</Typography>
						</span>
					))}
				</div>
			)}
		</div>
	);
}
