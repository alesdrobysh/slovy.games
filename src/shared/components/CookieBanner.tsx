"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBannerSlot } from "@/shared/components/BannerContext";
import { BottomBanner } from "@/shared/components/BottomBanner";
import { useAnalytics } from "@/shared/lib/analytics";

export default function CookieBanner() {
	const { hasConsented, giveConsent } = useAnalytics();
	const { isVisible, isPreempted, show, dismiss } = useBannerSlot("cookie", 1);
	const pathname = usePathname();

	const themeClass = pathname?.startsWith("/pobach")
		? "theme-pobach"
		: pathname?.startsWith("/valoshka")
			? "theme-valoshka"
			: "";

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
			themeClass={themeClass}
		/>
	);
}
