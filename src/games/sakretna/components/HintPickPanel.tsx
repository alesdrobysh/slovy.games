"use client";

import { Button } from "@/shared/components/ui/Button";
import { Typography } from "@/shared/components/ui/Typography";

export interface PendingHint {
	lemma: string;
	length: number;
	count: number;
}

interface HintPickPanelProps {
	/** Hints left after the one being picked is spent. */
	hintsAfter: number;
	pending: PendingHint | null;
	onConfirm: () => void;
	onCancel: () => void;
}

/** Replaces the guess console while the player picks a word to open. */
export function HintPickPanel({
	hintsAfter,
	pending,
	onConfirm,
	onCancel,
}: HintPickPanelProps) {
	return (
		<section
			aria-label="Падказка"
			className="flex flex-col gap-flow-sm rounded-lg bg-sakretna-soft ring-1 ring-sakretna/35 p-inset-sm"
		>
			<div className="flex flex-col gap-flow-xs">
				<Typography variant="smallSerif" as="p" className="text-ink">
					{pending
						? `Адкрыць слова з ${pending.length} літар?`
						: "Абярыце схаваны прастакутнік"}
				</Typography>
				<Typography variant="label" as="p" className="text-ink-muted">
					{pending
						? `Усе формы слова адкрыюцца ў артыкуле. Пасля гэтага застанецца падказак: ${hintsAfter}.`
						: "Адкрыецца слова ва ўсіх формах. Словы назвы адкрыць нельга."}
				</Typography>
			</div>
			<div className="flex items-center justify-end gap-flow-sm">
				<Button variant="outline" color="neutral" size="sm" onClick={onCancel}>
					Скасаваць
				</Button>
				{pending && (
					<Button variant="solid" color="primary" size="sm" onClick={onConfirm}>
						Адкрыць слова
					</Button>
				)}
			</div>
		</section>
	);
}
