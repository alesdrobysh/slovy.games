import type { ReactNode } from "react";

export interface SlideFrameProps {
	children: ReactNode;
	/** Optional slide-specific class, e.g. a game theme. */
	accentClassName?: string;
	variant?: "hero" | "common" | "game" | "thin" | "share";
}

/** Full-viewport slide body with a deliberately celebratory Wrapped canvas. */
export function SlideFrame({
	children,
	accentClassName,
	variant,
}: SlideFrameProps) {
	return (
		<div
			className={`wrapped-frame wrapped-frame--${variant ?? "hero"} ${accentClassName ?? ""}`}
		>
			{children}
		</div>
	);
}
