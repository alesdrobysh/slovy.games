"use client";

import { useCallback, useEffect, useRef, useState } from "react";

async function shareText(text: string): Promise<"share" | "clipboard" | false> {
	if (navigator.share) {
		try {
			await navigator.share({ text });
			return "share";
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") return false;
		}
	}

	try {
		await navigator.clipboard.writeText(text);
		return "clipboard";
	} catch {
		return false;
	}
}

export function useShare(text: string) {
	const [isSharing, setIsSharing] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const doShare = useCallback(async () => {
		if (isSharing) return;
		setIsSharing(true);

		const result = await shareText(text);

		if (result === "clipboard") {
			setShowToast(true);
			timerRef.current = setTimeout(() => setShowToast(false), 2000);
		}

		setIsSharing(false);
	}, [text, isSharing]);

	return { share: doShare, isSharing, showToast };
}
