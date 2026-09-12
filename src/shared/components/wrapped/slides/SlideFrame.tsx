import type { ReactNode } from "react";

export interface SlideFrameProps {
	children: ReactNode;
	/** Accent token class for the background wash, e.g. `bg-pobach-soft`. */
	accentClassName?: string;
}

/** Full-viewport slide body: centred column, generous inset, no scroll. */
export function SlideFrame({ children, accentClassName }: SlideFrameProps) {
	return (
		<div
			className={`flex h-full w-full flex-col items-center justify-center gap-flow-lg p-inset-xl text-center ${accentClassName ?? "bg-paper"}`}
		>
			{children}
		</div>
	);
}
