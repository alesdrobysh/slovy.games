"use client";

import { buildHintGrid } from "@/games/valoshka/lib/hint-grid";
import { Modal } from "@/shared/components/ui/Modal";
import { Typography } from "@/shared/components/ui/Typography";
import { pluralize } from "@/shared/lib/pluralize";
import { useDictReady } from "@/shared/hooks/useDictReady";

interface CompanionGridProps {
	isOpen: boolean;
	onClose: () => void;
	answers: string[];
	foundWords: string[];
	pangrams: string[];
}

export function CompanionGrid({
	isOpen,
	onClose,
	answers,
	foundWords,
	pangrams,
}: CompanionGridProps) {
	"use no memo";
	useDictReady();
	const grid = buildHintGrid(answers, foundWords, pangrams);

	const firstLetters = Array.from(grid.firstLetterGrid.keys()).sort();
	const lengths = Array.from(grid.lengthCounts.keys()).sort((a, b) => a - b);
	const prefixes = Array.from(grid.prefixCounts.keys()).sort();

	if (lengths.length === 0) {
		return (
			<Modal isOpen={isOpen} onClose={onClose} title="Сетка слоў">
				<Typography variant="body">
					Усе словы знойдзены для сённяшняй галаваломкі.
				</Typography>
			</Modal>
		);
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Сетка слоў">
			<div className="flex flex-col gap-y-inset-sm">
				<div className="overflow-x-auto">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr>
								<th className="text-left px-1 py-0.5 text-(--muted) font-normal text-xs w-6" />
								{lengths.map((len) => (
									<th
										key={len}
										className="text-center px-1 py-0.5 text-(--muted) font-normal text-xs"
									>
										{len}
									</th>
								))}
								<th className="text-center px-1 py-0.5 text-(--muted) font-normal text-xs">
									Σ
								</th>
							</tr>
						</thead>
						<tbody>
							{firstLetters.map((letter) => {
								const row = grid.firstLetterGrid.get(letter);
								if (!row) return null;
								const rowTotal = lengths.reduce(
									(sum, len) => sum + (row.get(len) ?? 0),
									0
								);
								return (
									<tr key={letter}>
										<td className="text-left px-1 py-0.5 font-semibold uppercase">
											{letter}
										</td>
										{lengths.map((len) => (
											<td key={len} className="text-center px-1 py-0.5">
												{row.get(len) ?? "·"}
											</td>
										))}
										<td className="text-center px-1 py-0.5 text-(--muted)">
											{rowTotal}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				{grid.unfoundPangramCount > 0 && (
					<Typography variant="body">
						{pluralize(grid.unfoundPangramCount, "панграма")} яшчэ не знойдзена
					</Typography>
				)}

				{prefixes.length > 0 && (
					<div>
						<Typography variant="overline" as="span" className="text-(--muted)">
							Дзвюхлітарныя пачаткі
						</Typography>
						<div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-flow-2xs">
							{prefixes.map((prefix) => (
								<span key={prefix} className="text-sm">
									{prefix}-{grid.prefixCounts.get(prefix)}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
}
