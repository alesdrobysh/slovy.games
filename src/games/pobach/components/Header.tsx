"use client";

import { ArrowLeft, BarChart2, HelpCircle, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/shared/hooks/useTheme";

const PAGE_TITLES: Record<string, string> = {
  "/": "ПОБАЧ",
  "/stats": "Статыстыка",
  "/about": "Пра гульню",
  "/privacy": "Прыватнасць",
};

export default function Header({ onHelpClick }: { onHelpClick?: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const title = PAGE_TITLES[pathname] ?? "ПОБАЧ";

  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="flex items-center justify-between px-4 py-3 max-w-[600px] mx-auto">
        {/* Left: back button (non-home) or logo */}
        {!isHome ? (
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label="Назад"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--border)] transition-colors text-[var(--text)]"
            >
              <ArrowLeft size={18} />
            </Link>
            <span className="font-serif font-bold text-[var(--text)] tracking-wide text-xl leading-none">
              {title}
            </span>
          </div>
        ) : (
          <span className="font-serif font-bold text-[var(--accent)] tracking-wider text-[1.75rem] leading-none">
            {title}
          </span>
        )}

        {/* Right: icon group */}
        <div className="flex items-center gap-1">
          {onHelpClick && (
            <button
              type="button"
              onClick={onHelpClick}
              aria-label="Як гуляць?"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--border)] transition-colors text-[var(--text)]"
            >
              <HelpCircle size={18} />
            </button>
          )}
          <Link
            href="/stats"
            aria-label="Статыстыка"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--border)] transition-colors text-[var(--text)]"
          >
            <BarChart2 size={18} />
          </Link>
          <button
            onClick={toggleTheme}
            aria-label={`Пераключыць на ${theme === "light" ? "цёмную" : "светлую"} тэму`}
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--border)] transition-colors text-[var(--text)]"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
