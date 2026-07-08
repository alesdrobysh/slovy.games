"use client";

import posthog from "posthog-js";
import { useCallback, useState } from "react";

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

export interface UseShareOptions {
	game: string;
	context: "finish" | "stats" | "in_progress";
}

export function useShare(text: string, options: UseShareOptions) {
	const [isSharing, setIsSharing] = useState(false);
	const [showToast, setShowToast] = useState(false);

	const doShare = useCallback(async () => {
		if (isSharing) return;
		setIsSharing(true);

		const result = await shareText(text);

		posthog.capture("share_clicked", {
			game: options.game,
			context: options.context,
			method:
				result === "share"
					? "native_share"
					: result === "clipboard"
						? "clipboard"
						: "failed",
		});

		if (result) {
			setShowToast(true);
			setTimeout(() => setShowToast(false), 2000);
		}

		setIsSharing(false);
	}, [text, isSharing, options.game, options.context]);

	return { share: doShare, isSharing, showToast };
}
