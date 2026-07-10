/**
 * Epoch dates used for calculating each game's puzzle day indices.
 * Corresponds to dayIndex 0 for the respective game. Live in shared so
 * both the games and shared hub-state logic can reference them without
 * shared code depending on `@/games/*`.
 */
export const POBACH_EPOCH_DATE = "2026-01-15T00:00:00Z";
export const VALOSHKA_EPOCH_DATE = "2026-07-10T00:00:00Z";
export const SAKRETNA_EPOCH_DATE = "2026-07-11T00:00:00Z";
