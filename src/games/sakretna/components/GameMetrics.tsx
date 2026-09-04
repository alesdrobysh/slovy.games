import { titleLemmas } from "../lib/tokenize";
import type { ArticleToken } from "../types";

interface GameMetricsProps {
	guesses: number;
	foundLemmas: ReadonlySet<string>;
	tokens: ArticleToken[];
	title: string;
	hintsUsed: number;
}

export function GameMetrics({
	guesses,
	foundLemmas,
	tokens,
	title,
	hintsUsed,
}: GameMetricsProps) {
	const hits = tokens.reduce(
		(total, token) =>
			token.type === "word" &&
			token.lemma &&
			!token.isFree &&
			foundLemmas.has(token.lemma)
				? total + 1
				: total,
		0
	);
	const requiredTitle = titleLemmas(title);
	const foundTitle = [...requiredTitle].filter((lemma) =>
		foundLemmas.has(lemma)
	).length;

	return (
		<dl
			className="flex flex-wrap gap-x-flow-lg gap-y-flow-xs text-sm text-ink-muted"
			aria-live="polite"
			aria-atomic="true"
		>
			<div className="flex gap-flow-xs">
				<dt>Спробы</dt>
				<dd className="font-semibold text-ink">{guesses}</dd>
			</div>
			<div className="flex gap-flow-xs">
				<dt>Раскрыцці</dt>
				<dd className="font-semibold text-ink">{hits}</dd>
			</div>
			<div className="flex gap-flow-xs">
				<dt>Назва</dt>
				<dd className="font-semibold text-ink">
					{foundTitle}/{requiredTitle.size}
				</dd>
			</div>
			{hintsUsed > 0 && (
				<div className="text-sakretna">
					<dt className="sr-only">Падказка</dt>
					<dd>З падказкай</dd>
				</div>
			)}
		</dl>
	);
}
