import { BookOpen } from "lucide-react";
import type { Guess } from "@/games/pobach/core/entities/game";
import GuessCard from "./GuessCard";

type GuessListProps = {
  guesses: Guess[];
};

export default function GuessList({ guesses }: GuessListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        {guesses.length > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <BookOpen size={12} />
            <span className="hidden sm:inline">Слоўнік па кліку на слова</span>
            <span className="sm:hidden">Націсніце на слова</span>
          </span>
        )}
        <output
          aria-live="polite"
          aria-label={`Колькасць спроб: ${guesses.length}`}
          className="text-sm font-medium text-[var(--accent)] ml-auto"
        >
          Спроб: {guesses.length}
        </output>
      </div>
      <ul aria-label="Спіс здагадак" className="flex flex-col gap-2">
        {guesses.map((guess) => (
          <li key={guess.word}>
            <GuessCard guess={guess} isWin={guess.rank === 1} />
          </li>
        ))}
      </ul>
    </div>
  );
}
