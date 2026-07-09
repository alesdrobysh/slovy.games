import { BookOpen } from "lucide-react";
import type { Guess } from "@/games/pobach/core/entities/game";
import { Typography } from "@/shared/components/ui/Typography";
import GuessCard from "./GuessCard";
import { pluralize } from "@/shared/lib/pluralize";
import { useDictReady } from "@/shared/hooks/useDictReady";

type GuessListProps = {
	guesses: Guess[];
	lastGuess?: string | null;
};

export default function GuessList({ guesses, lastGuess }: GuessListProps) {
	"use no memo";
	useDictReady();
	return (
		<div>
			<div className="flex items-center justify-between mb-flow-md">
				{guesses.length > 0 && (
					<Typography
						variant="overline"
						as="span"
						className="flex items-center gap-flow-xs text-ink-muted normal-case tracking-normal"
					>
						<BookOpen size={12} />
						<span className="hidden sm:inline">Слоўнік па кліку на слова</span>
						<span className="sm:hidden">Націсніце на слова</span>
					</Typography>
				)}
				<output
					aria-live="polite"
					aria-label={`Колькасць спроб: ${guesses.length}`}
					className="ml-auto"
				>
					<Typography variant="overline" as="span" className="text-pobach">
						{guesses.length} {pluralize(guesses.length, "спроба")}
					</Typography>
				</output>
			</div>
			<ul aria-label="Спіс здагадак" className="flex flex-col gap-flow-sm">
				{guesses.map((guess) => (
					<li key={guess.word}>
						<GuessCard guess={guess} highlight={guess.word === lastGuess} />
					</li>
				))}
			</ul>
		</div>
	);
}
