"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getMskDateString } from "@/shared/lib/timezone";

/** Refetch the page when `date` is no longer today in MSK — e.g. a mobile
 *  tab left open overnight and resumed without a reload. */
export function useStaleDayRefresh(date: string): void {
	const router = useRouter();

	useEffect(() => {
		function check() {
			if (document.visibilityState !== "visible") return;
			if (date !== getMskDateString()) router.refresh();
		}

		check();
		document.addEventListener("visibilitychange", check);
		window.addEventListener("pageshow", check);
		return () => {
			document.removeEventListener("visibilitychange", check);
			window.removeEventListener("pageshow", check);
		};
	}, [date, router]);
}
