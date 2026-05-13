"use client";

import Link from "next/link";
import { GameCard } from "@/shared/components/GameCard";
import { useHubState } from "@/shared/hooks/useHubState";
import { GAMES } from "@/shared/types";

function dayOrdinal(n: number): string {
  if (n === 1) return "дзень";
  if (n >= 2 && n <= 4) return "дні";
  return "дзён";
}

function getDayIndex(): number {
  const epoch = new Date(Date.UTC(2024, 0, 1));
  const utcMs = Date.UTC(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );
  return Math.floor((utcMs - epoch.getTime()) / 86400000);
}

export default function HubPage() {
  const hub = useHubState(GAMES);
  const games = GAMES.filter((g) => g.enabled);
  const dayIdx = getDayIndex();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-screen-xl mx-auto w-full px-5 sm:px-8 py-12 sm:py-20">
        {/* Hero */}
        <div className="mb-14 sm:mb-20 max-w-3xl animate-fade-in-up">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-balance text-ink mb-5">
            Ваш штодзённы інтэлектуальны рытуал.
          </h1>
          <p className="text-lg sm:text-xl text-ink-muted text-pretty max-w-[56ch] leading-relaxed">
            Дзве новыя галаваломкі кожны дзень. Адкрывайце багацце беларускай
            мовы — спакойна, засяроджана, без спеху.
          </p>

          {hub.currentStreak > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-ink-muted">
              <span className="text-pobach font-semibold">
                {hub.currentStreak} {dayOrdinal(hub.currentStreak)} запар
              </span>
            </div>
          )}
        </div>

        {/* Game cards */}
        <section
          aria-label="Сённяшнія гульні"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10"
        >
          {games.map((game, i) => {
            const status = hub.statuses.get(game.id);
            return (
              <GameCard
                key={game.id}
                game={game}
                hasPlayedToday={status?.hasPlayedToday ?? false}
                progressText={status?.progressText}
                ctaLabel={status?.ctaLabel}
                delay={i * 100}
              />
            );
          })}
          {games.length === 0 && (
            <p className="text-center text-sm text-ink-muted col-span-2">
              Хутка тут з&rsquo;явяцца новыя гульні.
            </p>
          )}
        </section>

        {/* Stats CTA */}
        <section className="mt-20 pt-10 border-t border-rule flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between animate-fade-in-up">
          <p className="text-sm text-ink-muted max-w-[52ch] leading-relaxed text-pretty">
            Сачыце за сваёй серыяй перамог і глядзіце, колькі слоў вы
            знайшлі. Усё захоўваецца тут, на вашай прыладзе.
          </p>
          <Link
            href="/stats"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-ink hover:text-pobach transition-colors no-underline"
          >
            Статыстыка
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}
