"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  title: string;
};

export default function Modal({ children, onClose, title }: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-[var(--bg)]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation only prevents overlay close */}
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--card)] rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2
            id="modal-title"
            className="font-serif text-xl font-semibold text-[var(--text)]"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Закрыць"
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--border)] transition-colors text-lg leading-none"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
