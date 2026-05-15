"use client";

import { Button } from "@/shared/components/ui/Button";

interface BottomBannerProps {
	ariaLabel: string;
	message: string;
	buttonLabel: string;
	onAction: () => void;
	isVisible: boolean;
	themeClass?: string;
}

export function BottomBanner({
	ariaLabel,
	message,
	buttonLabel,
	onAction,
	isVisible,
	themeClass = "",
}: BottomBannerProps) {
	if (!isVisible) return null;

	return (
		<section
			role="status"
			aria-label={ariaLabel}
			className={`${themeClass} fixed bottom-0 left-0 right-0 z-40`}
			style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
		>
			<div className="w-full bg-card border-t border-rule px-5 py-4 flex items-center justify-between gap-4">
				<p className="text-sm text-ink-muted flex-1">{message}</p>
				<Button onClick={onAction} variant="solid" color="primary">
					{buttonLabel}
				</Button>
			</div>
		</section>
	);
}
