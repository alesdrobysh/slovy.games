"use client";

import { useEffect } from "react";
import { useBannerSlot } from "@/shared/components/BannerContext";
import { BottomBanner } from "@/shared/components/BottomBanner";

export default function ServiceWorkerRegistration() {
	const { isVisible, show } = useBannerSlot("sw-update", 2);

	useEffect(() => {
		if (
			!("serviceWorker" in navigator) ||
			process.env.NODE_ENV !== "production"
		)
			return;

		const hadController = !!navigator.serviceWorker.controller;

		navigator.serviceWorker.register("/sw.js");

		const listener = () => {
			if (hadController) show();
		};
		navigator.serviceWorker.addEventListener("controllerchange", listener);
		return () =>
			navigator.serviceWorker.removeEventListener("controllerchange", listener);
	}, [show]);

	return (
		<BottomBanner
			ariaLabel="Даступна абнаўленне"
			message="Даступна новая версія гульні"
			buttonLabel="Абнавіць"
			onAction={() => window.location.reload()}
			isVisible={isVisible}
		/>
	);
}
