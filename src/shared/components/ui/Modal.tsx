"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	maxWidth?: string;
	/** "sheet" slides up from the bottom on phones (menus); "center" is a dialog. */
	placement?: "center" | "sheet";
}

const FOCUSABLE_SELECTOR = [
	"button:not([disabled])",
	"[href]",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	'[tabindex]:not([tabindex="-1"])',
].join(",");

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	maxWidth = "480px",
	placement = "center",
}: ModalProps) {
	const isSheet = placement === "sheet";
	const dialogRef = useRef<HTMLDivElement>(null);
	const backdropRef = useRef<HTMLDivElement>(null);
	const prevFocusRef = useRef<HTMLElement | null>(null);
	const [mounted, setMounted] = useState(false);
	// The dialog is portalled to <body>, outside any `.theme-*` wrapper. Find the
	// theme the modal was opened from so its accent colors follow the game.
	const [themeClass, setThemeClass] = useState("");
	const findTheme = useCallback((anchor: HTMLSpanElement | null) => {
		if (!anchor) return;
		const themed = anchor.closest<HTMLElement>('[class*="theme-"]');
		const name = themed
			? [...themed.classList].find((c) => c.startsWith("theme-"))
			: undefined;
		setThemeClass(name ?? "");
	}, []);

	useEffect(() => setMounted(true), []);

	useEffect(() => {
		if (!isOpen || !mounted) return;
		prevFocusRef.current = document.activeElement as HTMLElement;
		queueMicrotask(() => {
			const dialog = dialogRef.current;
			if (!dialog) return;
			const meaningful = Array.from(
				dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
			).find((element) => element.getAttribute("aria-label") !== "Закрыць");
			(meaningful ?? dialog).focus();
		});

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
				return;
			}
			if (event.key !== "Tab" || !dialogRef.current) return;
			const controls = Array.from(
				dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
			).filter((element) => !element.hidden && element.tabIndex !== -1);
			if (controls.length === 0) {
				event.preventDefault();
				dialogRef.current.focus();
				return;
			}
			const first = controls[0];
			const last = controls[controls.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			} else if (!dialogRef.current.contains(document.activeElement)) {
				event.preventDefault();
				first.focus();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, mounted, onClose]);

	useEffect(() => {
		if (!isOpen || !mounted) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const backdrop = backdropRef.current;
		const background = Array.from(document.body.children).filter(
			(element): element is HTMLElement =>
				element instanceof HTMLElement && element !== backdrop
		);
		const previous = background.map((element) => ({
			element,
			inert: element.inert,
			hadInertAttribute: element.hasAttribute("inert"),
			ariaHidden: element.getAttribute("aria-hidden"),
		}));
		for (const element of background) {
			element.inert = true;
			element.setAttribute("inert", "");
			element.setAttribute("aria-hidden", "true");
		}
		return () => {
			document.body.style.overflow = prev;
			for (const item of previous) {
				item.element.inert = item.inert;
				if (!item.hadInertAttribute) item.element.removeAttribute("inert");
				if (item.ariaHidden === null)
					item.element.removeAttribute("aria-hidden");
				else item.element.setAttribute("aria-hidden", item.ariaHidden);
			}
			prevFocusRef.current?.focus();
		};
	}, [isOpen, mounted]);

	if (!isOpen || !mounted) return null;

	return (
		<>
			<span ref={findTheme} hidden />
			{createPortal(
				// biome-ignore lint/a11y/noStaticElementInteractions: presentation backdrop
				<div
					ref={backdropRef}
					onClick={onClose}
					role="presentation"
					className={`${themeClass} fixed inset-0 z-50 flex justify-center bg-paper/70 backdrop-blur-sm ${isSheet ? "items-end sm:items-center sm:p-4" : "items-center p-4"}`}
				>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation only */}
					<div
						ref={dialogRef}
						tabIndex={-1}
						onClick={(e) => e.stopPropagation()}
						role="dialog"
						aria-modal="true"
						aria-labelledby={title ? "modal-title" : undefined}
						className={`bg-card ring-1 ring-rule shadow-2xl w-full overflow-y-auto overflow-x-hidden focus-visible:outline-none ${isSheet ? "rounded-t-2xl sm:rounded-2xl pb-[env(safe-area-inset-bottom)]" : "rounded-2xl"}`}
						style={{ maxWidth, maxHeight: "90vh" }}
					>
						{title && (
							<div className="flex items-center justify-between px-inset-lg py-4 border-b border-rule">
								<h2
									id="modal-title"
									className="font-display text-xl font-semibold text-ink"
								>
									{title}
								</h2>
								<button
									onClick={onClose}
									aria-label="Закрыць"
									type="button"
									className="size-(--control-min-height) flex items-center justify-center rounded-full text-ink-muted hover:bg-rule transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-card"
								>
									<X size={18} aria-hidden="true" />
								</button>
							</div>
						)}
						<div className="px-inset-lg py-4">{children}</div>
					</div>
				</div>,
				document.body
			)}
		</>
	);
}
