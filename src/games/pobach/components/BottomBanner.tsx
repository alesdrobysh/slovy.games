"use client";

import { useEffect, useRef, useState } from "react";

interface BottomBannerProps {
  ariaLabel: string;
  message: string;
  buttonLabel: string;
  onAction: () => void;
  isVisible: boolean;
  /** Skip the out-animation (e.g. when preempted by a higher-priority banner) */
  instant?: boolean;
  role?: "status" | "alert";
  focusOnShow?: boolean;
}

export function BottomBanner({
  ariaLabel,
  message,
  buttonLabel,
  onAction,
  isVisible,
  instant = false,
  role,
  focusOnShow = false,
}: BottomBannerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      prevFocusRef.current = document.activeElement as HTMLElement;
      if (focusOnShow) buttonRef.current?.focus();
    } else {
      if (prevFocusRef.current) {
        prevFocusRef.current.focus();
        prevFocusRef.current = null;
      }
      const delay = instant ? 0 : 300;
      const t = setTimeout(() => setIsRendered(false), delay);
      return () => clearTimeout(t);
    }
  }, [isVisible, instant, focusOnShow]);

  if (!isRendered) return null;

  return (
    <section
      role={role}
      aria-label={ariaLabel}
      aria-hidden={!isVisible}
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100 visible" : "translate-y-full opacity-0 invisible"}`}
    >
      <div className="w-full bg-[var(--card)] border-t border-[var(--border)] px-5 py-4 flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--text-muted)] flex-1">{message}</p>
        <button
          ref={buttonRef}
          onClick={onAction}
          type="button"
          className="btn-primary shrink-0 text-sm px-4 py-2"
        >
          {buttonLabel}
        </button>
      </div>
    </section>
  );
}
