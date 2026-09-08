"use client";

import { useEffect, useState } from "react";

export interface VirtualKeyboardState {
	/** True while the on-screen keyboard is (very likely) showing. */
	open: boolean;
	/** Height in px of the layout viewport hidden behind the keyboard. */
	inset: number;
}

/** Below this the visual viewport shrink is browser chrome, not a keyboard. */
const KEYBOARD_INSET_THRESHOLD = 80;

const CLOSED: VirtualKeyboardState = { open: false, inset: 0 };

function isTextField(element: Element | null): boolean {
	if (!(element instanceof HTMLElement)) return false;
	if (element.isContentEditable) return true;
	if (element instanceof HTMLTextAreaElement) return true;
	if (!(element instanceof HTMLInputElement)) return false;
	return !/^(button|checkbox|radio|range|submit|reset|file|color)$/.test(
		element.type
	);
}

function measure(): VirtualKeyboardState {
	const viewport = window.visualViewport;
	const inset = viewport
		? Math.max(
				0,
				Math.round(window.innerHeight - (viewport.offsetTop + viewport.height))
			)
		: 0;
	if (inset >= KEYBOARD_INSET_THRESHOLD) return { open: true, inset };
	// Android with `interactive-widget=resizes-content` shrinks the layout
	// viewport instead, so the inset stays 0. A focused text field on a touch
	// device is the best remaining signal.
	const touch = window.matchMedia?.("(pointer: coarse)").matches ?? false;
	return { open: touch && isTextField(document.activeElement), inset };
}

/**
 * Tracks the mobile on-screen keyboard.
 *
 * Publishes `--keyboard-inset` and `data-keyboard="open" | "closed"` on the
 * root element so fixed/sticky chrome can move above the keyboard and
 * collapse via the `keyboard:` Tailwind variant.
 */
export function useVirtualKeyboard(): VirtualKeyboardState {
	const [state, setState] = useState<VirtualKeyboardState>(CLOSED);

	useEffect(() => {
		const root = document.documentElement;
		const update = () => {
			const next = measure();
			root.dataset.keyboard = next.open ? "open" : "closed";
			root.style.setProperty("--keyboard-inset", `${next.inset}px`);
			setState((prev) =>
				prev.open === next.open && prev.inset === next.inset ? prev : next
			);
		};
		update();

		const viewport = window.visualViewport;
		viewport?.addEventListener("resize", update);
		viewport?.addEventListener("scroll", update);
		window.addEventListener("resize", update);
		document.addEventListener("focusin", update);
		document.addEventListener("focusout", update);
		return () => {
			viewport?.removeEventListener("resize", update);
			viewport?.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
			document.removeEventListener("focusin", update);
			document.removeEventListener("focusout", update);
			delete root.dataset.keyboard;
			root.style.removeProperty("--keyboard-inset");
		};
	}, []);

	return state;
}
