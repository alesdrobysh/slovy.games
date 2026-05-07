"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import type { Guess } from "@/games/pobach/core/entities/game";
import { EPOCH_DATE } from "@/games/pobach/lib/config";
import { pluralizeHintsInstrumental } from "@/games/pobach/lib/utils";

type ShareButtonProps = {
  dayIndex: number;
  guesses: Guess[];
  won: boolean;
};

function getGuessWord(count: number): string {
  const tens = count % 100;
  const ones = count % 10;

  if (ones === 1 && tens !== 11) return "спробу";
  if (ones >= 2 && ones <= 4 && (tens < 10 || tens >= 20)) return "спробы";
  return "спроб";
}

function generateShareText({
  dayIndex,
  guesses,
  won,
}: ShareButtonProps): string {
  // Convert dayIndex back to date using the same epoch as game-engine
  const epoch = new Date(EPOCH_DATE);
  const date = new Date(epoch.getTime() + dayIndex * 24 * 60 * 60 * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  // Count guesses by color groups
  const colorGroups = [
    { emoji: "🟩", count: 0, maxRank: 100 }, // Rank 1-100 (green)
    { emoji: "🟧", count: 0, maxRank: 1000 }, // Rank 101-1000 (orange)
    { emoji: "🟦", count: 0, maxRank: Infinity }, // Rank 1001+ (blue)
  ];

  // Count each guess
  guesses.forEach((guess) => {
    if (guess.rank <= 100) colorGroups[0].count++;
    else if (guess.rank <= 1000) colorGroups[1].count++;
    else colorGroups[2].count++;
  });

  // Generate Contexto-style emoji lines with proportional scaling
  const maxGroupCount = Math.max(...colorGroups.map((g) => g.count));
  const emojiLines = colorGroups
    .filter((group) => group.count > 0)
    .map((group) => {
      // Scale emoji count relative to the largest group, max 10, min 1 if group has guesses
      const scaledCount = Math.max(
        1,
        Math.round((group.count / maxGroupCount) * 10),
      );
      const emojiCount = Math.min(scaledCount, group.count, 10);
      const emojis = group.emoji.repeat(emojiCount);
      return `${emojis} ${group.count}`;
    })
    .join("\n");

  // Status line with proper grammar
  const guessCount = guesses.length;
  const guessWord = getGuessWord(guessCount);
  const hintsCount = guesses.filter((g) => g.isHint).length;
  const hintsText =
    hintsCount > 0
      ? ` (з ${hintsCount} ${pluralizeHintsInstrumental(hintsCount)})`
      : "";
  const status = won
    ? `Я адгадаў за ${guessCount} ${guessWord}${hintsText}`
    : `Я здаўся пасля ${guessCount} ${guessWord}${hintsText}`;

  return `Побач ${formattedDate}\n${status}\n${emojiLines}\npobach.app`;
}

async function handleShare(
  text: string,
): Promise<"share" | "clipboard" | false> {
  // Try Web Share API first
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return "share";
    } catch (err) {
      // User cancelled or error occurred - don't fall back to clipboard
      if (err instanceof Error && err.name === "AbortError") return false;
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return "clipboard";
  } catch {
    return false;
  }
}

export default function ShareButton({
  dayIndex,
  guesses,
  won,
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const onShare = async () => {
    if (isSharing) return;

    setIsSharing(true);
    const shareText = generateShareText({ dayIndex, guesses, won });

    const result = await handleShare(shareText);

    if (result === "clipboard") {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }

    setIsSharing(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={onShare}
        disabled={isSharing}
        aria-label="Падзяліцца вынікамі гульні"
        type="button"
        className="btn-primary"
      >
        <Share2 size={16} />
        Падзяліцца
      </button>

      {showToast && (
        <div
          aria-live="polite"
          className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-[var(--text)] text-[var(--bg)] text-xs font-medium whitespace-nowrap shadow-lg"
        >
          Скапіравана!
        </div>
      )}
    </div>
  );
}
