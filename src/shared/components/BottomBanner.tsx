"use client";

import { useEffect, useRef } from "react";
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
	const bannerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!isVisible || !bannerRef.current) return;
		const root = document.documentElement;
		const updateReservedHeight = () => {
			const height = bannerRef.current?.getBoundingClientRect().height ?? 0;
			root.style.setProperty("--bottom-banner-height", `${height}px`);
		};
		updateReservedHeight();
		window.addEventListener("resize", updateReservedHeight);
		return () => {
			window.removeEventListener("resize", updateReservedHeight);
			root.style.removeProperty("--bottom-banner-height");
		};
	}, [isVisible]);

	if (!isVisible) return null;

	return (
		<section
			ref={bannerRef}
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
