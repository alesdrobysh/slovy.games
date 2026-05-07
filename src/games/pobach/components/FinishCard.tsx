"use client";

import { Flame } from "lucide-react";
import Link from "next/link";
import type { Guess } from "@/games/pobach/core/entities/game";
import { getCurrentDayIndex, getStats } from "@/games/pobach/lib/storage";
import {
  pluralize,
  pluralizeHintsAccusative,
  pluralizeHintsInstrumental,
  pluralizeStreak,
} from "@/games/pobach/lib/utils";
import CountdownTimer from "./CountdownTimer";
import DictionaryLink from "./DictionaryLink";
import ShareButton from "./ShareButton";
import TopWordsList from "./TopWordsList";

type FinishCardProps = {
  dayIndex: number;
  sessionDayIndex: number | null;
  guesses: Guess[];
  mode: "win" | "lose";
  targetWord?: string;
};

export default function FinishCard({
  dayIndex,
  sessionDayIndex,
  guesses,
  mode,
  targetWord,
}: FinishCardProps) {
  const attempts = guesses.length;
  const hintsCount = guesses.filter((g) => g.isHint).length;
  const streak = mode === "win" ? getStats().currentStreak : 0;

  const currentDayIndex = getCurrentDayIndex();
  const isNewDayAvailable =
    sessionDayIndex !== null && currentDayIndex > sessionDayIndex;

  const isWin = mode === "win";

  return (
    <div
      data-testid="finish-card"
      className="mb-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden"
    >
      <div className="px-6 py-8 flex flex-col items-center text-center gap-6">
        {/* Icon */}
        {isWin ? (
          <span
            className="text-5xl animate-tada select-none"
            role="img"
            aria-label="Віншуем"
          >
            🎉
          </span>
        ) : (
          <span
            className="text-5xl select-none"
            role="img"
            aria-label="Гульня скончана"
          >
            🙁
          </span>
        )}

        {/* Heading + description */}
        <div className="space-y-2">
          <h2
            className={`font-serif text-2xl font-bold ${isWin ? "text-[var(--accent)]" : "text-[var(--text)]"}`}
          >
            {isWin ? "Віншуем!" : "Таямніца раскрыта!"}
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
            {isWin
              ? `Вы адгадалі слова за ${attempts} ${pluralize(attempts)}${hintsCount > 0 ? ` з ${hintsCount} ${pluralizeHintsInstrumental(hintsCount)}` : ""}. Заўтра будзе новае слова.`
              : `Дзякуй за гульню.${hintsCount > 0 ? ` Выкарыстана ${hintsCount} ${pluralizeHintsAccusative(hintsCount)}.` : ""} Заўтра будзе новае слова.`}
          </p>
          {!isWin && targetWord && (
            <p className="text-sm">
              Правільнае слова:{" "}
              <strong className="text-[var(--accent)] font-semibold">
                <DictionaryLink word={targetWord} />
              </strong>
            </p>
          )}
        </div>

        {/* Share */}
        <ShareButton dayIndex={dayIndex} guesses={guesses} won={isWin} />

        {/* Streak */}
        {isWin && streak > 0 && (
          <Link
            href="/stats"
            className="flex items-center gap-1.5 text-[var(--accent)] text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Flame size={16} />
            {streak} {pluralizeStreak(streak)}
          </Link>
        )}

        <div className="flex justify-center mt-2">
          <Link
            href="/stats"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            Паглядзець статыстыку
          </Link>
        </div>

        {/* Countdown / new day */}
        <div className="text-sm text-[var(--text-muted)]">
          {isNewDayAvailable ? (
            <button
              onClick={() => window.location.reload()}
              type="button"
              className="btn-primary"
            >
              Даступна новае слова! Грай зараз
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span>Наступнае слова праз</span>
              <span className="font-mono text-[var(--text)]">
                <CountdownTimer />
              </span>
            </div>
          )}
        </div>
      </div>

      <TopWordsList dayIndex={dayIndex} mode={mode} />
    </div>
  );
}
