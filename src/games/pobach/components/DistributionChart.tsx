type DistributionRange = {
	label: string;
	min: number;
	max: number;
	color: string;
};

const DISTRIBUTION_RANGES: DistributionRange[] = [
	{ label: "1", min: 1, max: 1, color: "var(--attempts-1)" },
	{ label: "2–10", min: 2, max: 10, color: "var(--attempts-10)" },
	{ label: "11–50", min: 11, max: 50, color: "var(--attempts-50)" },
	{ label: "51–100", min: 51, max: 100, color: "var(--attempts-100)" },
	{ label: "100+", min: 101, max: Infinity, color: "var(--attempts-many)" },
];

function getCountForRange(
	distribution: Record<number, number>,
	min: number,
	max: number
): number {
	let count = 0;
	for (const [attempts, value] of Object.entries(distribution)) {
		const num = Number(attempts);
		if (num >= min && num <= max) count += value;
	}
	return count;
}

export function DistributionChart({
	distribution,
}: {
	distribution: Record<number, number>;
}) {
	const rangeCounts = DISTRIBUTION_RANGES.map((range) => ({
		...range,
		count: getCountForRange(distribution, range.min, range.max),
	}));
	const maxCount = Math.max(...rangeCounts.map((r) => r.count), 1);

	return (
		<div className="space-y-flow-sm">
			{rangeCounts.map((range) => {
				const percentage =
					range.count > 0
						? Math.max(Math.round((range.count / maxCount) * 100), 8)
						: 0;

				return (
					<div key={range.label} className="flex items-center gap-flow-md text-sm">
						<div className="w-14 text-right text-ink-muted shrink-0 whitespace-nowrap font-display tabular-nums">
							{range.label}
						</div>
						<div className="flex-1 h-10 bg-rule rounded-lg overflow-hidden relative">
							{range.count > 0 ? (
								<div
									className="h-full min-w-12 rounded-lg flex items-center justify-end pr-inset-sm transition-all duration-500"
									style={{
										width: `${percentage}%`,
										backgroundColor: range.color,
									}}
									role="progressbar"
									aria-valuenow={range.count}
									aria-valuemin={0}
									aria-valuemax={maxCount}
								>
									<span className="text-white font-bold text-sm font-display">
										{range.count}
									</span>
								</div>
							) : (
								<div
									className="h-full w-12 rounded-lg flex items-center justify-center"
									style={{ backgroundColor: range.color }}
									role="progressbar"
									aria-valuenow={0}
									aria-valuemin={0}
									aria-valuemax={maxCount}
								>
									<span className="text-white font-bold text-sm font-display">
										0
									</span>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
