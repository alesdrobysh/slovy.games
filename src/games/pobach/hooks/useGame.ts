"use client";

import { useCallback, useEffect, useState } from "react";
import type { CurrentGame, Guess } from "@/games/pobach/core/entities/game";
import { useAnalytics } from "@/games/pobach/hooks/useAnalytics";
import { triggerConfetti } from "@/games/pobach/lib/confetti";
import { vibrate } from "@/games/pobach/lib/haptics";
import {
  cleanupOldHistoryEntries,
  getCurrentDayIndex,
  getSessionId,
  loadGameState,
  migrateStorage,
  saveGameResult,
  saveGameState,
} from "@/games/pobach/lib/storage";

export interface GameState {
  input: string;
  guesses: Guess[];
  lastGuess: Guess | null;
  loading: boolean;
  error: string | null;
  errorWord: string | null;
  dayIndex: number | null;
  sessionDayIndex: number | null;
  won: boolean;
  sessionId: string;
  gameOver: boolean;
  targetWord: string;
}

export interface GameActions {
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  getHint: () => Promise<void>;
  handleGiveUp: () => Promise<void>;
  clearError: () => void;
}

export interface UseGameReturn {
  state: GameState;
  actions: GameActions;
}

export function useGame(): UseGameReturn {
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [lastGuess, setLastGuess] = useState<Guess | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorWord, setErrorWord] = useState<string | null>(null);
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [sessionDayIndex, setSessionDayIndex] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [gameOver, setGameOver] = useState(false);
  const [targetWord, setTargetWord] = useState<string>("");

  const {
    trackGameStart,
    trackGuess,
    trackUnknownWord,
    trackHint,
    trackWin,
    trackGiveUp,
  } = useAnalytics(sessionId, dayIndex);

  // Initialize game on mount
  useEffect(() => {
    migrateStorage();

    const currentSessionId = getSessionId();
    setSessionId(currentSessionId);

    cleanupOldHistoryEntries([745]);

    const currentGame = loadGameState();
    const currentDay = getCurrentDayIndex();

    if (currentGame) {
      setGuesses(currentGame.guesses);
      setDayIndex(currentGame.dayIndex);
      setSessionDayIndex(currentGame.dayIndex);

      // Check completion state from currentGame or detect from guesses (backward compat)
      const isWon =
        currentGame.won ?? currentGame.guesses.some((g: Guess) => g.rank === 1);
      const isGameOver =
        currentGame.gameOver ??
        currentGame.guesses.some((g: Guess) => g.rank === 1);

      if (isGameOver) {
        setGameOver(true);
        setWon(isWon);
        if (isWon) {
          triggerConfetti();
        } else {
          // Fetch target word for "gave up" games
          fetch("/api/target-word", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dayIndex: currentGame.dayIndex }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.targetWord) {
                setTargetWord(data.targetWord);
              }
            })
            .catch(console.error);
        }
      }
    } else {
      setSessionDayIndex(currentDay);
    }
  }, []);

  // Persist game state
  useEffect(() => {
    if (dayIndex !== null && guesses.length > 0) {
      const currentGame: CurrentGame = {
        dayIndex,
        guesses,
        startedAt: Date.now(),
        gameOver,
        won,
      };
      saveGameState(currentGame);
    }
  }, [guesses, dayIndex, gameOver, won]);

  const clearError = useCallback(() => {
    setError(null);
    setErrorWord(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const wordToGuess = input
        .trim()
        .toLowerCase()
        .replace(/[\u2019\u02BC`]/g, "'");
      if (!wordToGuess || loading || won) return;

      if (guesses.some((g) => g.word === wordToGuess)) {
        vibrate("short");
        setErrorWord(wordToGuess);
        setError("вы ўжо ўводзілі гэтае слова");
        setTimeout(() => {
          setError(null);
          setErrorWord(null);
        }, 2000);
        setInput("");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const guessParams = new URLSearchParams({
          word: wordToGuess,
          dayIndex: String(sessionDayIndex),
        });
        const res = await fetch(`/api/guess?${guessParams}`);

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Памылка сервера");
          setTimeout(() => setError(null), 3000);
          return;
        }

        if (data.isUnknown) {
          vibrate("short");
          trackUnknownWord(wordToGuess);
          setErrorWord(wordToGuess);
          setError("я не ведаю гэтага слова");
          setTimeout(() => {
            setError(null);
            setErrorWord(null);
          }, 2000);
          return;
        }

        if (typeof data.rank === "number" && data.rank > 0) {
          if (dayIndex !== null && data.dayIndex !== dayIndex) {
            setGuesses([]);
            setWon(false);
            setGameOver(false);
            setLastGuess(null);
          }

          if (dayIndex === null || data.dayIndex !== dayIndex) {
            setDayIndex(data.dayIndex);
          }

          const newGuess = { word: data.word, rank: data.rank };

          trackGuess(data.word, data.rank, data.similarity ?? 0);

          const currentGuesses =
            dayIndex !== null && data.dayIndex !== dayIndex ? [] : guesses;

          if (currentGuesses.some((g) => g.word === data.word)) {
            vibrate("short");
            setErrorWord(data.word);
            setError("вы ўжо ўводзілі гэтае слова");
            setTimeout(() => {
              setError(null);
              setErrorWord(null);
            }, 2000);
            setInput("");
            return;
          }

          setLastGuess(newGuess);

          if (currentGuesses.length === 0) {
            trackGameStart();
          }

          const newGuesses = [...currentGuesses, newGuess].sort(
            (a, b) => a.rank - b.rank,
          );
          setGuesses(newGuesses);
          if (newGuess.rank === 1) {
            vibrate("long");
            setWon(true);
            setGameOver(true);
            triggerConfetti();
            trackWin(newGuesses.length);
            saveGameResult(
              data.dayIndex,
              true,
              newGuesses.length,
              1,
              newGuesses,
            );
          }
          setInput("");
        } else {
          setError("Няправільны адказ ад сервера");
          setTimeout(() => setError(null), 3000);
        }
      } catch (err) {
        console.error("Guess error:", err);
        setError("Памылка злучэння з серверам");
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoading(false);
      }
    },
    [
      input,
      loading,
      won,
      guesses,
      sessionDayIndex,
      dayIndex,
      trackGuess,
      trackUnknownWord,
      trackWin,
      trackGameStart,
    ],
  );

  const getHint = useCallback(async () => {
    if (won || loading) return;
    const bestRank = guesses.length > 0 ? guesses[0].rank : 100000;
    const usedRanks = guesses.map((g) => g.rank);

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bestRank,
          usedRanks,
          sessionId,
          dayIndex: sessionDayIndex,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Памылка сервера");
        setTimeout(() => setError(null), 3000);
        return;
      }

      if (!data.word || typeof data.rank !== "number") {
        setError("Няправільны адказ ад сервера");
        setTimeout(() => setError(null), 3000);
        return;
      }

      if (dayIndex !== null && data.dayIndex !== dayIndex) {
        setGuesses([]);
        setWon(false);
        setGameOver(false);
        setLastGuess(null);
      }

      if (dayIndex === null || data.dayIndex !== dayIndex) {
        setDayIndex(data.dayIndex);
      }

      const currentGuesses =
        dayIndex !== null && data.dayIndex !== dayIndex ? [] : guesses;

      if (currentGuesses.some((g) => g.word === data.word)) {
        setError("Падказка ўжо ў спісе");
        setTimeout(() => setError(null), 2000);
        return;
      }

      const newGuess = {
        word: data.word,
        rank: data.rank,
        isHint: true as const,
      };
      setLastGuess(newGuess);

      trackHint(data.word, data.rank);

      const newGuesses = [...currentGuesses, newGuess].sort(
        (a, b) => a.rank - b.rank,
      );
      setGuesses(newGuesses);
      if (newGuess.rank === 1) {
        vibrate("long");
        setWon(true);
        setGameOver(true);
        triggerConfetti();
        trackWin(newGuesses.length);
        saveGameResult(data.dayIndex, true, newGuesses.length, 1, newGuesses);
      }
    } catch (e) {
      console.error("Hint error:", e);
      setError("Памылка злучэння з серверам");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  }, [
    won,
    loading,
    guesses,
    sessionId,
    sessionDayIndex,
    dayIndex,
    trackHint,
    trackWin,
  ]);

  const handleGiveUp = useCallback(async () => {
    if (dayIndex === null) return;

    try {
      const response = await fetch("/api/target-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayIndex: sessionDayIndex }),
      });

      if (response.ok) {
        const data = await response.json();
        setTargetWord(data.targetWord);
      }

      setGameOver(true);
      setWon(false);

      const bestRank =
        guesses.length > 0 ? Math.min(...guesses.map((g) => g.rank)) : 0;
      trackGiveUp(guesses.length, bestRank);
      saveGameResult(dayIndex, false, guesses.length, bestRank, guesses);
    } catch (error) {
      console.error("Failed to get target word:", error);
    }
  }, [dayIndex, sessionDayIndex, guesses, trackGiveUp]);

  return {
    state: {
      input,
      guesses,
      lastGuess,
      loading,
      error,
      errorWord,
      dayIndex,
      sessionDayIndex,
      won,
      sessionId,
      gameOver,
      targetWord,
    },
    actions: {
      setInput,
      handleSubmit,
      getHint,
      handleGiveUp,
      clearError,
    },
  };
}
