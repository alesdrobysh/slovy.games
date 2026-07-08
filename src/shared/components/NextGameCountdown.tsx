"use client";

import { Button } from "@/shared/components/ui/Button";
import { Typography } from "@/shared/components/ui/Typography";
import { useCountdown } from "@/shared/hooks/useCountdown";

interface NextGameCountdownProps {
	isNewDayAvailable: boolean;
	newGameLabel: string;
}

export function NextGameCountdown({
	isNewDayAvailable,
	newGameLabel,
}: NextGameCountdownProps) {
	const countdown = useCountdown();

	return (
		<div style={{ marginTop: "var(--space-flow-lg)" }}>
			{isNewDayAvailable ? (
				<Button
					variant="outline"
					color="primary"
					onClick={() => window.location.reload()}
				>
					{newGameLabel}
				</Button>
			) : (
				<div
					className="flex items-center"
					style={{ gap: "var(--space-flow-sm)" }}
				>
					<Typography variant="caption" as="span">
						Наступная гульня праз
					</Typography>
					<Typography
						variant="caption"
						as="span"
						style={{ fontVariantNumeric: "tabular-nums" }}
					>
						{countdown}
					</Typography>
				</div>
			)}
		</div>
	);
}
