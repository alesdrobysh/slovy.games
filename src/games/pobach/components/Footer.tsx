"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/about", label: "Пра гульню" },
  { href: "/privacy", label: "Прыватнасць" },
  { href: "/stats", label: "Статыстыка" },
];

export default function Footer() {
  const pathname = usePathname();
  const links = LINKS.filter((l) => l.href !== pathname);
  return (
    <footer className="border-t border-[var(--accent)]/20 pt-6 mt-12 mb-8 text-center text-sm text-[var(--text-muted)]">
      <p className="mb-3">Зроблена з ❤️ да роднай мовы</p>
      <nav className="flex justify-center flex-wrap">
        {links.map((l, i) => (
          <span key={l.href} className="flex items-center">
            {i > 0 && <span className="mx-2">/</span>}
            <Link
              href={l.href}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {l.label}
            </Link>
          </span>
        ))}
      </nav>
    </footer>
  );
}
