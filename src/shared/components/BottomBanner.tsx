"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui/Button";

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
	themeClass?: string;
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
	themeClass = "",
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
			className={`${themeClass} fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100 visible" : "translate-y-full opacity-0 invisible"}`}
			style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
		>
			<div className="w-full bg-card border-t border-rule px-5 py-4 flex items-center justify-between gap-4">
				<p className="text-sm text-ink-muted flex-1">{message}</p>
				<Button
					ref={buttonRef}
					onClick={onAction}
					variant="solid"
					color="primary"
				>
					{buttonLabel}
				</Button>
			</div>
		</section>
	);
}
