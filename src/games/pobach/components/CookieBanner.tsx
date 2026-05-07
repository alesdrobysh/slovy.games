"use client";

import { useEffect } from "react";
import { useAnalytics } from "@/games/pobach/providers/AnalyticsContext";
import { useBannerSlot } from "@/games/pobach/providers/BannerContext";
import { BottomBanner } from "./BottomBanner";

export default function CookieBanner() {
	const { hasConsented, giveConsent } = useAnalytics();
	const { isVisible, isPreempted, show, dismiss } = useBannerSlot("cookie", 1);

	useEffect(() => {
		if (hasConsented === false) show();
	}, [hasConsented, show]);

	return (
		<BottomBanner
			ariaLabel="Паведамленне пра cookies"
			message="Мы выкарыстоўваем cookies, каб захоўваць ваш прагрэс і аналізаваць статыстыку гульні."
			buttonLabel="Зразумела"
			onAction={() => {
				dismiss();
				giveConsent();
			}}
			isVisible={isVisible}
			instant={isPreempted}
		/>
	);
}
